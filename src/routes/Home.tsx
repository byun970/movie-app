import React, { useEffect, useState } from "react";
import Movie from "../components/Movie";
import styles from "./Home.module.css";
import { MovieSummary } from "../types";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const getMovies = async () => {
    const json = await (
      await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=9&sort_by=year`
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
  };
  useEffect(() => {
    getMovies();
  }, []);
  return (
    <div>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>
            Top <span>Rated</span> Movies
          </h1>
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
        </div>
      )}
    </div>
  );
};

export default Home;
