import { Cell, TrackPiece, TrackType, Direction } from "../types/game";

const GRID_SIZE = 12;

export const getTrackConnections = (type: TrackType): Direction[] => {
  switch (type) {
    case "horizontal":
      return ["left", "right"];
    case "vertical":
      return ["top", "bottom"];
    case "curve-tl":
      return ["top", "left"];
    case "curve-tr":
      return ["top", "right"];
    case "curve-bl":
      return ["bottom", "left"];
    case "curve-br":
      return ["bottom", "right"];
    case "cross":
      return ["top", "right", "bottom", "left"];
    default:
      return [];
  }
};

export const generateRandomPiece = (): TrackPiece => {
  const types: TrackType[] = [
    "horizontal",
    "vertical",
    "curve-tl",
    "curve-tr",
    "curve-bl",
    "curve-br",
    "cross",
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    connections: getTrackConnections(type),
  };
};

export const initializeGrid = (level: number): Cell[][] => {
  const grid: Cell[][] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      let type: Cell["type"] = "empty";

      if (x === 0 && y === 0) {
        type = "start";
      } else if (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) {
        type = "end";
      } else {
        const obstacleChance = Math.random();
        const obstacleThreshold = 0.05 + level * 0.02;
        const bonusThreshold = 0.08;

        if (obstacleChance < obstacleThreshold) {
          type = Math.random() > 0.5 ? "rock" : "tree";
        } else if (obstacleChance < obstacleThreshold + bonusThreshold) {
          type = "bonus";
        }
      }

      row.push({ x, y, type });
    }
    grid.push(row);
  }

  // Place a visible start track on the A cell so it's clear which way the train begins.
  const startTrack = {
    id: "start-track",
    type: "horizontal" as TrackType,
    connections: getTrackConnections("horizontal" as TrackType),
  };

  grid[0][0] = { ...grid[0][0], track: startTrack };

  return grid;
};

export const canPlacePiece = (
  grid: Cell[][],
  x: number,
  y: number
): boolean => {
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
  const cell = grid[y][x];
  return cell.type === "empty" || cell.type === "bonus";
};

export const getOppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
  }
};

export const getNextCell = (
  x: number,
  y: number,
  direction: Direction
): { x: number; y: number } => {
  switch (direction) {
    case "top":
      return { x, y: y - 1 };
    case "bottom":
      return { x, y: y + 1 };
    case "left":
      return { x: x - 1, y };
    case "right":
      return { x: x + 1, y };
  }
};

export const validatePath = (
  grid: Cell[][]
): { isValid: boolean; path: { x: number; y: number }[] } => {
  const path: { x: number; y: number }[] = [];
  let current = { x: 0, y: 0 };
  const visited = new Set<string>();

  path.push(current);

  while (true) {
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) return { isValid: false, path };
    visited.add(key);

    if (current.x === GRID_SIZE - 1 && current.y === GRID_SIZE - 1) {
      return { isValid: true, path };
    }

    const cell = grid[current.y][current.x];

    // For start cell allow using its explicit track (we may have placed one),
    // otherwise look for outgoing connections from neighboring tracks.
    const candidates: Direction[] = [];

    if (cell.track) {
      candidates.push(...cell.track.connections);
    } else if (current.x === 0 && current.y === 0) {
      // no explicit track but try right and bottom as potential starts
      candidates.push("right", "bottom");
    }

    let foundNext: { x: number; y: number } | null = null;

    for (const dir of candidates) {
      const next = getNextCell(current.x, current.y, dir);
      if (
        next.x < 0 ||
        next.x >= GRID_SIZE ||
        next.y < 0 ||
        next.y >= GRID_SIZE
      )
        continue;

      const nextCell = grid[next.y][next.x];

      // Allow reaching the end even if there's no track on the end cell
      if (nextCell.type === "end") {
        foundNext = next;
        break;
      }

      if (!nextCell.track) continue;

      // Ensure the next cell has a connection back to the current cell
      const opposite = getOppositeDirection(dir);
      if (nextCell.track.connections.includes(opposite)) {
        foundNext = next;
        break;
      }
    }

    if (!foundNext) return { isValid: false, path };

    current = foundNext;
    path.push(current);

    if (path.length > GRID_SIZE * GRID_SIZE) return { isValid: false, path };
  }
};
