import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from './Detail.module.css';
import { MovieDetail } from "../types";

const Detail = () => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const { id } = useParams();
  const getMovie = useCallback(async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    setMovie(json.data.movie);
    setLoading(false);
  }, [id]);
  useEffect(() => {
    getMovie();
  }, [getMovie]);

  return (
    <div className={styles.detail}>
      {loading || !movie ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
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
      )}
    </div>
  );
};

export default Detail;
