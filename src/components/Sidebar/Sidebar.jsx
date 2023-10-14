// import React from "react";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["logo"]}>ECHO STATION</div>
      <div className={styles["menu-item"]}>検査依頼</div>
      <div className={styles["menu-item"]}>エコー学習</div>
      <div className={styles["menu-item"]}>予備・教育</div>
      <div className={styles["menu-item"]}>画像診療依頼助</div>
    </div>
  );
};


export default Sidebar;

