import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL;
  // ログアウト処理を実行する関数
  const handleLogout = () => {
    // ユーザーにログアウトの確認を求める
    if (window.confirm("ログアウトしますか？")) {
      const token = Cookies.get("token");

      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        axios
          .post(`${baseURL}/api/logout`, null, { headers })
          .then((response) => {
            Cookies.remove("token");
            console.log("ログアウトしました");
            navigate("/login");
          })
          .catch((error) => {
            console.log("ログアウトエラー：", error);
          });
      } else {
        console.log("トークンがありません");
      }
    }
  };

  return (
    <div>
      {/* テキストリンクの場合 */}
      <span onClick={handleLogout}>ログアウト</span>
      {/* もしくはボタンの場合 */}
      {/* <button type="button" onClick={handleLogout}>ログアウト</button> */}
    </div>
  );
};

export default Logout;
