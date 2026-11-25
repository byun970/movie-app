import React from "react";
import { Link } from "react-router-dom";
import styles from "./Status.module.css";

interface StatusProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  homeLink?: boolean;
}

const Status = ({ title, message, onRetry, homeLink }: StatusProps) => {
  return (
    <div className={styles.status} role="alert">
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.actions}>
        {onRetry && (
          <button className={styles.button} onClick={onRetry}>
            다시 시도
          </button>
        )}
        {homeLink && (
          <Link to="/" className={styles.button}>
            홈으로 이동
          </Link>
        )}
      </div>
    </div>
  );
};

export default Status;
