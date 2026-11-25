import { MovieSummary } from "../types";
import { useFetch } from "./useFetch";

interface ListData {
  movies?: MovieSummary[];
}

export const useMovies = () => {
  const { data, ...rest } = useFetch<ListData>(
    "/list_movies.json?minimum_rating=9&sort_by=year"
  );
  return { movies: data?.movies ?? [], ...rest };
};
