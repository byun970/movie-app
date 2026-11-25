import React, { useEffect, useState } from "react";
import styles from "./MovieFilters.module.css";
import { Filters, GENRES, SORT_OPTIONS, SortValue } from "../filters";

interface MovieFiltersProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}

const MovieFilters = ({ filters, onChange }: MovieFiltersProps) => {
  const [text, setText] = useState(filters.query);

  // 링크 이동 등으로 URL의 검색어가 바뀌면 입력창도 맞춘다
  useEffect(() => {
    setText(filters.query);
  }, [filters.query]);

  // 입력이 멈춘 뒤에만 검색해서 요청 수를 줄인다
  useEffect(() => {
    if (text.trim() === filters.query) return;
    const timer = setTimeout(() => onChange({ query: text.trim() }), 400);
    return () => clearTimeout(timer);
  }, [text, filters.query, onChange]);

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <input
          className={styles.search}
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="영화 제목으로 검색"
          aria-label="영화 검색"
        />
        <select
          className={styles.sort}
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortValue })}
          aria-label="정렬"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.chips}>
        <button
          className={filters.genre === "" ? styles.chipActive : styles.chip}
          onClick={() => onChange({ genre: "" })}
        >
          전체
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            className={filters.genre === g ? styles.chipActive : styles.chip}
            onClick={() => onChange({ genre: filters.genre === g ? "" : g })}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MovieFilters;
