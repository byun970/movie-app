import React from "react";
import Movie from "../components/Movie";
import Status from "../components/Status";
import styles from "./Home.module.css";
import { useMovies } from "../hooks/useMovies";

const Home = () => {
  const { movies, loading, error, retry } = useMovies();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (error) {
    return (
      <Status
        title="영화 목록을 불러오지 못했어요"
        message={error}
        onRetry={retry}
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
