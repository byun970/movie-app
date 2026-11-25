export interface MovieSummary {
  id: number;
  medium_cover_image: string;
  title: string;
  genres: string[];
}

export interface CastMember {
  name: string;
  character_name: string;
  imdb_code: string;
}

export interface MovieDetail extends MovieSummary {
  year: number;
  runtime: number;
  description_full: string;
  rating: number;
  like_count: number;
  mpa_rating?: string;
  yt_trailer_code?: string;
  background_image?: string;
  cast?: CastMember[];
}
