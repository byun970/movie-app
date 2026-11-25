import { MovieSummary } from "../types";
import { Filters } from "../filters";
import { useFetch } from "./useFetch";

interface ListData {
  movies?: MovieSummary[];
  movie_count?: number;
}

export const useMovies = ({ query, genre, sort }: Filters) => {
  const params = new URLSearchParams({ minimum_rating: "8", sort_by: sort });
  if (query) params.set("query_term", query);
  if (genre) params.set("genre", genre);
  if (sort === "title") params.set("order_by", "asc");

  const { data, ...rest } = useFetch<ListData>(
    `/list_movies.json?${params.toString()}`
  );
  return { movies: data?.movies ?? [], ...rest };
};
