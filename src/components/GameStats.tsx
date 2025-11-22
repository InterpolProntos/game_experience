import { Clock, Trophy, Target } from "lucide-react";

interface GameStatsProps {
  score: number;
  level: number;
  timeLeft: number;
  isPlaying: boolean;
}

export const GameStats = ({
  score,
  level,
  timeLeft,
  isPlaying,
}: GameStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 30) return "text-green-600";
    if (timeLeft > 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-600">SCORE</span>
          </div>
          <span className="text-3xl font-bold text-gray-800">{score}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-600">LEVEL</span>
          </div>
          <span className="text-3xl font-bold text-gray-800">{level}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-semibold text-gray-600">TIME</span>
          </div>
          <span
            className={`text-3xl font-bold ${
              isPlaying ? getTimeColor() : "text-gray-800"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
};
