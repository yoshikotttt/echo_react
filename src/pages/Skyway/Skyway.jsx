import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "skyway-js";
import axios from "axios";

const Skyway = () => {
  const { notificationId } = useParams();
  const [mySkywayId, setMySkywayId] = useState(null); // 自身のSkywayID用のstate
  const [toUserSkywayId, setToUserSkywayId] = useState(null); // toUserのSkywayID用のstate
  const [fromUserSkywayId, setFromUserSkywayId] = useState(null); // fromUserのSkywayID用のstate
  const [skywayApiKey, setSkywayApiKey] = useState(null);
  const [toUserName, setToUserName] = useState(null);
  const [fromUserName, setFromUserName] = useState(null);
  const [isCalling, setIsCalling] = useState(false); // 発信中かどうかを保持する新しいstate
  const [medicalExam, setMedicalExam] = useState({});
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const [localStream, setLocalStream] = useState(null); // localStreamをステートとして管理

  const myVideoRef = useRef(null);
  const theirVideoRef = useRef(null);
  const peerRef = useRef(null);
  // let localStream;
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
        setFromUserSkywayId(response.data.fromUserSkywayId); // toUserのSkywayID
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
  console.log(fromUserSkywayId);
  // console.log(medicalExam)


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
        audio: {
          echoCancellation: true,
        },
      })
      .then((stream) => {
        console.log("stream確認", stream);
        const videoElm = myVideoRef.current;
        videoElm.srcObject = stream;
        videoElm.play();
        setLocalStream(stream); // ステートを更新
        console.log("確認", localStream);
      })
      .catch((error) => {
        console.error("mediaDevice.getUserMedia() error:", error);
      });

    // イベントリスナーの設定
    peerRef.current.on("call", (mediaConnection) => {
      mediaConnection.answer(localStream);
      mediaConnection.on("stream", (stream) => {
        console.log("Received stream from the other user"); // これを追加
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

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [mySkywayId]);

  useEffect(() => {
    console.log("localStreamが更新されました:", localStream);
  }, [localStream]);
  //ユーザーがページを閉じようとしたときに、接続やストリームを破棄
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        myVideoRef.current.srcObject = null; // <--- 追加
        theirVideoRef.current.srcObject = null; // <--- 追加
      }

      if (screenStream) {
        screenStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      myVideoRef.current.srcObject = null; // <--- 追加
      theirVideoRef.current.srcObject = null; // <--- 追加
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    });
  };

  //通話を開始する toUserSkywayIdにlocalStreamを送信する
  const handleMakeCall = () => {
    // setIsCalling(true);
    const mediaConnection = peerRef.current.call(toUserSkywayId, localStream);
    mediaConnection.on("stream", (stream) => {
      console.log("Received stream from the other user (caller side)"); // caller側でのログ
      const videoElm = theirVideoRef.current;
      videoElm.srcObject = stream;
      videoElm.play();
    });
  };

  //画面共有を開始する関数
  const handleShareScreen = async () => {
    if (!localStream) {
      // localStreamの存在確認
      console.error("Local stream is not initialized.");
      return;
    }
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // localStreamからの音声トラックをscreenStreamに追加
      localStream.getAudioTracks().forEach((track) => {
        screenStream.addTrack(track.clone());
      });

      myVideoRef.current.srcObject = screenStream;
      myVideoRef.current.play();

      if (toUserSkywayId) {
        const mediaConnection = peerRef.current.call(
          toUserSkywayId,
          screenStream
        );
        setEventListener(mediaConnection);
      }
    } catch (error) {
      console.error("getDisplayMedia() error:", error);
    }
  };

  //画面共有を停止
  const handleStopScreen = () => {
    if (screenStream) {
      const tracks = screenStream.getTracks();
      tracks.forEach((track) => track.stop());
      myVideoRef.current.srcObject = null; // <--- 追加
      theirVideoRef.current.srcObject = null; // <--- 追加
      myVideoRef.current.srcObject = localStream;
      myVideoRef.current.play();

      // ステップ3: 新しいカメラのストリームを使用して、相手に再度通話を開始する
      if (toUserSkywayId) {
        const mediaConnection = peerRef.current.call(
          toUserSkywayId,
          localStream
        );
        setEventListener(mediaConnection);
      }
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      myVideoRef.current.srcObject = null;
      theirVideoRef.current.srcObject = null; // <--- 追加
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      myVideoRef.current.srcObject = null;
    }

    theirVideoRef.current.srcObject = null;

    if (peerRef.current) {
      peerRef.current.destroy();
    }
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
            autoPlay
            muted
          ></video>

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
          <button
            onClick={handleEndCall}
            className="medical-exam-video__end-call-button"
          >
            接続終了
          </button>
        </div>
        <div className="medical-exam-video__side">
          <video
            ref={theirVideoRef}
            className="medical-exam-video__their-video"
            width={200}
            autoPlay
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
