import { useState, useEffect, useCallback } from "react";
import { GameState, TrackPiece, Cell } from "../types/game";
import {
  initializeGrid,
  generateRandomPiece,
  canPlacePiece,
  validatePath,
} from "../utils/gameLogic";

const BUILD_TIME = 60;

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    grid: initializeGrid(1),
    currentPiece: generateRandomPiece(),
    storedPiece: null,
    nextPieces: Array.from({ length: 5 }, generateRandomPiece),
    score: 0,
    level: 1,
    timeLeft: BUILD_TIME,
    isPlaying: false,
    isBuilding: true,
    trainPosition: null,
    isWon: false,
    isLost: false,
  }));

  const [draggedPiece, setDraggedPiece] = useState<TrackPiece | null>(null);
  const [validatedPath, setValidatedPath] = useState<
    { x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isBuilding) return;

    if (gameState.trainPosition === null) {
      setGameState((prev: GameState) => ({
        ...prev,
        trainPosition: { x: 0, y: 0 },
      }));
      return;
    }

    const speed = Math.max(500 - gameState.level * 50, 200);
    const timer = setTimeout(() => {
      const currentIndex = validatedPath.findIndex(
        (pos) =>
          pos.x === gameState.trainPosition?.x &&
          pos.y === gameState.trainPosition?.y
      );

      // If we have a next position in the validated path, try to move there.
      if (currentIndex >= 0 && currentIndex < validatedPath.length - 1) {
        const nextPos = validatedPath[currentIndex + 1];

        const currentCell =
          gameState.grid[gameState.trainPosition!.y][
            gameState.trainPosition!.x
          ];
        const nextCell = gameState.grid[nextPos.y][nextPos.x];

        // Determine direction from current -> next
        const dx = nextPos.x - gameState.trainPosition!.x;
        const dy = nextPos.y - gameState.trainPosition!.y;
        const direction =
          dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "bottom" : "top";

        // Check that current cell has a track with that outgoing connection
        const currentHas = currentCell.track?.connections.includes(
          direction as any
        );
        // And next cell has the opposite connection (unless it's the end cell)
        const opposite = (() => {
          switch (direction) {
            case "top":
              return "bottom";
            case "bottom":
              return "top";
            case "left":
              return "right";
            default:
              return "left";
          }
        })();

        const nextHas =
          nextCell.type === "end"
            ? true
            : nextCell.track?.connections.includes(opposite as any);

        if (!currentHas || !nextHas) {
          setGameState((prev: GameState) => ({
            ...prev,
            isPlaying: false,
            isLost: true,
          }));
          return;
        }

        let scoreIncrease = 10;
        if (nextCell.type === "bonus") {
          scoreIncrease = 50;
        }

        // Move train and award points
        setGameState((prev: GameState) => ({
          ...prev,
          trainPosition: nextPos,
          score: prev.score + scoreIncrease,
        }));
      } else {
        // No next position in path: either reached end or path terminated early
        const atEnd =
          gameState.trainPosition?.x === gameState.grid.length - 1 &&
          gameState.trainPosition?.y === gameState.grid.length - 1;

        if (atEnd) {
          setGameState((prev: GameState) => ({
            ...prev,
            isPlaying: false,
            isWon: true,
          }));
        } else {
          setGameState((prev: GameState) => ({
            ...prev,
            isPlaying: false,
            isLost: true,
          }));
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [
    gameState.trainPosition,
    gameState.isPlaying,
    gameState.isBuilding,
    gameState.level,
    validatedPath,
    gameState.grid,
  ]);

  useEffect(() => {
    if (!gameState.isBuilding || gameState.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setGameState((prev: GameState) => {
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          const validation = validatePath(prev.grid);
          setValidatedPath(validation.path);
          // Always start the train after build time; the train will lose if path breaks.
          return {
            ...prev,
            timeLeft: 0,
            isBuilding: false,
            isPlaying: true,
            trainPosition: { x: 0, y: 0 },
            isWon: false,
            isLost: false,
          };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isBuilding, gameState.timeLeft]);

  const handleDragStart = useCallback((piece: TrackPiece) => {
    setDraggedPiece(piece);
  }, []);

  const handleDrop = useCallback(
    (x: number, y: number) => {
      if (!draggedPiece || !gameState.isBuilding) return;

      setGameState((prev: GameState) => {
        if (!canPlacePiece(prev.grid, x, y)) return prev;

        const newGrid = prev.grid.map((row: Cell[]) =>
          row.map((cell: Cell) =>
            cell.x === x && cell.y === y
              ? { ...cell, track: draggedPiece }
              : cell
          )
        );

        const nextPiece = prev.nextPieces[0];
        const newNextPieces = [
          ...prev.nextPieces.slice(1),
          generateRandomPiece(),
        ];

        return {
          ...prev,
          grid: newGrid,
          currentPiece: nextPiece,
          nextPieces: newNextPieces,
          score: prev.score + 5,
        };
      });

      setDraggedPiece(null);
    },
    [draggedPiece, gameState.isBuilding]
  );

  const handleStorePiece = useCallback(() => {
    setGameState((prev: GameState) => {
      if (!prev.currentPiece || prev.storedPiece || !prev.isBuilding)
        return prev;

      const nextPiece = prev.nextPieces[0];
      const newNextPieces = [
        ...prev.nextPieces.slice(1),
        generateRandomPiece(),
      ];

      return {
        ...prev,
        storedPiece: prev.currentPiece,
        currentPiece: nextPiece,
        nextPieces: newNextPieces,
      };
    });
  }, []);

  const handleSwapStored = useCallback(() => {
    setGameState((prev: GameState) => {
      if (!prev.currentPiece || !prev.storedPiece || !prev.isBuilding)
        return prev;

      return {
        ...prev,
        currentPiece: prev.storedPiece,
        storedPiece: prev.currentPiece,
      };
    });
  }, []);

  const startNewGame = useCallback(() => {
    setGameState({
      grid: initializeGrid(1),
      currentPiece: generateRandomPiece(),
      storedPiece: null,
      nextPieces: Array.from({ length: 5 }, generateRandomPiece),
      score: 0,
      level: 1,
      timeLeft: BUILD_TIME,
      isPlaying: false,
      isBuilding: true,
      trainPosition: null,
      isWon: false,
      isLost: false,
    });
    setValidatedPath([]);
  }, []);

  const nextLevel = useCallback(() => {
    setGameState((prev: GameState) => {
      const newLevel = prev.level + 1;
      return {
        ...prev,
        grid: initializeGrid(newLevel),
        currentPiece: generateRandomPiece(),
        storedPiece: null,
        nextPieces: Array.from({ length: 5 }, generateRandomPiece),
        level: newLevel,
        timeLeft: BUILD_TIME,
        isBuilding: true,
        isPlaying: false,
        trainPosition: null,
        isWon: false,
        isLost: false,
      };
    });
    setValidatedPath([]);
  }, []);

  return {
    gameState,
    validatedPath,
    handleDragStart,
    handleDrop,
    handleStorePiece,
    handleSwapStored,
    startNewGame,
    nextLevel,
  };
};
