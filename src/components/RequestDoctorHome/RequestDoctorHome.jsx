// import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const RequestDoctorHome = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

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

  return (
    <div className="mt-4 text-center">
      <h3 className="text-xl mb-10 mt-20">検査を依頼する</h3>

      <div className="flex justify-center space-x-4">
        <button
          className="h-14 w-40 shadow-lg bg-blue-500 hover:bg-blue-600 shadow-blue-500/50 hover:shadow-blue-600/50 text-white rounded px-2 py-1 transition duration-300 ease-in-out"
          onClick={() => handleSearch("心臓")}
        >
          心臓
        </button>
        <button
          className="h-14 w-40 shadow-lg bg-blue-500 hover:bg-blue-600 shadow-blue-500/50 hover:shadow-blue-600/50 text-white rounded px-2 py-1 transition duration-300 ease-in-out"
          onClick={() => handleSearch("上腹部")}
        >
          上腹部
        </button>
        <button
          className="h-14 w-40 shadow-lg bg-blue-500 hover:bg-blue-600 shadow-blue-500/50 hover:shadow-blue-600/50 text-white rounded px-2 py-1 transition duration-300 ease-in-out"
          onClick={() => handleSearch("下腹部")}
        >
          下腹部
        </button>
      </div>
    </div>
  );
};

export default RequestDoctorHome;
