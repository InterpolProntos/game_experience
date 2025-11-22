import { TrackType } from "../types/game";

interface TrackPieceProps {
  type: TrackType;
  size?: number;
  isDragging?: boolean;
}

export const TrackPiece = ({
  type,
  size = 40,
  isDragging = false,
}: TrackPieceProps) => {
  const getTrackPath = () => {
    const center = size / 2;
    const strokeWidth = size * 0.3;

    switch (type) {
      case "horizontal":
        return (
          <line
            x1={0}
            y1={center}
            x2={size}
            y2={center}
            stroke="#8B4513"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      case "vertical":
        return (
          <line
            x1={center}
            y1={0}
            x2={center}
            y2={size}
            stroke="#8B4513"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      case "curve-tl":
        return (
          <path
            d={`M ${center} 0 Q ${center} ${center} 0 ${center}`}
            stroke="#8B4513"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "curve-tr":
        return (
          <path
            d={`M ${center} 0 Q ${center} ${center} ${size} ${center}`}
            stroke="#8B4513"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "curve-bl":
        return (
          <path
            d={`M ${center} ${size} Q ${center} ${center} 0 ${center}`}
            stroke="#8B4513"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "curve-br":
        return (
          <path
            d={`M ${center} ${size} Q ${center} ${center} ${size} ${center}`}
            stroke="#8B4513"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "cross":
        return (
          <>
            <line
              x1={0}
              y1={center}
              x2={size}
              y2={center}
              stroke="#8B4513"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <line
              x1={center}
              y1={0}
              x2={center}
              y2={size}
              stroke="#8B4513"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      className={`${isDragging ? "opacity-50" : ""}`}
      style={{ display: "block" }}
    >
      {getTrackPath()}
    </svg>
  );
};
