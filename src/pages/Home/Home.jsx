import  { useState, useEffect } from "react";
import RequestDoctorHome from "../../components/RequestDoctorHome/RequestDoctorHome";
import AcceptDoctorHome from "../../components/AcceptDoctorHome/AcceptDoctorHome";
import axios from "axios";
import Cookies from "js-cookie";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
 const token = Cookies.get("token");
  useEffect(() => {
    // ユーザー情報をAPIから取得
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/get-user-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // APIのエンドポイントを適切に設定
        setUserData(response.data);
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました: ", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { role } = userData;

  return (
    <>
      <div>Home</div>
      {role === 1 ? (
        <AcceptDoctorHome userData={userData} />
      ) : (
        <RequestDoctorHome userData={userData} />
      )}
    </>
  );
};

export default Home;
