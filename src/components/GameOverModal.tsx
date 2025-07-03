'use client';

import React, { useState, useEffect } from 'react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onBackToHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  onRestart,
  onBackToHome
}) => {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    setIsNewHighScore(score >= highScore);
  }, [score, highScore]);

  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
  };

  const handleSubmitScore = async () => {
    if (playerName.trim()) {
      try {
        // TODO: Submit score to Supabase
        console.log('Submitting score:', { playerName, score });
        setShowLeaderboard(true);
      } catch (error) {
        console.error('Error submitting score:', error);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Prevent closing on overlay click for game over
      return;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content animate-fade-in max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary-700 mb-2">
            Game Over!
          </h2>
          {isNewHighScore && (
            <div className="text-yellow-500 font-semibold text-lg mb-2">
              🎉 Novo Recorde! 🎉
            </div>
          )}
        </div>

        <div className="bg-primary-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary-600 font-semibold">Pontuação:</span>
            <span className="text-2xl font-bold text-primary-700">
              {formatScore(score)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-primary-600 font-semibold">Melhor:</span>
            <span className="text-xl font-semibold text-primary-600">
              {formatScore(highScore)}
            </span>
          </div>
        </div>

        {/* Player Name Input - Only show if new high score */}
        {isNewHighScore && !showLeaderboard && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Digite seu nome para o ranking:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Seu nome"
              maxLength={20}
            />
            <button
              onClick={handleSubmitScore}
              className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              disabled={!playerName.trim()}
            >
              Enviar para Ranking
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {showLeaderboard && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-700 mb-3">
              Top 10 Ranking
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              {/* Mock leaderboard data */}
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm text-gray-700">
                    {i + 1}. Jogador {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatScore(10000 - i * 1000)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 game-button"
          >
            Jogar Novamente
          </button>
          <button
            onClick={onBackToHome}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
}; 