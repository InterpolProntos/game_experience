import { Train as TrainIcon } from "lucide-react";

interface TrainProps {
  position: { x: number; y: number };
}

export const Train = ({ position }: TrainProps) => {
  return (
    <div
      className="absolute pointer-events-none transition-all duration-300 ease-linear z-10"
      style={{
        left: `${position.x * 48 + 24}px`,
        top: `${position.y * 48 + 24}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="bg-blue-600 rounded-full p-2 shadow-lg animate-pulse">
        <TrainIcon className="w-6 h-6 text-white" fill="currentColor" />
      </div>
    </div>
  );
};
