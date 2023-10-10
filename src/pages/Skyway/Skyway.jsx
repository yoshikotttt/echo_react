import  { useEffect, useRef } from "react";
import Peer from "skyway-js";

const Skyway = ({ exam, skywayApiKey, skywayId }) => {
  const myVideoRef = useRef(null);
  const theirVideoRef = useRef(null);
  const peerRef = useRef(null);
  let localStream;
  let screenStream;
  let peer;

  useEffect(() => {
    // peerRef.current = new Peer({
    //     key: skywayApiKey,
    //     id: skywayId,
    //     debug: 3,
    // });

    peerRef.current = new Peer(skywayId, {
      key: skywayApiKey,
      debug: 3,
    });

    peerRef.current.on("open", () => {
      console.log("Peer is open. My Peer ID:", skywayId);
      console.log("Peer is open. My Peer ID:", peerRef.current.id);
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
  }, []);

  const handleMakeCall = () => {
    const theirID = document.getElementById("their-id").value;
    const mediaConnection = peerRef.current.call(theirID, localStream);
    console.log("me", mediaConnection);
    mediaConnection.on("stream", (stream) => {
      const videoElm = theirVideoRef.current;
      videoElm.srcObject = stream;
      videoElm.play();
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
    <div className="medical-exam-video">
      <div className="medical-exam-video__main">
        <video
          ref={myVideoRef}
          className="medical-exam-video__my-video"
          width={200}
        ></video>
        <p id="my-id" className="medical-exam-video__my-id"></p>
        <input
          id="their-id"
          className="medical-exam-video__their-id"
          placeholder="相手のID"
        />
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
        ></video>
        {/* <div className="medical-exam-video__details">
                    <p>{exam.age}</p>
                    <p>{exam.gender}</p>
                    <p>{exam.chief_complaint}</p>
                    <p>{exam.medical_history}</p>
                </div> */}
      </div>
    </div>
  );
};

export default Skyway;
