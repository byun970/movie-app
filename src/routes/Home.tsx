import React, { useEffect, useState } from "react";
import Movie from "../components/Movie";
import Status from "../components/Status";
import styles from "./Home.module.css";
import { MovieSummary } from "../types";
import { fetchJson, getErrorMessage } from "../api";

interface ListData {
  movies?: MovieSummary[];
}

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchJson<ListData>(
      "/list_movies.json?minimum_rating=9&sort_by=year",
      controller.signal
    )
      .then((data) => {
        setMovies(data.movies ?? []);
        setLoading(false);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(e));
        setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (error) {
    return (
      <Status
        title="영화 목록을 불러오지 못했어요"
        message={error}
        onRetry={() => setAttempt((n) => n + 1)}
      />
    );
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Top <span>Rated</span> Movies
      </h1>
      {movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <div className={styles.list}>
          {movies.map((movie) => (
            <Movie
              key={movie.id}
              id={movie.id}
              coverImg={movie.medium_cover_image}
              title={movie.title}
              genres={movie.genres}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
