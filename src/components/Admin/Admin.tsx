import React from "react";
import AdminLinks from "../../api/adminLinks";
import Styles from "./Admin.module.css";

const Admin: React.FC = () => {
  return (
    <div className={Styles.adminContainer}>
      <AdminLinks />
    </div>
  );
};

export default Admin;