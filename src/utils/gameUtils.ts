import { 
  GamePiece, 
  Position, 
  Board, 
  Cell, 
  PieceShape, 
  PIECE_SHAPES, 
  GAME_CONFIG 
} from '@/types/game';

let pieceCounter = 0;

export function generateRandomPiece(): GamePiece {
  const randomShape = PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)];
  
  return {
    ...randomShape,
    id: `${randomShape.id}_${pieceCounter++}_${Date.now()}`,
    position: { x: 0, y: 0 },
    isActive: true,
  };
}

export function createEmptyBoard(size: number): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, (): Cell => ({
      filled: false,
      color: undefined,
    }))
  );
}

export function createFilledBoard(size: number, color: string): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, (): Cell => ({
      filled: true,
      color: color,
    }))
  );
}

export function cloneBoard(board: Board): Board {
  return board.map(row => 
    row.map(cell => ({ ...cell }))
  );
}

export function isPieceValidAtPosition(
  board: Board, 
  piece: GamePiece, 
  position: Position
): boolean {
  const boardSize = board.length;
  
  return piece.blocks.every(block => {
    const boardX = position.x + block.x;
    const boardY = position.y + block.y;
    
    return boardX >= 0 && 
           boardX < boardSize && 
           boardY >= 0 && 
           boardY < boardSize &&
           !board[boardY][boardX].filled;
  });
}

export function placePieceOnBoard(
  board: Board, 
  piece: GamePiece, 
  position: Position
): Board {
  const newBoard = cloneBoard(board);
  
  piece.blocks.forEach(block => {
    const boardX = position.x + block.x;
    const boardY = position.y + block.y;
    
    if (boardX >= 0 && boardX < board.length && 
        boardY >= 0 && boardY < board.length) {
      newBoard[boardY][boardX] = {
        filled: true,
        color: piece.color
      };
    }
  });
  
  return newBoard;
}

export function findAllValidPositions(
  board: Board, 
  piece: GamePiece
): Position[] {
  const validPositions: Position[] = [];
  const boardSize = board.length;
  
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const position = { x, y };
      if (isPieceValidAtPosition(board, piece, position)) {
        validPositions.push(position);
      }
    }
  }
  
  return validPositions;
}

export function canAnyPieceBePlaced(board: Board, pieces: GamePiece[]): boolean {
  return pieces.some(piece => 
    findAllValidPositions(board, piece).length > 0
  );
}

export function checkFullLines(board: Board): number[] {
  const fullLines: number[] = [];
  const boardSize = board.length;
  
  for (let y = 0; y < boardSize; y++) {
    if (board[y].every(cell => cell.filled)) {
      fullLines.push(y);
    }
  }
  
  return fullLines;
}

export function checkFullColumns(board: Board): number[] {
  const fullColumns: number[] = [];
  const boardSize = board.length;
  
  for (let x = 0; x < boardSize; x++) {
    if (board.every(row => row[x].filled)) {
      fullColumns.push(x);
    }
  }
  
  return fullColumns;
}

export function checkFullBlocks(board: Board): Position[] {
  const fullBlocks: Position[] = [];
  const boardSize = board.length;
  
  for (let blockY = 0; blockY < boardSize; blockY += 3) {
    for (let blockX = 0; blockX < boardSize; blockX += 3) {
      let isFull = true;
      
      for (let y = blockY; y < blockY + 3 && y < boardSize; y++) {
        for (let x = blockX; x < blockX + 3 && x < boardSize; x++) {
          if (!board[y][x].filled) {
            isFull = false;
            break;
          }
        }
        if (!isFull) break;
      }
      
      if (isFull) {
        fullBlocks.push({ x: blockX, y: blockY });
      }
    }
  }
  
  return fullBlocks;
}

export function clearLines(board: Board, lines: number[]): Board {
  const newBoard = cloneBoard(board);
  
  lines.forEach(y => {
    for (let x = 0; x < board.length; x++) {
      newBoard[y][x] = { filled: false };
    }
  });
  
  return newBoard;
}

export function clearColumns(board: Board, columns: number[]): Board {
  const newBoard = cloneBoard(board);
  
  columns.forEach(x => {
    for (let y = 0; y < board.length; y++) {
      newBoard[y][x] = { filled: false };
    }
  });
  
  return newBoard;
}

export function clearBlocks(board: Board, blocks: Position[]): Board {
  const newBoard = cloneBoard(board);
  const boardSize = board.length;
  
  blocks.forEach(block => {
    for (let y = block.y; y < block.y + 3 && y < boardSize; y++) {
      for (let x = block.x; x < block.x + 3 && x < boardSize; x++) {
        newBoard[y][x] = { filled: false };
      }
    }
  });
  
  return newBoard;
}

export function calculateScore(
  clearedLines: number,
  clearedColumns: number,
  clearedBlocks: number,
  totalClearedCells: number,
  comboMultiplier: number
): number {
  const baseScore = totalClearedCells * GAME_CONFIG.baseScore;
  const lineBonus = clearedLines * GAME_CONFIG.lineBonus;
  const columnBonus = clearedColumns * GAME_CONFIG.columnBonus;
  const blockBonus = clearedBlocks * GAME_CONFIG.blockBonus;
  
  return (baseScore + lineBonus + columnBonus + blockBonus) * comboMultiplier;
}

export function getBoardStats(board: Board): {
  filledCells: number;
  emptyCells: number;
  fillPercentage: number;
} {
  const totalCells = board.length * board.length;
  const filledCells = board.flat().filter(cell => cell.filled).length;
  const emptyCells = totalCells - filledCells;
  
  return {
    filledCells,
    emptyCells,
    fillPercentage: (filledCells / totalCells) * 100
  };
}

export function generateDeviceHash(): string {
  // Generate a simple device hash for anonymous scoring
  const navigator = typeof window !== 'undefined' ? window.navigator : null;
  
  if (!navigator) {
    return `device_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `device_${Math.abs(hash).toString(36)}`;
}

export function formatScore(score: number): string {
  if (score >= 1000000) {
    return `${(score / 1000000).toFixed(1)}M`;
  } else if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}K`;
  }
  return score.toString();
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  } else {
    return `${seconds}s`;
  }
}

export function getRandomPieceSet(count: number): GamePiece[] {
  return Array.from({ length: count }, () => generateRandomPiece());
}

export function debugBoard(board: Board): void {
  console.log('Board state:');
  board.forEach((row, y) => {
    const rowStr = row.map(cell => cell.filled ? '█' : '·').join(' ');
    console.log(`${y}: ${rowStr}`);
  });
}

export function isTouchDevice(): boolean {
  return (typeof window !== 'undefined') && 
         ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

export function getOptimalPiecePosition(
  board: Board, 
  piece: GamePiece
): Position | null {
  const validPositions = findAllValidPositions(board, piece);
  
  if (validPositions.length === 0) {
    return null;
  }
  
  // Simple heuristic: prefer positions that create potential lines/columns/blocks
  let bestPosition = validPositions[0];
  let bestScore = 0;
  
  for (const position of validPositions) {
    const testBoard = placePieceOnBoard(board, piece, position);
    const lines = checkFullLines(testBoard).length;
    const columns = checkFullColumns(testBoard).length;
    const blocks = checkFullBlocks(testBoard).length;
    
    const score = lines * 10 + columns * 10 + blocks * 15;
    
    if (score > bestScore) {
      bestScore = score;
      bestPosition = position;
    }
  }
  
  return bestPosition;
} 