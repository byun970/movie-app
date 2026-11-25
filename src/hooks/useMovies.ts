import { useCallback, useEffect, useState } from "react";
import { MovieSummary } from "../types";
import { Filters } from "../filters";
import { fetchJson, getErrorMessage } from "../api";

interface ListData {
  movies?: MovieSummary[];
  movie_count?: number;
}

export const useMovies = ({ query, genre, sort }: Filters) => {
  const key = `${query}|${genre}|${sort}`;
  // 필터(key)가 바뀌면 자동으로 1페이지부터 다시 시작한다
  const [paging, setPaging] = useState({ key, page: 1 });
  const page = paging.key === key ? paging.page : 1;

  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      minimum_rating: "8",
      sort_by: sort,
      page: String(page),
    });
    if (query) params.set("query_term", query);
    if (genre) params.set("genre", genre);
    if (sort === "title") params.set("order_by", "asc");

    setLoading(true);
    setError(null);
    if (page === 1) setMovies([]);

    fetchJson<ListData>(`/list_movies.json?${params.toString()}`, controller.signal)
      .then((data) => {
        const incoming = data.movies ?? [];
        setTotal(data.movie_count ?? 0);
        setMovies((prev) => {
          if (page === 1) return incoming;
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...incoming.filter((m) => !seen.has(m.id))];
        });
        setLoading(false);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(e));
        setLoading(false);
      });
    return () => controller.abort();
  }, [key, page, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMore = movies.length < total;
  const loadMore = useCallback(
    () => setPaging({ key, page: page + 1 }),
    [key, page]
  );
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { movies, loading, error, hasMore, loadMore, retry, page };
};
