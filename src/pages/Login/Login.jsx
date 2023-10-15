import { useState } from "react";
import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${baseURL}/api/login`, data);
      const {
        token,
        user: { id },
      } = response.data;

      // トークンをクッキーに保存
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user_id", id, { expires: 7 });

      setErrorMessage("");
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("ログインに失敗しました");
      }
      console.log(error);
    }
  };


  return (
    <div className={styles["login"]}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["login__container"]}
      >
        <label htmlFor="email" className={styles["login__label"]}>
          email
        </label>
        <input
          id="email"
          type="text"
          {...register("email", { required: "Emailは必須です" })}
          autoComplete="email"
        />

        <p className={styles["form__error"]}>
          {errors.email ? errors.email.message : null}
        </p>
        <label htmlFor="password">password</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "パスワードは必須です",
            minLength: { value: 8, message: "8文字以上で入力してください" },
          })}
          autoComplete="current-password"
        />
        <p className={styles["form__error"]}>
          {errors.password ? errors.password.message : null}
        </p>
        {errorMessage && (
          <p className={styles["login__error__message"]}>{errorMessage}</p>
        )}
        <button type="submit" className={styles["button"]}>
          Log in
        </button>
      </form>
      <div className={styles["register"]}>
        新規登録は
        <Link to="/register">
          <span className={styles["login__link"]}>こちら</span>
        </Link>
      </div>

    </div>
  );
};

export default Login;
