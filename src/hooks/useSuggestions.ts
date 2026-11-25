import { MovieSummary } from "../types";
import { useFetch } from "./useFetch";

interface SuggestionsData {
  movies?: MovieSummary[];
}

// 비슷한 영화는 보조 정보라서 실패하면 조용히 숨긴다
export const useSuggestions = (id: string | undefined) => {
  const { data } = useFetch<SuggestionsData>(
    `/movie_suggestions.json?movie_id=${encodeURIComponent(id ?? "")}`
  );
  return data?.movies ?? [];
};
