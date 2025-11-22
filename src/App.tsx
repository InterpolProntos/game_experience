import { useGame } from "./hooks/useGame";
import { GameBoard } from "./components/GameBoard";
import { PieceSelector } from "./components/PieceSelector";
import { GameStats } from "./components/GameStats";
import { Train } from "./components/Train";
import { Play, RotateCcw, ArrowRight } from "lucide-react";

function App() {
  const {
    gameState,
    validatedPath,
    handleDragStart,
    handleDrop,
    handleStorePiece,
    handleSwapStored,
    startNewGame,
    nextLevel,
  } = useGame();

  const showStartButton = !gameState.isBuilding && !gameState.isPlaying;
  const showNextLevelButton =
    !gameState.isPlaying &&
    !gameState.isBuilding &&
    gameState.timeLeft === 0 &&
    validatedPath.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            Train Track Builder
          </h1>
          <p className="text-gray-600 text-lg">
            Build the track from A to B before time runs out!
          </p>
        </div>

        <div className="mb-6">
          <GameStats
            score={gameState.score}
            level={gameState.level}
            timeLeft={gameState.timeLeft}
            isPlaying={gameState.isPlaying || gameState.isBuilding}
          />
        </div>

        <div className="flex gap-8 justify-center items-start">
          <PieceSelector
            currentPiece={gameState.currentPiece}
            storedPiece={gameState.storedPiece}
            nextPieces={gameState.nextPieces}
            onDragStart={handleDragStart}
            onStorePiece={handleStorePiece}
            onSwapStored={handleSwapStored}
          />

          <div className="relative">
            <GameBoard
              grid={gameState.grid}
              onDrop={handleDrop}
              highlightedPath={gameState.isPlaying ? validatedPath : []}
            />
            {gameState.trainPosition && (
              <Train position={gameState.trainPosition} />
            )}

            {showStartButton && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {validatedPath.length > 0 ? "Level Complete!" : "Game Over"}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {validatedPath.length > 0
                      ? `You scored ${gameState.score} points!`
                      : "Track incomplete. Try again!"}
                  </p>
                  <button
                    onClick={startNewGame}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-5 h-5" />
                    New Game
                  </button>
                </div>
              </div>
            )}

            {showNextLevelButton && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Level Complete!
                  </h2>
                  <p className="text-gray-600 mb-6">Score: {gameState.score}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={nextLevel}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2"
                    >
                      Next Level
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={startNewGame}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Restart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              How to Play
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">1.</span>
                <span>
                  Drag track pieces from the current piece area to the grid
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">2.</span>
                <span>Connect tracks from start (A) to end (B)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">3.</span>
                <span>Avoid rocks and trees</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">4.</span>
                <span>Pass through bonus stars for extra points</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">5.</span>
                <span>Store pieces for later use</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">6.</span>
                <span>Complete the track before time runs out!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
