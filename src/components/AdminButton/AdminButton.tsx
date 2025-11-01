import React from "react";
import styles from "./AdminButton.module.css";
import HelmetGear from "../../assets/HelmetGear.gif";
import { Link } from "react-router-dom";

const AdminButton: React.FC = () => {
  return (
    <div className={styles.adminButtonContainer}>
      <Link to="/Admin" className={styles.link}>
        <div className={styles.iconContainer}>
          <img src={HelmetGear} alt="Admin" className={styles.adminIcon} />
        </div>
        <div className={styles.adminLabel}>Administrar Links</div>
      </Link>
    </div>
  );
};

export default AdminButton;
