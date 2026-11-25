import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Movie from "../components/Movie";
import Status from "../components/Status";
import styles from "./Detail.module.css";
import { useMovie } from "../hooks/useMovie";
import { useSuggestions } from "../hooks/useSuggestions";

const Detail = () => {
  const { id } = useParams();
  const { movie, loading, error, retry } = useMovie(id);
  const suggestions = useSuggestions(id);
  const [showTrailer, setShowTrailer] = useState(false);

  // 다른 영화로 이동하면 맨 위에서 시작하고 예고편은 닫는다
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowTrailer(false);
  }, [id]);

  useEffect(() => {
    if (movie) document.title = `${movie.title} · Movie App`;
    return () => {
      document.title = "Movie App";
    };
  }, [movie]);

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

  const backdrop = movie.background_image
    ? ({
        "--backdrop": `url("${movie.background_image}")`,
      } as React.CSSProperties)
    : undefined;
  const cast = (movie.cast ?? []).slice(0, 8);

  return (
    <div>
      <div className={styles.hero} style={backdrop}>
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
                {movie.rating > 0 && (
                  <span className={styles.rating}>★ {movie.rating}</span>
                )}
                <span>{movie.year}</span>
                <span>·</span>
                <span>{movie.runtime}분</span>
                {movie.mpa_rating && (
                  <span className={styles.mpa}>{movie.mpa_rating}</span>
                )}
                {movie.like_count > 0 && (
                  <span>♥ {movie.like_count.toLocaleString()}</span>
                )}
              </div>
              <div className={styles.genres}>
                {movie.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/?genre=${encodeURIComponent(g)}`}
                    className={styles.genre}
                  >
                    {g}
                  </Link>
                ))}
              </div>
              <p className={styles.description}>
                {movie.description_full || "줄거리 정보가 없어요."}
              </p>
              {movie.yt_trailer_code && !showTrailer && (
                <button
                  className={styles.trailerButton}
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ 예고편 보기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detail}>
        {movie.yt_trailer_code && showTrailer && (
          <section className={styles.section}>
            <h3>예고편</h3>
            <div className={styles.trailer}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${movie.yt_trailer_code}?autoplay=1`}
                title={`${movie.title} 예고편`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {cast.length > 0 && (
          <section className={styles.section}>
            <h3>출연진</h3>
            <ul className={styles.cast}>
              {cast.map((c) => (
                <li key={c.imdb_code}>
                  <strong>{c.name}</strong>
                  <span>{c.character_name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {suggestions.length > 0 && (
          <section className={styles.section}>
            <h3>비슷한 영화</h3>
            <div className={styles.suggestions}>
              {suggestions.map((m) => (
                <Movie
                  key={m.id}
                  id={m.id}
                  coverImg={m.medium_cover_image}
                  title={m.title}
                  genres={m.genres}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Detail;
