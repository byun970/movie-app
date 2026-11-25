import React, { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Movie from "../components/Movie";
import MovieFilters from "../components/MovieFilters";
import Status from "../components/Status";
import styles from "./Home.module.css";
import { useMovies } from "../hooks/useMovies";
import { DEFAULT_SORT, Filters, isSortValue } from "../filters";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get("sort");
  const filters: Filters = {
    query: searchParams.get("q") ?? "",
    genre: searchParams.get("genre") ?? "",
    sort: isSortValue(sortParam) ? sortParam : DEFAULT_SORT,
  };
  const { movies, loading, error, retry } = useMovies(filters);

  const handleChange = useCallback(
    (next: Partial<Filters>) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          const set = (key: string, value: string | undefined) => {
            if (value) params.set(key, value);
            else params.delete(key);
          };
          if ("query" in next) set("q", next.query);
          if ("genre" in next) set("genre", next.genre);
          if ("sort" in next) {
            set("sort", next.sort === DEFAULT_SORT ? "" : next.sort);
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Top <span>Rated</span> Movies
      </h1>
      <MovieFilters filters={filters} onChange={handleChange} />
      {loading ? (
        <div className={styles.listLoading}>Loading...</div>
      ) : error ? (
        <Status
          title="영화 목록을 불러오지 못했어요"
          message={error}
          onRetry={retry}
        />
      ) : movies.length === 0 ? (
        <p className={styles.empty}>조건에 맞는 영화가 없어요.</p>
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
