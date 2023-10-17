// import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RequestDoctorHome.module.scss";
import useDateFormatter from "../../hooks/useDateFormatter";

const RequestDoctorHome = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
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
  // console.log(notifications);

  const handleSearch = async (query) => {
    try {
      // APIからデータを取得する
      const response = await axios.get(`${baseURL}/api/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer トークンとして追加
        },
      });

      // データを次のページに渡して遷移する
      navigate("/request-doctor", { state: { data: response.data } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApproveClick = async (notificationId) => {
    // 検査詳細ページへの遷移
    navigate(`/accepted-exam-detail/${notificationId}`);
  };

  const handleDetailEditClick = async (notificationId) => {
    // 検査詳細ページへの遷移
    navigate(`/accepted-exam-detail/${notificationId}`);
  };

  return (
    <>
      <div className={styles["request-section"]}>
        <h3 className={styles["header"]}>検査を依頼する</h3>
        <div className={styles["button-group"]}>
          <button onClick={() => handleSearch("心臓")}>心臓</button>
          <button onClick={() => handleSearch("上腹部")}>上腹部</button>
          <button onClick={() => handleSearch("下腹部")}>下腹部</button>
        </div>
      </div>

      <div className={styles["notifications"]}>
        <div className={styles["notification-ok"]}>
          <div className={styles["notifications-header"]}>
            検査可能リスト
          </div>
          <div className={styles["notifications-detail"]}>
            {notifications
              .sort((a, b) => b.id - a.id)
              .filter((notification) => notification.status === 1)
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
                    {notification.to_user.name}
                  </p>
                  {/* <p className={styles["notification-status"]}>
                    依頼が受諾されました
                  </p> */}
                  <button
                    onClick={() => handleApproveClick(notification.id)}
                    className={styles["notification-detail-button"]}
                  >
                    詳細
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className={styles["awaiting-approval"]}>
          <div className={styles["notifications-header"]}>受託待ちリスト</div>

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
                    {notification.to_user.name}
                  </p>
                  {/* <p className={styles["notification-status"]}>
                    依頼が受諾されました
                  </p> */}
                  <button
                    onClick={() => handleDetailEditClick(notification.id)}
                    className={styles["awaiting-detail-button"]}
                  >
                    詳細
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={styles["cancel-approval"]}>
        <div className={styles["notifications-header"]}>キャンセル</div>
        <div className={styles["cancel-detail"]}>
          {notifications
            .sort((a, b) => a.id - b.id)
            .filter((notification) => notification.status === 2)
            .map((notification) => (
              <div key={notification.id} className={styles["cancel-item"]}>
                <p className={styles["cancel-date"]}>
                  {formatDate(notification.updated_at)}
                </p>
                <p>　</p>
                <p className={styles["cancel-user"]}>
                  {notification.to_user.name}
                </p>
                {/* <p className={styles["notification-status"]}>
                    依頼が受諾されました
                  </p> */}
                <button
                  onClick={() => handleDetailEditClick(notification.id)}
                  className={styles["cancel-button"]}
                >
                  詳細
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default RequestDoctorHome;
