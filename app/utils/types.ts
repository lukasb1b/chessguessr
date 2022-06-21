export interface Game {
  id: number;
  date: string;
  fen: string;
  solution: string[];
  gameUrl: string;
  white: string;
  black: string;
  wRating: number;
  bRating: number;
}
