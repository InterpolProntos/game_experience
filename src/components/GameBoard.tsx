import { Cell } from "../types/game";
import { GridCell } from "./GridCell";

interface GameBoardProps {
  grid: Cell[][];
  onDrop: (x: number, y: number) => void;
  highlightedPath?: { x: number; y: number }[];
}

export const GameBoard = ({
  grid,
  onDrop,
  highlightedPath = [],
}: GameBoardProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isHighlighted = (x: number, y: number) => {
    return highlightedPath.some((pos) => pos.x === x && pos.y === y);
  };

  return (
    <div className="inline-block bg-gray-300 p-2 rounded-lg shadow-2xl">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(12, 1fr)` }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <GridCell
              key={`${x}-${y}`}
              cell={cell}
              onDrop={onDrop}
              onDragOver={handleDragOver}
              isHighlighted={isHighlighted(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
};
