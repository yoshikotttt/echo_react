import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./ExamDetailInput.module.scss";

const ExamDetailInput = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const { register, handleSubmit, errors } = useForm();
  const location = useLocation();
  const responseData = location.state?.responseData;
  const notificationId = responseData.data.id;

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${baseURL}/api/medical-exams`,
        {
          ...data, // 他のdataもそのまま送信
          notification_id: notificationId, // ここで通知のIDをセット
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("登録が完了しました！");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label htmlFor="age" className={styles.label}>
            年齢
          </label>
          <input
            id="age"
            {...register("age", { required: "入力は必須です" })}
            placeholder="Age"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>性別</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                {...register("gender")}
                value="男性"
                className={styles.radio}
              />
              男性
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                {...register("gender")}
                value="女性"
                className={styles.radio}
              />
              女性
            </label>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="chief_complaint" className={styles.label}>
            主訴
          </label>
          <textarea
            {...register("chief_complaint")}
            id="chief_complaint"
            placeholder="Chief Complaint"
            className={styles.textarea}
            rows="4"
          ></textarea>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="medical_history" className={styles.label}>
            既往歴
          </label>
          <textarea
            {...register("medical_history")}
            id="medical_history"
            placeholder="Medical History"
            className={styles.textarea}
            rows="4"
          ></textarea>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="vitals" className={styles.label}>
            バイタル　他
          </label>
          <textarea
            {...register("vitals")}
            id="vitals"
            placeholder="Vitals"
            className={styles.textarea}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          検査情報を送信
        </button>
      </form>
    </>
  );
};

export default ExamDetailInput;
