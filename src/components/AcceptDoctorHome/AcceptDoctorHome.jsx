import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./AcceptDoctorHome.module.scss"
import useDateFormatter from "../../hooks/useDateFormatter";

const AcceptDoctorHome = () => {
  const [notifications, setNotifications] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL; // Viteの環境変数からbaseURLを取得（必要に応じて修正）
  const token = Cookies.get("token"); // JS Cookieを使ってtokenを取得
  const navigate = useNavigate();
  const formatDate = useDateFormatter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // 最初の呼び出し
    const intervalId = setInterval(fetchNotifications, 30000); // 30秒ごとに呼び出し

    return () => clearInterval(intervalId); // コンポーネントがアンマウントされる際にクリア
  }, [baseURL, token]);

  const handleNotificationClick = (notificationId) => {
    // 通知をクリックしたときにRequestReviewページへ遷移
    navigate(`/request-review/${notificationId}`);
  };

  const handleExamDetailClick = (notificationId) => {
   
      navigate(`/accepted-exam-detail/${notificationId}`);
    
  };

  return (
    <>
      <div className={styles["awaiting-approval"]}>
        <div className={styles["notifications-header"]}>承認待ちリスト</div>

        <div className={styles["notifications-detail"]}>
          {notifications
            .sort((a, b) => a.id - b.id)
            .filter((notification) => notification.status === 0)
            .map((notification) => (
              <div
                key={notification.id}
                className={styles["notification-item"]}
              >
                <p className={styles["notification-date"]}>
                  {formatDate(notification.updated_at)}
                </p>
                <p>　</p>
                <p className={styles["notification-user"]}>
                  {notification.from_user.name}
                </p>
                {/* <p className={styles["notification-status"]}>
                    依頼が受諾されました
                  </p> */}
                <button
                  onClick={() => handleNotificationClick(notification.id)}
                  className={styles["awaiting-detail-button"]}
                >
                  詳細
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className={styles["approved-list"]}>
        <div className={styles["approved-header"]}>承認済みリスト</div>

        <div className={styles["approved-detail"]}>
          {notifications
            .sort((a, b) => a.id - b.id)
            .filter((notification) => notification.status === 1)
            .map((notification) => (
              <div key={notification.id} className={styles["approved-item"]}>
                <p className={styles["approved-date"]}>
                  {formatDate(notification.updated_at)}
                </p>
                <p>　</p>
                <p className={styles["approved-user"]}>
                  {notification.from_user.name}
                </p>
                <button
                  onClick={() => handleExamDetailClick(notification.id)}
                  className={styles["approved-detail-button"]}
                >
                  検査に進む
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AcceptDoctorHome;
