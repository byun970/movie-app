export interface MovieSummary {
  id: number;
  medium_cover_image: string;
  title: string;
  genres: string[];
}

export interface MovieDetail extends MovieSummary {
  year: number;
  runtime: number;
  description_full: string;
}
