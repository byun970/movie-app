import { MovieDetail } from "../types";
import { useFetch } from "./useFetch";

interface DetailData {
  movie?: MovieDetail;
}

export const useMovie = (id: string | undefined) => {
  const { data, ...rest } = useFetch<DetailData>(
    `/movie_details.json?movie_id=${encodeURIComponent(id ?? "")}&with_cast=true`
  );
  const movie = data?.movie;
  // 존재하지 않는 ID는 id 0, title null인 빈 영화로 응답된다
  return { movie: movie && movie.id && movie.title ? movie : null, ...rest };
};
