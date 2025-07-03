'use client';

import React, { useState, useCallback } from 'react';

interface GameBoardProps {
  board: boolean[][];
  draggingPiece: any | null;
  onPiecePlaced: (newBoard: boolean[][], placedPieceId: string, gainedPoints: number) => void;
  onGameOver: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  draggingPiece,
  onPiecePlaced, 
  onGameOver 
}) => {
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  const handleCellClick = useCallback((row: number, col: number) => {
    console.log(`Cell clicked: ${row}, ${col}`);
  }, []);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (draggingPiece) {
      setPreviewPosition({ x: col, y: row });
    }
  }, [draggingPiece]);

  const handleCellMouseLeave = useCallback(() => {
    setPreviewPosition(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setPreviewPosition(null);
    
    if (!draggingPiece) return;

    // Verificar se a peça cabe
    const canPlace = draggingPiece.blocks.every((block: any) => {
      const x = col + block.x;
      const y = row + block.y;
      return (
        x >= 0 && x < 8 && y >= 0 && y < 8 && !board[y][x]
      );
    });

    if (!canPlace) return;

    // Criar novo tabuleiro com peça aplicada
    let newBoard = board.map(r => [...r]);
    draggingPiece.blocks.forEach((block: any) => {
      const x = col + block.x;
      const y = row + block.y;
      newBoard[y][x] = true;
    });

    // Verificar linhas completas
    const fullRows: number[] = [];
    for (let y = 0; y < 8; y++) {
      if (newBoard[y].every(c => c)) fullRows.push(y);
    }

    // Verificar colunas completas
    const fullCols: number[] = [];
    for (let x = 0; x < 8; x++) {
      if (newBoard.every(r => r[x])) fullCols.push(x);
    }

    // Limpar linhas
    fullRows.forEach(y => {
      for (let x = 0; x < 8; x++) newBoard[y][x] = false;
    });

    // Limpar colunas
    fullCols.forEach(x => {
      for (let y = 0; y < 8; y++) newBoard[y][x] = false;
    });

    // Calcular pontuação
    let points = (fullRows.length + fullCols.length) * 80;
    if ((fullRows.length + fullCols.length) > 1) {
      points = Math.round(points * 1.2);
    }

    onPiecePlaced(newBoard, draggingPiece.id, points);
  }, [draggingPiece, board, onPiecePlaced]);

  const getCellClassName = (row: number, col: number) => {
    const baseClass = "game-cell";
    const isPreview = previewPosition && previewPosition.x === col && previewPosition.y === row;
    const isFilled = board[row][col];
    
    let className = baseClass;
    if (isFilled) {
      className += " filled";
    }
    if (isPreview) {
      className += " preview";
    }
    
    return className;
  };

  return (
    <div className="game-board-container">
      <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-8 gap-1 bg-gray-200 p-2 rounded-lg">
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => (
              <div
                key={`${row}-${col}`}
                className={getCellClassName(row, col)}
                style={{
                  backgroundColor: board[row][col] ? '#3B82F6' : '#f8fafc',
                  width: '32px',
                  height: '32px',
                }}
                onClick={() => handleCellClick(row, col)}
                onMouseEnter={() => handleCellMouseEnter(row, col)}
                onMouseLeave={handleCellMouseLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, row, col)}
              />
            ))
          )}
        </div>
      </div>

      {/* Board Grid Lines for 3x3 blocks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="border-2 border-primary-300 opacity-30 rounded-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 