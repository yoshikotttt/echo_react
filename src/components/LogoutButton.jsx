// import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Logout = () => {
  // ログアウト処理を実行する関数
  const handleLogout = () => {
    // Cookieからトークンを取得
    const token = Cookies.get("token");

    if (token) {
      // リクエストヘッダーにトークンを含めるためのオブジェクトを作成
      const headers = {
        Authorization: `Bearer ${token}`,
      }; //response サーバーからのデータやHTTPステータスコード、ヘッダー情報などが含まれる

      // サーバーにログアウトのPOSTリクエストを送信
      axios
        .post("http://localhost/api/logout", null, { headers })
        .then((response) => {
          // ログアウト成功時の処理
          Cookies.remove("token"); // トークンをCookieから削除
          console.log("ログアウトしました");
        })
        .catch((error) => {
          // ログアウトエラー時の処理
          console.log("ログアウトエラー：", error);
        });
    } else {
      // トークンが存在しない場合の処理
      console.log("トークンがありません");
    }
  };

  // コンポーネントのレンダリング
  return (
    <div>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  );
};

export default Logout;
