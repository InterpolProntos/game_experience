import { Cell } from "../types/game";
import { TrackPiece } from "./TrackPiece";
import { Mountain, TreePine, Star } from "lucide-react";

interface GridCellProps {
  cell: Cell;
  onDrop: (x: number, y: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  isHighlighted?: boolean;
}

export const GridCell = ({
  cell,
  onDrop,
  onDragOver,
  isHighlighted,
}: GridCellProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(cell.x, cell.y);
  };

  const getCellBackground = () => {
    if (cell.type === "start") return "bg-green-400";
    if (cell.type === "end") return "bg-red-400";
    if (cell.type === "bonus") return "bg-yellow-100";
    if (isHighlighted) return "bg-blue-200";
    return "bg-gray-200";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={onDragOver}
      className={`w-12 h-12 border border-gray-400 flex items-center justify-center ${getCellBackground()} transition-colors relative`}
    >
      {cell.type === "rock" && (
        <Mountain className="w-8 h-8 text-gray-600" strokeWidth={2} />
      )}
      {cell.type === "tree" && (
        <TreePine className="w-8 h-8 text-green-700" strokeWidth={2} />
      )}
      {cell.type === "bonus" && !cell.track && (
        <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
      )}
      {cell.type === "start" && (
        <span className="text-xs font-bold text-white">A</span>
      )}
      {cell.type === "end" && (
        <span className="text-xs font-bold text-white">B</span>
      )}
      {cell.track && (
        <div className="absolute inset-0 flex items-center justify-center">
          <TrackPiece type={cell.track.type} size={48} />
        </div>
      )}
    </div>
  );
};
