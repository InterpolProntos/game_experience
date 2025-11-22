import { TrackPiece as TrackPieceType } from "../types/game";
import { TrackPiece } from "./TrackPiece";

interface PieceSelectorProps {
  currentPiece: TrackPieceType | null;
  storedPiece: TrackPieceType | null;
  nextPieces: TrackPieceType[];
  onDragStart: (piece: TrackPieceType) => void;
  onStorePiece: () => void;
  onSwapStored: () => void;
}

export const PieceSelector = ({
  currentPiece,
  storedPiece,
  nextPieces,
  onDragStart,
  onStorePiece,
  onSwapStored,
}: PieceSelectorProps) => {
  const handleDragStart = (e: React.DragEvent, piece: TrackPieceType) => {
    e.dataTransfer.effectAllowed = "move";
    onDragStart(piece);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-3 text-gray-700">CURRENT PIECE</h3>
        {currentPiece ? (
          <div className="flex flex-col items-center gap-2">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, currentPiece)}
              className="cursor-move bg-gray-100 p-3 rounded border-2 border-gray-300 hover:border-blue-400 transition-colors"
            >
              <TrackPiece type={currentPiece.type} size={60} />
            </div>
            <button
              onClick={onStorePiece}
              disabled={storedPiece !== null}
              className="px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              STORE
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">Empty</span>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-3 text-gray-700">STORED</h3>
        {storedPiece ? (
          <div className="flex flex-col items-center gap-2">
            <div className="bg-amber-50 p-3 rounded border-2 border-amber-300">
              <TrackPiece type={storedPiece.type} size={60} />
            </div>
            <button
              onClick={onSwapStored}
              disabled={!currentPiece}
              className="px-4 py-2 bg-amber-500 text-white text-xs rounded hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              SWAP
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">Empty</span>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-3 text-gray-700">NEXT PIECES</h3>
        <div className="flex flex-col gap-2">
          {nextPieces.slice(0, 3).map((piece, index) => (
            <div
              key={piece.id}
              className="bg-gray-50 p-2 rounded border border-gray-200"
            >
              <TrackPiece type={piece.type} size={50} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
