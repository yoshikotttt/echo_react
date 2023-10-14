import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  return (
    <div className={styles.header}>
      <img
        src={`${baseURL}/images/2.png`}
        alt="Logo"
        className={styles["header-logo"]}
      />
      <div className={styles["header-title"]}>HOME</div>
      <div className={styles["header-subtitle"]}>
        <Link to="/profile-edit">プロフィール編集</Link>
      </div>
      <div className={styles["user-dropdown"]}>ようこそ user13 さん ▼</div>
    </div>
  );
};

export default Header;
