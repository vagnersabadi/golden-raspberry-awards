export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}

export interface MovieFilterParams {
  page: number;
  size: number;
  winner?: boolean;
  year?: number;
}
