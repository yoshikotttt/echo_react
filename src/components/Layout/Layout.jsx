import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.scss"; // 追加: CSSのインポート

function Layout({ children }) {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}
      <div className={styles["layout-container"]}>
        <div className={styles["layout-sidebar"]}>
          {location.pathname !== "/login" &&
            location.pathname !== "/register" && <Sidebar />}
        </div>
        <div className={styles["layout-content"]}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
