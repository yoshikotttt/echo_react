import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { useUser } from "../../contexts/UserContext";
import Logout from "../LogoutButton";

const Header = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { user } = useUser();

  console.log(user);

  return (
    <div className={styles.header}>
      <img
        src={`${baseURL}/images/2.png`}
        alt="Logo"
        className={styles["header-logo"]}
      />
      <div className={styles["header-title"]}>
        <Link to="/">HOME</Link>
      </div>
      <div className={styles["header-subtitle"]}>
        <Link to="/profile-edit">プロフィール編集</Link>
      </div>
      {/* <div className={styles["user-name"]}>{user.name}さん</div> */}
      <div className={styles["header-logout"]}>
        <Logout />
      </div>
    </div>
  );
};

export default Header;
