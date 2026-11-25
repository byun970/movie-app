import React from "react";
import { Link, useParams } from "react-router-dom";
import Status from "../components/Status";
import styles from "./Detail.module.css";
import { useMovie } from "../hooks/useMovie";

const Detail = () => {
  const { id } = useParams();
  const { movie, loading, error, retry } = useMovie(id);

  if (loading) {
    return (
      <div className={styles.detail}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <Status
        title="영화 정보를 불러오지 못했어요"
        message={error}
        onRetry={retry}
        homeLink
      />
    );
  }
  if (!movie) {
    return (
      <Status
        title="영화를 찾을 수 없어요"
        message="존재하지 않거나 삭제된 영화입니다."
        homeLink
      />
    );
  }

  return (
    <div className={styles.detail}>
      <Link to="/" className={styles.back}>
        ← 목록으로
      </Link>
      <div className={styles.content}>
        <img
          className={styles.poster}
          src={movie.medium_cover_image}
          alt={movie.title}
        />
        <div className={styles.info}>
          <h2>{movie.title}</h2>
          <div className={styles.meta}>
            <span>{movie.year}</span>
            <span>·</span>
            <span>{movie.runtime}분</span>
            {movie.genres.map((g) => (
              <span key={g} className={styles.genre}>
                {g}
              </span>
            ))}
          </div>
          <p className={styles.description}>{movie.description_full}</p>
        </div>
      </div>
    </div>
  );
};

export default Detail;
