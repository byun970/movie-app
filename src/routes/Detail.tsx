import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Status from "../components/Status";
import styles from './Detail.module.css';
import { MovieDetail } from "../types";
import { fetchJson, getErrorMessage } from "../api";

interface DetailData {
  movie?: MovieDetail;
}

const Detail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [attempt, setAttempt] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setMovie(null);
    fetchJson<DetailData>(
      `/movie_details.json?movie_id=${encodeURIComponent(id ?? "")}`,
      controller.signal
    )
      .then((data) => {
        // 존재하지 않는 ID는 id 0, title null인 빈 영화로 응답된다
        setMovie(data.movie && data.movie.id && data.movie.title ? data.movie : null);
        setLoading(false);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(e));
        setLoading(false);
      });
    return () => controller.abort();
  }, [id, attempt]);

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
        onRetry={() => setAttempt((n) => n + 1)}
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
      <div>
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
    </div>
  );
};

export default Detail;
