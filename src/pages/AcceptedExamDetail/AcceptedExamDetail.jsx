import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./AcceptedExamDetail.module.scss"

const AcceptedExamDetail = () => {
  const { notificationId } = useParams();
  const [examDetail, setExamDetail] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/medical-exams/${notificationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExamDetail(response.data);
        console.log(examDetail)
      } catch (error) {
        console.error("Error fetching exam detail:", error);
      }
    };

    fetchExamDetail();
  }, [notificationId]);

    const handleSkywayClick = () => {
      // Skywayのページに遷移するコード
    navigate(`/skyway/${notificationId}`);
     
    };

  return (
    <div className={styles["examDetailContainer"]}>
      {examDetail ? (
        <div className={styles["examDetailContent"]}>
          <div className={styles["dataItem"]}>
            <span className={styles["label"]}>送信時メッセージ</span>
            <span className={styles["detail"]}>
              {examDetail.notification.message}
            </span>
          </div>
          <div className={styles["dataItem"]}>
            <span className={styles["label"]}>年齢</span>
            <span className={styles["detail"]}>{examDetail.age}</span>
          </div>
          <div className={styles["dataItem"]}>
            <span className={styles["label"]}>性別</span>
            <span className={styles["detail"]}>{examDetail.gender}</span>
          </div>
          <div className={styles["dataItem"]}>
            <span className={styles["label"]}>主訴</span>
            <span className={styles["detail"]}>
              {examDetail.chief_complaint}
            </span>
          </div>
          <div className={styles["dataItem"]}>
            <span className={styles["label"]}>既往歴</span>
            <span className={styles["detail"]}>
              {examDetail.medical_history}
            </span>
          </div>
          <div className={styles["dataItem"]}>
            <span className={styles["label"]}>バイタル</span>
            <span className={styles["detail"]}>{examDetail.vitals}</span>
          </div>
          <button
            className={styles["skywayButton"]}
            onClick={handleSkywayClick}
          >
            コール開始
          </button>
        </div>
      ) : (
        <div className={styles["loading"]}>Loading...</div>
      )}
    </div>
  );
};

export default AcceptedExamDetail;
