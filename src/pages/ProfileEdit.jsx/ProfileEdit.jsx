import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    role: null,
    region: "",
    qualification: "",
    qualification_year: "",
    areas: [],
  });
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm({ mode: "onChange" });

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
        setValue("email", response.data.email);
        setValue("name", response.data.name);
        setValue("role", response.data.role);
        setValue("region", response.data.region);
        setValue("qualification", response.data.qualification);
        setValue("qualification_year", response.data.qualification_year);

         if (response.data.areas) {
           response.data.areas.forEach((area) => {
             setValue(`areas[${area}]`, true);
           });
         }
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました: ", error);
      }
    };

    fetchUserData();
  }, [baseURL, token]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${baseURL}/api/profile-detail`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json", // ヘッダーの内容タイプをJSONに設定
          "X-HTTP-Method-Override": "PUT", // PUTに置き換える記述を書く
        },
      });
      console.log(response.status);
      navigate(-1);
    } catch (error) {
      console.log("Error response:", error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email:</label>
        <input type="text" id="email" name="email" {...register("email")} />
      </div>

      <div>
        <label>Name:</label>
        <input type="text" id="name" name="name" {...register("name")} />
      </div>

      <div>
        <label>Role:</label>
        <input
          type="radio"
          value="0"
          {...register("role", { required: true })}
          checked={userData && userData.role == 0}
        />
        依頼医
        <input
          type="radio"
          value="1"
          {...register("role", { required: true })}
          checked={userData && userData.role == 1}
        />
        受託医
      </div>

      <div>
        <label>地域:</label>
        <select {...register("region", { required: true })}>
          {["北海道", "東北", "関東", "中部", "関西", "中国四国", "九州"].map(
            (region) => (
              <option value={region} key={region}>
                {region}
              </option>
            )
          )}
        </select>
      </div>

      <div>
        <label>資格:</label>
        <select {...register("qualification", { required: true })}>
          {["専門医", "検査士"].map((qualification) => (
            <option value={qualification} key={qualification}>
              {qualification}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>資格取得年度:</label>
        <select {...register("qualification_year", { required: true })}>
          {Array.from({ length: new Date().getFullYear() - 1989 }).map(
            (_, index) => {
              const year = 1990 + index;
              return (
                <option value={year} key={year}>
                  {year}
                </option>
              );
            }
          )}
        </select>
      </div>

      <div>
        <label>対応可能領域:</label>
        {["上腹部", "下腹部", "心臓"].map((area) => (
          <label key={area}>
            <input
              type="checkbox"
              value={area}
              {...register("areas")}
              checked={userData.areas && userData.areas.includes(area)}
            />
            {area}
          </label>
        ))}
      </div>

      <button type="submit">送信</button>
    </form>
  );
};

export default ProfileEdit;
