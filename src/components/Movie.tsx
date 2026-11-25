import React from "react";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";

interface MovieProps {
  id: number;
  coverImg: string;
  title: string;
  genres: string[];
}

const Movie = ({ id, coverImg, title }: MovieProps) => {
  return (
    <div className={styles.box}>
      <img src={coverImg} alt={title} />
      <h2>
        <Link to={`/movie/${id}`}>{title}</Link>
      </h2>
    </div>
  );
};

export default Movie;
