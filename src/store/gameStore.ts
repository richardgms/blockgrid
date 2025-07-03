import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  GameState, 
  GamePiece, 
  Position, 
  DropResult, 
  ClearResult, 
  PiecePreview,
  PIECE_SHAPES,
  GAME_CONFIG,
  GameEvent,
  GameEventData
} from '@/types/game';
import { generateRandomPiece, createEmptyBoard } from '@/utils/gameUtils';

interface GameStore extends GameState {
  // Actions
  initGame: () => void;
  resetGame: () => void;
  placePiece: (piece: GamePiece, position: Position) => DropResult;
  previewPiece: (piece: GamePiece, position: Position) => PiecePreview;
  clearPreview: () => void;
  generateNewPieces: () => void;
  updateScore: (points: number) => void;
  updateCombo: (combo: number) => void;
  resetCombo: () => void;
  checkGameOver: () => boolean;
  setGameOver: (isGameOver: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  
  // Preview state
  previewPosition: Position | null;
  previewPieceState: GamePiece | null;
  previewValid: boolean;
  
  // Event handling
  eventListeners: ((event: GameEventData) => void)[];
  addEventListener: (listener: (event: GameEventData) => void) => void;
  removeEventListener: (listener: (event: GameEventData) => void) => void;
  emitEvent: (type: GameEvent, data?: any) => void;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Initial state
    board: createEmptyBoard(GAME_CONFIG.boardSize),
    pieces: [],
    score: 0,
    highScore: 0,
    comboMultiplier: 1,
    comboCount: 0,
    isGameOver: false,
    isPaused: false,
    clearedLines: 0,
    clearedColumns: 0,
    clearedBlocks: 0,
    
    // Preview state
    previewPosition: null,
    previewPieceState: null,
    previewValid: false,
    
    // Event handling
    eventListeners: [],
    
    // Actions
    initGame: () => {
      set((state) => {
        state.board = createEmptyBoard(GAME_CONFIG.boardSize);
        state.pieces = Array.from({ length: GAME_CONFIG.pieceQueueSize }, () => generateRandomPiece());
        state.score = 0;
        state.comboMultiplier = 1;
        state.comboCount = 0;
        state.isGameOver = false;
        state.isPaused = false;
        state.clearedLines = 0;
        state.clearedColumns = 0;
        state.clearedBlocks = 0;
        state.previewPosition = null;
        state.previewPiece = null;
        state.previewValid = false;
      });
      
      get().emitEvent(GameEvent.PIECE_GENERATED, { pieces: get().pieces });
    },
    
    resetGame: () => {
      const currentHighScore = get().highScore;
      set((state) => {
        state.board = createEmptyBoard(GAME_CONFIG.boardSize);
        state.pieces = Array.from({ length: GAME_CONFIG.pieceQueueSize }, () => generateRandomPiece());
        state.score = 0;
        state.highScore = currentHighScore;
        state.comboMultiplier = 1;
        state.comboCount = 0;
        state.isGameOver = false;
        state.isPaused = false;
        state.clearedLines = 0;
        state.clearedColumns = 0;
        state.clearedBlocks = 0;
        state.previewPosition = null;
        state.previewPiece = null;
        state.previewValid = false;
      });
      
      get().emitEvent(GameEvent.PIECE_GENERATED, { pieces: get().pieces });
    },
    
    placePiece: (piece: GamePiece, position: Position): DropResult => {
      const state = get();
      const preview = state.previewPiece(piece, position);
      
      if (!preview.valid) {
        return { success: false };
      }
      
      let clearResult: ClearResult | undefined;
      
      set((draft) => {
        // Place the piece on the board
        piece.blocks.forEach(block => {
          const boardX = position.x + block.x;
          const boardY = position.y + block.y;
          
          draft.board[boardY][boardX] = {
            filled: true,
            color: piece.color
          };
        });
        
        // Remove the piece from the queue
        const pieceIndex = draft.pieces.findIndex(p => p.id === piece.id);
        if (pieceIndex !== -1) {
          draft.pieces.splice(pieceIndex, 1);
        }
        
        // Clear preview
        draft.previewPosition = null;
        draft.previewPiece = null;
        draft.previewValid = false;
      });
      
      // Check for line/column/block clears
      clearResult = get().checkAndClearLines();
      
      // If all pieces are used, generate new ones
      if (get().pieces.length === 0) {
        get().generateNewPieces();
      }
      
      // Check for game over
      const isGameOver = get().checkGameOver();
      if (isGameOver) {
        get().setGameOver(true);
      }
      
      get().emitEvent(GameEvent.PIECE_PLACED, { piece, position, clearResult });
      
      return { 
        success: true, 
        position,
        clearResult 
      };
    },
    
    previewPiece: (piece: GamePiece, position: Position): PiecePreview => {
      const state = get();
      const boardSize = GAME_CONFIG.boardSize;
      
      // Check if piece fits within board boundaries
      const valid = piece.blocks.every(block => {
        const boardX = position.x + block.x;
        const boardY = position.y + block.y;
        
        return boardX >= 0 && 
               boardX < boardSize && 
               boardY >= 0 && 
               boardY < boardSize &&
               !state.board[boardY][boardX].filled;
      });
      
      set((draft) => {
        draft.previewPosition = position;
        draft.previewPiece = piece;
        draft.previewValid = valid;
      });
      
      return { position, valid, piece };
    },
    
    clearPreview: () => {
      set((state) => {
        state.previewPosition = null;
        state.previewPiece = null;
        state.previewValid = false;
      });
    },
    
    generateNewPieces: () => {
      set((state) => {
        state.pieces = Array.from({ length: GAME_CONFIG.pieceQueueSize }, () => generateRandomPiece());
      });
      
      get().emitEvent(GameEvent.PIECE_GENERATED, { pieces: get().pieces });
    },
    
    updateScore: (points: number) => {
      set((state) => {
        const newScore = state.score + points;
        state.score = newScore;
        
        if (newScore > state.highScore) {
          state.highScore = newScore;
          get().emitEvent(GameEvent.NEW_HIGH_SCORE, { score: newScore });
        }
      });
    },
    
    updateCombo: (combo: number) => {
      set((state) => {
        state.comboCount = combo;
        const multiplierIndex = Math.min(combo - 1, GAME_CONFIG.comboMultipliers.length - 1);
        state.comboMultiplier = GAME_CONFIG.comboMultipliers[multiplierIndex] || 1;
      });
      
      if (combo > 0) {
        get().emitEvent(GameEvent.COMBO_ACHIEVED, { combo, multiplier: get().comboMultiplier });
      }
    },
    
    resetCombo: () => {
      set((state) => {
        state.comboCount = 0;
        state.comboMultiplier = 1;
      });
    },
    
    checkGameOver: (): boolean => {
      const state = get();
      return state.pieces.every(piece => {
        // Check if piece can be placed anywhere on the board
        for (let y = 0; y < GAME_CONFIG.boardSize; y++) {
          for (let x = 0; x < GAME_CONFIG.boardSize; x++) {
            const canPlace = piece.blocks.every(block => {
              const boardX = x + block.x;
              const boardY = y + block.y;
              
              return boardX >= 0 && 
                     boardX < GAME_CONFIG.boardSize && 
                     boardY >= 0 && 
                     boardY < GAME_CONFIG.boardSize &&
                     !state.board[boardY][boardX].filled;
            });
            
            if (canPlace) {
              return false; // Piece can be placed
            }
          }
        }
        return true; // Piece cannot be placed anywhere
      });
    },
    
    setGameOver: (isGameOver: boolean) => {
      set((state) => {
        state.isGameOver = isGameOver;
      });
      
      if (isGameOver) {
        get().emitEvent(GameEvent.GAME_OVER, { 
          score: get().score,
          highScore: get().highScore 
        });
      }
    },
    
    setPaused: (isPaused: boolean) => {
      set((state) => {
        state.isPaused = isPaused;
      });
    },
    
    // Event handling
    addEventListener: (listener: (event: GameEventData) => void) => {
      set((state) => {
        state.eventListeners.push(listener);
      });
    },
    
    removeEventListener: (listener: (event: GameEventData) => void) => {
      set((state) => {
        const index = state.eventListeners.indexOf(listener);
        if (index !== -1) {
          state.eventListeners.splice(index, 1);
        }
      });
    },
    
    emitEvent: (type: GameEvent, data?: any) => {
      const event: GameEventData = {
        type,
        data,
        timestamp: Date.now()
      };
      
      get().eventListeners.forEach(listener => {
        listener(event);
      });
    },
    
    // Helper method to check and clear lines/columns/blocks
    checkAndClearLines: (): ClearResult => {
      const state = get();
      const boardSize = GAME_CONFIG.boardSize;
      const clearedLines: number[] = [];
      const clearedColumns: number[] = [];
      const clearedBlocks: Position[] = [];
      
      // Check for full lines (rows)
      for (let y = 0; y < boardSize; y++) {
        if (state.board[y].every(cell => cell.filled)) {
          clearedLines.push(y);
        }
      }
      
      // Check for full columns
      for (let x = 0; x < boardSize; x++) {
        if (state.board.every(row => row[x].filled)) {
          clearedColumns.push(x);
        }
      }
      
      // Check for full 3x3 blocks
      for (let blockY = 0; blockY < boardSize; blockY += 3) {
        for (let blockX = 0; blockX < boardSize; blockX += 3) {
          let isFull = true;
          
          for (let y = blockY; y < blockY + 3 && y < boardSize; y++) {
            for (let x = blockX; x < blockX + 3 && x < boardSize; x++) {
              if (!state.board[y][x].filled) {
                isFull = false;
                break;
              }
            }
            if (!isFull) break;
          }
          
          if (isFull) {
            clearedBlocks.push({ x: blockX, y: blockY });
          }
        }
      }
      
      // Calculate total cleared cells
      const totalClearedCells = clearedLines.length * boardSize + 
                                clearedColumns.length * boardSize + 
                                clearedBlocks.length * 9;
      
      // Clear the cells
      set((draft) => {
        // Clear lines
        clearedLines.forEach(y => {
          for (let x = 0; x < boardSize; x++) {
            draft.board[y][x] = { filled: false };
          }
        });
        
        // Clear columns
        clearedColumns.forEach(x => {
          for (let y = 0; y < boardSize; y++) {
            draft.board[y][x] = { filled: false };
          }
        });
        
        // Clear blocks
        clearedBlocks.forEach(block => {
          for (let y = block.y; y < block.y + 3 && y < boardSize; y++) {
            for (let x = block.x; x < block.x + 3 && x < boardSize; x++) {
              draft.board[y][x] = { filled: false };
            }
          }
        });
        
        // Update stats
        draft.clearedLines += clearedLines.length;
        draft.clearedColumns += clearedColumns.length;
        draft.clearedBlocks += clearedBlocks.length;
      });
      
      // Calculate score
      const baseScore = totalClearedCells * GAME_CONFIG.baseScore;
      const lineBonus = clearedLines.length * GAME_CONFIG.lineBonus;
      const columnBonus = clearedColumns.length * GAME_CONFIG.columnBonus;
      const blockBonus = clearedBlocks.length * GAME_CONFIG.blockBonus;
      
      const totalScore = (baseScore + lineBonus + columnBonus + blockBonus) * get().comboMultiplier;
      
      // Update combo
      const newCombo = totalClearedCells > 0 ? get().comboCount + 1 : 0;
      if (totalClearedCells > 0) {
        get().updateCombo(newCombo);
      } else {
        get().resetCombo();
      }
      
      // Update score
      if (totalScore > 0) {
        get().updateScore(totalScore);
      }
      
      const clearResult: ClearResult = {
        clearedLines,
        clearedColumns,
        clearedBlocks,
        totalClearedCells,
        score: totalScore,
        combo: newCombo
      };
      
      // Emit events
      if (clearedLines.length > 0) {
        get().emitEvent(GameEvent.LINE_CLEARED, { lines: clearedLines });
      }
      if (clearedColumns.length > 0) {
        get().emitEvent(GameEvent.COLUMN_CLEARED, { columns: clearedColumns });
      }
      if (clearedBlocks.length > 0) {
        get().emitEvent(GameEvent.BLOCK_CLEARED, { blocks: clearedBlocks });
      }
      
      return clearResult;
    }
  }))
); 