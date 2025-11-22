export type TrackType =
  | "horizontal"
  | "vertical"
  | "curve-tl"
  | "curve-tr"
  | "curve-bl"
  | "curve-br"
  | "cross";

export type CellType =
  | "empty"
  | "track"
  | "rock"
  | "tree"
  | "bonus"
  | "start"
  | "end";

export interface TrackPiece {
  id: string;
  type: TrackType;
  connections: Direction[];
}

export type Direction = "top" | "right" | "bottom" | "left";

export interface Cell {
  x: number;
  y: number;
  type: CellType;
  track?: TrackPiece;
}

export interface GameState {
  grid: Cell[][];
  currentPiece: TrackPiece | null;
  storedPiece: TrackPiece | null;
  nextPieces: TrackPiece[];
  score: number;
  level: number;
  timeLeft: number;
  isPlaying: boolean;
  isBuilding: boolean;
  trainPosition: { x: number; y: number } | null;
  isWon?: boolean;
  isLost?: boolean;
}
