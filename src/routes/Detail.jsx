import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from './Detail.module.css';

const Detail = () => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState([]);
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
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <img src={movie.medium_cover_image} alt={movie.id}></img>
          <h2>{movie.title}</h2>
          <div>
            <span>{movie.year} </span>
            <span>{movie.runtime}minutes </span>
            {movie.genres.map((g) => (
              <span key={g}>{g} </span>
            ))}
          </div>
          <div>
            <p>
              {movie.description_full}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
