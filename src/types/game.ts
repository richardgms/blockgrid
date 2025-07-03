export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  filled: boolean;
  color?: string;
}

export type Board = Cell[][];

export interface PieceShape {
  id: string;
  name: string;
  blocks: Position[];
  color: string;
}

export interface GamePiece extends PieceShape {
  position: Position;
  isActive: boolean;
}

export interface GameState {
  board: Board;
  pieces: GamePiece[];
  score: number;
  highScore: number;
  comboMultiplier: number;
  comboCount: number;
  isGameOver: boolean;
  isPaused: boolean;
  clearedLines: number;
  clearedColumns: number;
  clearedBlocks: number;
}

export interface GameConfig {
  boardSize: number;
  pieceQueueSize: number;
  baseScore: number;
  lineBonus: number;
  columnBonus: number;
  blockBonus: number;
  maxComboMultiplier: number;
  comboMultipliers: number[];
}

export interface AudioConfig {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  totalLinesCleared: number;
  totalColumnsCleared: number;
  totalBlocksCleared: number;
  longestCombo: number;
  averageScore: number;
  lastPlayedAt: Date;
}

export interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  deviceHash: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  createdAt: Date;
  isCurrentPlayer?: boolean;
}

export interface ClearResult {
  clearedLines: number[];
  clearedColumns: number[];
  clearedBlocks: Position[];
  totalClearedCells: number;
  score: number;
  combo: number;
}

export interface DropResult {
  success: boolean;
  position?: Position;
  clearResult?: ClearResult;
}

export interface PiecePreview {
  position: Position;
  valid: boolean;
  piece: GamePiece;
}

export enum GameEvent {
  PIECE_PLACED = 'piece_placed',
  LINE_CLEARED = 'line_cleared',
  COLUMN_CLEARED = 'column_cleared',
  BLOCK_CLEARED = 'block_cleared',
  COMBO_ACHIEVED = 'combo_achieved',
  GAME_OVER = 'game_over',
  NEW_HIGH_SCORE = 'new_high_score',
  PIECE_GENERATED = 'piece_generated',
}

export interface GameEventData {
  type: GameEvent;
  data: any;
  timestamp: number;
}

export const PIECE_SHAPES: PieceShape[] = [
  // Single block
  {
    id: 'single',
    name: 'Single',
    blocks: [{ x: 0, y: 0 }],
    color: '#3B82F6', // blue-500
  },
  // Line horizontal 2
  {
    id: 'line_h2',
    name: 'Line H2',
    blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
    color: '#EF4444', // red-500
  },
  // Line horizontal 3
  {
    id: 'line_h3',
    name: 'Line H3',
    blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    color: '#10B981', // green-500
  },
  // Line horizontal 4
  {
    id: 'line_h4',
    name: 'Line H4',
    blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
    color: '#F59E0B', // yellow-500
  },
  // Line vertical 2
  {
    id: 'line_v2',
    name: 'Line V2',
    blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
    color: '#EF4444', // red-500
  },
  // Line vertical 3
  {
    id: 'line_v3',
    name: 'Line V3',
    blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
    color: '#10B981', // green-500
  },
  // Line vertical 4
  {
    id: 'line_v4',
    name: 'Line V4',
    blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    color: '#F59E0B', // yellow-500
  },
  // Square 2x2
  {
    id: 'square_2x2',
    name: 'Square 2x2',
    blocks: [
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }
    ],
    color: '#8B5CF6', // purple-500
  },
  // Square 3x3
  {
    id: 'square_3x3',
    name: 'Square 3x3',
    blocks: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }
    ],
    color: '#EC4899', // pink-500
  },
  // L-shape
  {
    id: 'l_shape',
    name: 'L-Shape',
    blocks: [
      { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }
    ],
    color: '#06B6D4', // cyan-500
  },
  // T-shape
  {
    id: 't_shape',
    name: 'T-Shape',
    blocks: [
      { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 1, y: 2 }
    ],
    color: '#F97316', // orange-500
  },
];

export const GAME_CONFIG: GameConfig = {
  boardSize: 8,
  pieceQueueSize: 3,
  baseScore: 10,
  lineBonus: 80,
  columnBonus: 80,
  blockBonus: 120,
  maxComboMultiplier: 5,
  comboMultipliers: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
}; 