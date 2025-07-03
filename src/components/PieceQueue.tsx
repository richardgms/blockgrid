'use client';

import React from 'react';

interface PieceQueueProps {
  pieces: any[];
  onPieceDragStart: (piece: any) => void;
}

export const PieceQueue: React.FC<PieceQueueProps> = ({ pieces, onPieceDragStart }) => {
  const mockPieces = [
    {
      id: 'piece1',
      color: '#3B82F6',
      blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] // Line 3
    },
    {
      id: 'piece2',
      color: '#EF4444',
      blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] // 2x2 square
    },
    {
      id: 'piece3',
      color: '#10B981',
      blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] // L-shape
    }
  ];

  const list = pieces.length ? pieces : mockPieces;

  const renderPiece = (piece: any) => {
    if (!piece) return null;

    // Calculate bounding box
    const minX = Math.min(...piece.blocks.map((b: any) => b.x));
    const maxX = Math.max(...piece.blocks.map((b: any) => b.x));
    const minY = Math.min(...piece.blocks.map((b: any) => b.y));
    const maxY = Math.max(...piece.blocks.map((b: any) => b.y));
    
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    return (
      <div
        key={piece.id}
        className="piece-container game-piece bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-3 shadow-md hover:shadow-lg transition-all"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', piece.id);
          onPieceDragStart(piece);
        }}
      >
        <div 
          className="piece-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, 1fr)`,
            gridTemplateRows: `repeat(${height}, 1fr)`,
            gap: '2px',
            padding: '4px'
          }}
        >
          {Array.from({ length: width * height }, (_, i) => {
            const x = i % width;
            const y = Math.floor(i / width);
            const adjustedX = x + minX;
            const adjustedY = y + minY;
            
            const hasBlock = piece.blocks.some(
              (block: any) => block.x === adjustedX && block.y === adjustedY
            );

            return (
              <div
                key={i}
                className={`piece-cell ${hasBlock ? 'filled' : 'empty'}`}
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: hasBlock ? piece.color : 'transparent',
                  border: hasBlock ? '1px solid rgba(0,0,0,0.2)' : 'none',
                  borderRadius: '2px',
                  transition: 'all 0.2s ease'
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="piece-queue-container">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {list.map(renderPiece)}
      </div>
      
      <div className="mt-4 text-center text-sm text-primary-600 opacity-75">
        Arraste as peças para o tabuleiro
      </div>
    </div>
  );
}; 