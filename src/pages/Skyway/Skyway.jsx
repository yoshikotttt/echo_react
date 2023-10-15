import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "skyway-js";
import axios from "axios";
import styles from "./Skyway.module.scss";

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
  const [localStream, setLocalStream] = useState(null); // localStreamをステートとして管理
  const [isStreamReady, setIsStreamReady] = useState(false);

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

  useEffect(() => {
    if (isStreamReady) {
      peerRef.current.on("call", (mediaConnection) => {
        console.log("Answering the call");
        mediaConnection.answer(localStream);
        console.log("Local stream:", localStream);

        mediaConnection.on("stream", (stream) => {
          console.log("Received stream from the other user");
          const videoElm = theirVideoRef.current;
          videoElm.srcObject = stream;
          videoElm.play();
        });
      });
    }
  }, [isStreamReady]);

  // console.log(mySkywayId);
  // console.log(toUserSkywayId);
  // console.log(medicalExam)

  useEffect(() => {
    if (!mySkywayId) return; // SkywayIDがまだ取得されていない場合は何もしない

    peerRef.current = new Peer(mySkywayId, {
      key: skywayApiKey,
      debug: 3,
    });

    peerRef.current.on("open", () => {
      // console.log("Peer is open. My Peer ID:", mySkywayId);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
        },
      })
      .then((stream) => {
        console.log("Successfully got user media:", stream);
        const videoElm = myVideoRef.current;
        videoElm.srcObject = stream;
        videoElm.play();
        setLocalStream(stream); // ステートを更新
        setIsStreamReady(true); // ストリームが準備できたことを示すステートをtrueにする
      })
      .catch((error) => {
        console.error("mediaDevice.getUserMedia() error:", error);
      });

    // イベントリスナーの設定
    peerRef.current.on("call", (mediaConnection) => {
      if (!isStreamReady) {
        // ストリームが準備されていない場合、処理を終了する
        console.log("Stream is not ready yet.");
        return;
      }

      console.log("Answering the call");
      mediaConnection.answer(localStream);
      console.log("Local stream:", localStream);

      mediaConnection.on("stream", (stream) => {
        console.log("Received stream from the other user");
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

  // 相手との通信がつながって、相手の映像や音声データを受信した時にそのデータを表示する
  // 受信者の方で発火する関数
  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      console.log("Received a stream from the other user"); // こちらが追加された部分
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    });
  };

  //通話を開始する toUserSkywayIdにlocalStreamを送信する
  // 発信側で発火する関数
  // const handleMakeCall = () => {
  //   console.log("handleMakeCall関数が動いている");
  //   setIsCalling(true);
  //   const mediaConnection = peerRef.current.call(toUserSkywayId, localStream);
  //   console.log(mediaConnection);
  //   setEventListener(mediaConnection);
  // };
  const handleMakeCall = () => {
    console.log("handleMakeCall関数が動いている");
    setIsCalling(true);
    const mediaConnection = peerRef.current.call(toUserSkywayId, localStream);
    console.log(mediaConnection);

    // この部分を追加
    // ここのstreamは受信側のビデオの情報
    mediaConnection.on("stream", (stream) => {
      console.log("Received a stream from the other user");
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    });

    // setEventListener(mediaConnection); // この行は削除しても良い
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
      {/* <p>{toUserName}さんと接続中</p> */}
      {/* {isCalling && <div className="loading">接続中...</div>} */}
      <div className={styles["medical-exam-video"]}>
        <div className={styles["side"]}>
          <video
            ref={myVideoRef}
            className={styles["my-video"]}
            autoPlay
            muted
          ></video>
          <div className={styles["controls"]}>
            <button
              onClick={handleMakeCall}
              className={styles["make-call-button"]}
            >
              発信
            </button>
            <button
              onClick={handleShareScreen}
              className={styles["share-screen-button"]}
            >
              画面共有
            </button>
            <button
              onClick={handleStopScreen}
              className={styles["stop-screen-button"]}
            >
              共有停止
            </button>
            <button
              onClick={handleEndCall}
              className={styles["end-call-button"]}
            >
              接続終了
            </button>
          </div>
          <div className={styles["details"]}>
            <p className={styles["age-detail"]}>{medicalExam.age}</p>
            <p className={styles["gender-detail"]}>{medicalExam.gender}</p>
            <p className={styles["chief-complaint-detail"]}>
              {medicalExam.chief_complaint}
            </p>
            <p className={styles["medical-history-detail"]}>
              {medicalExam.medical_history}
            </p>
          </div>
        </div>
        <div className={styles["main"]}>
          <video
            ref={theirVideoRef}
            className={styles["their-video"]}
            autoPlay
          ></video>
        </div>
      </div>
    </>
  );
};

export default Skyway;
