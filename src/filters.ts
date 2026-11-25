export const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi",
  "Thriller",
];

export const SORT_OPTIONS = [
  { value: "rating", label: "평점순" },
  { value: "year", label: "최신순" },
  { value: "like_count", label: "인기순" },
  { value: "title", label: "제목순" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "rating";

export const isSortValue = (v: string | null): v is SortValue =>
  SORT_OPTIONS.some((o) => o.value === v);

export interface Filters {
  query: string;
  genre: string;
  sort: SortValue;
}
