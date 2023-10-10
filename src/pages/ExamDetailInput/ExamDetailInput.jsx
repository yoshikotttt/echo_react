import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";


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
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("age", { required: "入力は必須です" })}
          placeholder="Age"
        />
        {/* {errors.age && <p>{errors.age.message || "年齢は必須項目です"}</p>} */}

        <select {...register("gender")}>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
        </select>

        <input {...register("chief_complaint")} placeholder="Chief Complaint" />
        <input {...register("medical_history")} placeholder="Medical History" />
        <input {...register("vitals")} placeholder="Vitals" />
        <button type="submit">送信</button>
      </form>
    </>
  );
};

export default ExamDetailInput;
