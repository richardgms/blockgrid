'use client';

import React from 'react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  combo: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  highScore, 
  combo 
}) => {
  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
  };

  return (
    <div className="score-display-container flex flex-col sm:flex-row items-center gap-4 text-center">
      {/* Current Score */}
      <div className="score-item">
        <div className="text-sm text-primary-600 opacity-75 mb-1">
          Pontuação
        </div>
        <div className="score-text text-2xl font-bold text-primary-700">
          {formatScore(score)}
        </div>
      </div>

      {/* High Score */}
      <div className="score-item">
        <div className="text-sm text-primary-600 opacity-75 mb-1">
          Melhor
        </div>
        <div className="text-xl font-semibold text-primary-600">
          {formatScore(highScore)}
        </div>
      </div>

      {/* Combo */}
      {combo > 0 && (
        <div className="score-item">
          <div className="text-sm text-yellow-600 opacity-75 mb-1">
            Combo
          </div>
          <div className="combo-text text-xl font-bold text-yellow-500">
            ×{combo}
          </div>
        </div>
      )}
    </div>
  );
}; 