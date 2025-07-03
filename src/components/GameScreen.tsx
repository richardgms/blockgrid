'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameBoard } from './GameBoard';
import { PieceQueue } from './PieceQueue';
import { ScoreDisplay } from './ScoreDisplay';
import { GameOverModal } from './GameOverModal';
import { Button } from '@/components/ui';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface GameScreenProps {
  onBackToHome: () => void;
  onOpenSettings: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  onBackToHome, 
  onOpenSettings 
}) => {
  const [gameInitialized, setGameInitialized] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [draggingPiece, setDraggingPiece] = useState<any>(null);

  // Mock game state - will be replaced with actual game store
  const [board, setBoard] = useState<boolean[][]>(
    Array(8).fill(null).map(() => Array(8).fill(false))
  );
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    // Initialize game
    setGameInitialized(true);
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('blockgrid_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const handleGameOver = () => {
    setShowGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('blockgrid_highscore', score.toString());
    }
  };

  const handleRestartGame = () => {
    setShowGameOver(false);
    setScore(0);
    setCombo(0);
    setBoard(Array(8).fill(null).map(() => Array(8).fill(false)));
    // Reset game state
  };

  const handlePieceDragStart = (piece: any) => {
    setDraggingPiece(piece);
  };

  const handlePiecePlaced = (newBoard: boolean[][], placedPieceId: string, gainedPoints:number) => {
    // Remove peça da fila
    setPieces(prev => prev.filter(p => p.id !== placedPieceId));
    setBoard(newBoard);
    setDraggingPiece(null);
    if(gainedPoints>0){
      setScore(prev=>prev+gainedPoints);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-game border-b border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToHome}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>

          <div className="flex-1 flex justify-center">
            <ScoreDisplay 
              score={score} 
              highScore={highScore} 
              combo={combo}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            aria-label="Configurações"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 gap-6 lg:gap-8">
        {/* Game Board */}
        <div className="flex-shrink-0 order-1 lg:order-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-game">
            <GameBoard 
              board={board}
              draggingPiece={draggingPiece}
              onPiecePlaced={handlePiecePlaced}
              onGameOver={handleGameOver}
            />
          </div>
        </div>

        {/* Side Panel - Desktop & Tablet */}
        <aside className="lg:w-80 space-y-6 order-2 lg:order-none hidden md:block">
          {/* Next Pieces */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-game">
            <h3 className="text-body-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse" />
              Próximas Peças
            </h3>
            <PieceQueue pieces={pieces} onPieceDragStart={handlePieceDragStart} />
          </div>

          {/* Game Tips */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-game">
            <h3 className="text-body-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
              Dicas
            </h3>
            <div className="text-body-sm text-gray-600 dark:text-gray-300 space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Arraste as peças para o tabuleiro</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-secondary-500 mt-1">•</span>
                <span>Complete linhas ou colunas inteiras</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Quebre múltiplas linhas para combo!</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>O jogo acaba sem movimentos válidos</span>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-game">
            <h3 className="text-body-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estatísticas
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
                <div className="text-display-sm font-bold text-primary-600 dark:text-primary-400">
                  {score}
                </div>
                <div className="text-body-sm text-primary-500">Pontuação</div>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-xl p-3">
                <div className="text-display-sm font-bold text-secondary-600 dark:text-secondary-400">
                  {combo}
                </div>
                <div className="text-body-sm text-secondary-500">Combo</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Piece Queue - Mobile */}
        <div className="w-full max-w-md order-3 md:hidden">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-game">
            <h4 className="text-body-md font-semibold text-gray-900 dark:text-white mb-3 text-center">
              Próximas Peças
            </h4>
            <PieceQueue pieces={pieces} onPieceDragStart={handlePieceDragStart} />
          </div>
        </div>
      </main>

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal 
          score={score}
          highScore={highScore}
          onRestart={handleRestartGame}
          onBackToHome={onBackToHome}
        />
      )}
    </div>
  );
}; 