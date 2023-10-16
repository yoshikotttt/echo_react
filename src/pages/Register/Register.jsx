import {} from "react";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onSubmit" });

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const password = watch("password");

  const navigate = useNavigate(); // useNavigateを初期化

  const onSubmit = (data) => {
    axios
      .post(`${baseURL}/api/register`, data)
      .then(function (response) {
        console.log(response.status);
        if (response.status === 204) {
          navigate("/login");
        }
      })
      .catch((error) => {
       if (error.response) {
         // エラーステータスとエラーメッセージをログに出力
         console.error("エラーステータス:", error.response.status);
         console.error("エラー情報:", error.response.data);
       } else {
         // その他のエラー（ネットワークエラーなど）をログに出力
         console.error("APIリクエストエラー:", error.message);
       }
      });
  };

  return (
    <div className={styles["form-container"]}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles["form__label"]} htmlFor="name">
          name
        </label>
        <input
          className={styles["form__input"]}
          id="name"
          type="text"
          {...register("name", {
            required: "名前は必須です",
            minLength: { value: 4, message: "4文字以上で入力してください" },
          })}
        />
        <p className={styles["form__error"]}>
          {errors.name ? errors.name.message : null}
        </p>

        <label className={styles["form__label"]} htmlFor="email">
          email
        </label>
        <input
          className={styles["form__input"]}
          id="email"
          type="text"
          {...register("email", {
            required: "メールアドレスは必須です",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "有効なEmailアドレスを入力してください",
            },
          })}
        />
        <p className={styles["form__error"]}>
          {errors.email ? errors.email.message : null}
        </p>

        <label className={styles["form__label"]} htmlFor="password">
          password
        </label>
        <input
          className={styles["form__input"]}
          id="password"
          type="password"
          {...register("password", {
            required: "パスワードは必須です",
            minLength: { value: 8, message: "8文字以上で入力してください" },
          })}
        />
        <p className={styles["form__error"]}>
          {errors.password ? errors.password.message : null}
        </p>

        <label
          className={styles["form__label"]}
          htmlFor="password_confirmation"
        >
          password <span className={styles["confirmation-text"]}>（確認）</span>
        </label>
        <input
          className={styles["form__input"]}
          id="password_confirmation"
          type="password"
          {...register("password_confirmation", {
            required: "パスワード確認は必須です",
            validate: (value) =>
              value === password || "パスワードが一致しません",
          })}
        />
        <p className={styles["form__error"]}>
          {errors.password_confirmation
            ? errors.password_confirmation.message
            : null}
        </p>

        {/* Role 選択肢 */}
        <label className={styles["form__label"]} htmlFor="role">
          役割
        </label>
        <select
          className={styles["form__input"]}
          id="role"
          defaultValue=""
          {...register("role", {
            required: "役割の選択は必須です",
          })}
        >
          <option value="" disabled>
            選択してください
          </option>
          <option value="0">依頼医</option>
          <option value="1">受諾医</option>
        </select>
        <p className={styles["form__error"]}>
          {errors.role ? errors.role.message : null}
        </p>

        <button className={styles["form__button"]} type="submit">
          送信
        </button>
      </form>
      <div className={styles.register}>
        ログインは
        <Link to="/login">
          <span className={styles["form__link"]}>こちら</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
