import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AcceptDoctorHome = () => {
  const [notifications, setNotifications] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL; // Viteの環境変数からbaseURLを取得（必要に応じて修正）
  const token = Cookies.get("token"); // JS Cookieを使ってtokenを取得

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

  return (
    <div>
      <div>AcceptDoctor</div>
      {notifications.map((notification) => (
        <div key={notification.id}>
          {/* ここに各通知を表示するコードを書く */}
          <p>From User: {notification.from_user_id}</p>
          <p>Message: {notification.message}</p>
          {/* 必要に応じて他のフィールドも表示 */}
        </div>
      ))}
    </div>
  );
};

export default AcceptDoctorHome;
