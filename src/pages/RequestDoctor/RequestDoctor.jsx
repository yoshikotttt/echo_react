import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./RequestDoctor.module.scss";
import useConfirmModal from "../../hooks/useConfirmModal";


const RequestDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialResults = location.state ? location.state.data : [];
  const [results, setResults] = useState(initialResults);
  // const [selectedResult, setSelectedResult] = useState(null);
  // const [message, setMessage] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const confirmModal = useConfirmModal();
  // console.log(results);
  // console.log(location.state);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (data) => {
    // データの送信処理
     if (!data.selected_result) {
       alert("受託医師を選択してください");
       return;
     }
    try {
      const response = await axios.post(
        `${baseURL}/api/notifications`,
        {
          to_user_id: data.selected_result,
          message: data.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer トークンとして追加
          },
        }
      );
      console.log("依頼が完了しました！");
    
         confirmModal(
          
           "依頼が完了しました", // タイトル
           "続いて、検査の詳細情報を入力してください", // コンテンツ
           () => {} // OKボタンを押した時の動作（ここでは何もしない）
         );
       
      // APIの呼び出しが成功した後にページを遷移させる
      navigate("/exam-detail-input", {
        state: { responseData: response.data },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  return (
    <div className={styles["container"]}>
      <h3 className={styles["header"]}>検索結果　{results.length}　件</h3>
      <form className={styles["form"]} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["form-contents"]}>
          {results.map((result) => (
            <div key={result.id} className={styles["resultItem"]}>
              <div className={styles["resultDetail"]}>
                <div>
                  {result.qualification} / {result["region"]}
                </div>
                {/* {result.areas.map((area, index) => (
                  <div key={index}>{area}</div>
                ))} */}
              </div>
              <input
                type="radio"
                {...register("selected_result")}
                value={result.id}
              />
            </div>
          ))}
        </div>
        <div>
          <textarea
            {...register("message")}
            placeholder="メッセージを入力してください(必須）"
            className={styles["textArea"]}
            rows="4"
          />
        </div>
        <div className={styles["submitButtonContainer"]}>
          <button type="submit" className={styles["submitButton"]}>
            依頼する
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestDoctor;
