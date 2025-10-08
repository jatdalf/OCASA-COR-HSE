import React from "react";
import styles from "./AccessButton.module.css";
import { Link } from "react-router-dom";

interface AccessButtonProps {
  address: string;
  text?: string;
}

const AccessButton: React.FC<AccessButtonProps> = ({ address, text = "Acceder" }) => {
  const isExternal = address.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={address}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.accessButton}
      >
        {text}
      </a>
    );
  }

  return (
    <Link to={address} className={styles.accessButton}>
      {text}
    </Link>
  );
};

export default AccessButton;
