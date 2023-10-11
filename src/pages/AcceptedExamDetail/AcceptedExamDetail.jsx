import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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
    <div>
      {examDetail ? (
        <div>
          {/* 検査の詳細情報を表示 */}
          <div>年齢: {examDetail.age}</div>
          <div>性別: {examDetail.gender}</div>
          <div>主訴: {examDetail.chief_complaint}</div>
          <div>既往歴: {examDetail.medical_history}</div>
          <div>バイタル: {examDetail.vitals}</div>
          <button onClick={handleSkywayClick}>Skywayでコール開始</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AcceptedExamDetail;
