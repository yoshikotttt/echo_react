import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "skyway-js";
import axios from "axios";

const Skyway = () => {
  const { notificationId } = useParams();
  const [mySkywayId, setMySkywayId] = useState(null); // 自身のSkywayID用のstate
  const [toUserSkywayId, setToUserSkywayId] = useState(null); // toUserのSkywayID用のstate
  const [skywayApiKey, setSkywayApiKey] = useState(null);
  const [toUserName, setToUserName] = useState(null);
  const [fromUserName, setFromUserName] = useState(null);
  const [isCalling, setIsCalling] = useState(false); // 発信中かどうかを保持する新しいstate
  const [medicalExam, setMedicalExam] = useState({});
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  const myVideoRef = useRef(null);
  const theirVideoRef = useRef(null);
  const peerRef = useRef(null);
  let localStream;
  let screenStream;

  useEffect(() => {
    // Skyway情報を取得するAPI呼び出し
    const fetchSkywayData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/notifications/${notificationId}/skyway-id`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMySkywayId(response.data.mySkywayId); // 自身のSkywayID
        setToUserSkywayId(response.data.toUserSkywayId); // toUserのSkywayID
        setSkywayApiKey(response.data.skywayApiKey);
        setToUserName(response.data.toUserName);
        setFromUserName(response.data.fromUserName);
        setMedicalExam(response.data.medicalExam);
      } catch (error) {
        console.error("Error fetching Skyway data:", error);
      }
    };

    fetchSkywayData();
  }, [notificationId, baseURL, token]);

  console.log(mySkywayId);
  console.log(toUserSkywayId);
  // console.log(skywayApiKey);

  useEffect(() => {
    if (!mySkywayId) return; // SkywayIDがまだ取得されていない場合は何もしない

    peerRef.current = new Peer(mySkywayId, {
      key: skywayApiKey,
      debug: 3,
    });

    peerRef.current.on("open", () => {
      console.log("Peer is open. My Peer ID:", mySkywayId);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const videoElm = myVideoRef.current;
        videoElm.srcObject = stream;
        videoElm.play();
        localStream = stream;
      })
      .catch((error) => {
        console.error("mediaDevice.getUserMedia() error:", error);
      });

    // イベントリスナーの設定
    peerRef.current.on("call", (mediaConnection) => {
      mediaConnection.answer(localStream);
      mediaConnection.on("stream", (stream) => {
        const videoElm = theirVideoRef.current;
        videoElm.srcObject = stream;
        videoElm.play();
      });
    });

    peerRef.current.on("error", (err) => {
      alert(err.message);
    });

    peerRef.current.on("close", () => {
      alert("通信が切断しました。");
    });
  }, [mySkywayId]);

  // const handleMakeCall = () => {
  //   setIsCalling(true); // 発信開始時にisCallingをtrueにする
  //   const theirID = document.getElementById("their-id").value;
  //   const mediaConnection = peerRef.current.call(theirID, localStream);
  //   console.log("me", mediaConnection);
  //   mediaConnection.on("stream", (stream) => {
  //     const videoElm = theirVideoRef.current;
  //     videoElm.srcObject = stream;
  //     videoElm.play();
  //     setIsCalling(false); // 接続が完了したらisCallingをfalseにする
  //   });
  // };

  const handleMakeCall = () => {
    setIsCalling(true); // 発信開始時にisCallingをtrueにする
    const mediaConnection = peerRef.current.call(toUserSkywayId, localStream);
    console.log("me", mediaConnection);
    mediaConnection.on("stream", (stream) => {
      const videoElm = theirVideoRef.current;
      videoElm.srcObject = stream;
      videoElm.play();
      setIsCalling(false); // 接続が完了したらisCallingをfalseにする
    });
  };

  // 画面共有の開始
  const handleShareScreen = async () => {
    // ... 画面共有のロジック
  };

  // 画面共有の停止
  const handleStopScreen = () => {
    // ... 画面共有停止のロジック
  };

  return (
    <>
      <p>{toUserName}さんへ依頼</p>
      {/* {isCalling && <div className="loading">接続中...</div>} */}
      <div className="medical-exam-video">
        <div className="medical-exam-video__main">
          <video
            ref={myVideoRef}
            className="medical-exam-video__my-video"
            width={200}
          ></video>
          {/* <p id="my-id" className="medical-exam-video__my-id"></p>
          <input
            id="their-id"
            className="medical-exam-video__their-id"
            placeholder="相手のID"
            value={toUserSkywayId || ""} // ここでtoUserSkywayIdをvalue属性にバインド
            readOnly // これでインプットが読み取り専用になる
          /> */}

          <button
            onClick={handleMakeCall}
            className="medical-exam-video__make-call-button"
          >
            発信
          </button>
          <button
            onClick={handleShareScreen}
            className="medical-exam-video__share-screen-button"
          >
            画面共有
          </button>
          <button
            onClick={handleStopScreen}
            className="medical-exam-video__stop-screen-button"
          >
            共有停止
          </button>
        </div>
        <div className="medical-exam-video__side">
          <video
            ref={theirVideoRef}
            className="medical-exam-video__their-video"
            width={200}
          ></video>
          <div className="medical-exam-video__details">
            <p>{medicalExam.age}</p>
            <p>{medicalExam.gender}</p>
            <p>{medicalExam.chief_complaint}</p>
            <p>{medicalExam.medical_history}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skyway;
