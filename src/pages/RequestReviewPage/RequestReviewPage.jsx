import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./RequestReviewPage.module.scss"

const RequestReview = () => {
  const [notification, setNotification] = useState({});
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/notifications/${notificationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotification(response.data);
      } catch (error) {
        console.error("Error fetching notification details:", error);
      }
    };

    fetchNotificationDetail();
  }, [baseURL, token, notificationId]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/notifications/${notificationId}`,
        {
          ...data,
          status: 1, // 1は承認済みを表すステータス値。適切な値に置き換えてください。
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json", // ヘッダーの内容タイプをJSONに設定
            "X-HTTP-Method-Override": "PUT", // PUTに置き換える記述を書く
          },
        }
      );
      console.log(response.status);
      navigate(-1);
    } catch (error) {
      console.log("Error response:", error.response.data);
    }
  };

   const onCancel = async (data) => {
     try {
       const response = await axios.post(
         `${baseURL}/api/notifications/${notificationId}`,
         {
           ...data,
           status: 2, // 1は承認済みを表すステータス値。適切な値に置き換えてください。
         },
         {
           headers: {
             Authorization: `Bearer ${token}`,
             // "Content-Type": "application/json", // ヘッダーの内容タイプをJSONに設定
             "X-HTTP-Method-Override": "PUT", // PUTに置き換える記述を書く
           },
         }
       );
       console.log(response.status);
       navigate(-1);
     } catch (error) {
       console.log("Error response:", error.response.data);
     }
   };
//   const onCancel = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/api/notifications/${notificationId}`,
//         {
//           status: 2, // 2はキャンセル済みを表すステータス値
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-HTTP-Method-Override": "PUT", 
//           },
//         }
//       );
//       console.log(response.status);
//       navigate(-1); 
//     } catch (error) {
//       console.log("Error response:", error.response.data);
//     }
//   };

  return (
    <div className={styles["request-container"]}>
      <h2 className={styles["request-header"]}>依頼メッセージ</h2>
      <div className={styles["request-content"]}>
        <div className={styles["info-row-from"]}>
          <label className={styles["info-label"]}>送信者</label>
          <div className={styles["info-content"]}>
            {notification?.from_user?.name || "Loading..."}
          </div>
        </div>

        <div className={styles["info-row-message"]}>
          <label className={styles["info-label"]}>メッセージ</label>
          <div className={styles["info-content"]}>
            {notification?.message || "Loading..."}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["reply-form"]}
        >
          <label htmlFor="accept_message" className={styles["reply-label"]}>
            返信
          </label>
          <textarea
            id="accept_message"
            placeholder="メッセージを入力してください（必須）"
            rows={5}
            {...register("accept_message", { required: true })}
            className={styles["reply-textarea"]}
          ></textarea>
          {/* {errors.accept_message && <p className={styles["error-message"]}>このフィールドは必須です</p>} */}
          <div className={styles["button-group"]}>
            <button type="submit" className={styles["approve-button"]}>
              承諾
            </button>
            <button
              type="button" 
              onClick={handleSubmit(onCancel)} // クリックしたときに handleSubmit と共に onCancel メソッドを実行
              className={styles["cancel-button"]}
            >
              依頼を断る
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestReview;
