import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AcceptDoctorHome = () => {
  const [notifications, setNotifications] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL; // Viteの環境変数からbaseURLを取得（必要に応じて修正）
  const token = Cookies.get("token"); // JS Cookieを使ってtokenを取得
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const navigate = useNavigate();

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
    if (expandedNotificationId === notificationId) {
      setExpandedNotificationId(null); // 既に展開されている通知をクリックした場合は、閉じる
    } else {
      setExpandedNotificationId(notificationId); // 通知を展開
    }
  };

  const handleApproveClick = async (notificationId) => {
    try {
      // ステータスを変更するAPIエンドポイントを呼び出し
      await axios.post(
        `${baseURL}/api/notifications/${notificationId}`,
        {
          status: 1, // 1は承認済みを表すステータス値。適切な値に置き換えてください。
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-HTTP-Method-Override": "PUT", // PUTに置き換える記述を書く
          },
        }
      );

      // 検査詳細ページへの遷移
      navigate(`/accepted-exam-detail/${notificationId}`);
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  console.log(notifications);
  return (
    <div>
      <div>AcceptDoctor</div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification.id)}
        >
          <p>From User: {notification.from_user_id}</p>
          {expandedNotificationId === notification.id && (
            <div>
              <p>Message: {notification.message}</p>
              {/* 必要に応じて他のフィールドも表示 */}
              <button onClick={() => handleApproveClick(notification.id)}>
                承認
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AcceptDoctorHome;
