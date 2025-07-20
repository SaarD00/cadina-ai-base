import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSEO } from '@/hooks/use-seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Play, Pause, RotateCw, ArrowDown } from 'lucide-react';

// Tetris game types and constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

const TETROMINOES = {
  I: [
    [1, 1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ]
};

const COLORS = {
  I: 'bg-gradient-to-br from-primary to-primary/80',
  O: 'bg-gradient-to-br from-accent to-accent/80', 
  T: 'bg-gradient-to-br from-secondary to-secondary/80',
  S: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  Z: 'bg-gradient-to-br from-rose-500 to-rose-600',
  J: 'bg-gradient-to-br from-blue-500 to-blue-600',
  L: 'bg-gradient-to-br from-orange-500 to-orange-600',
  0: 'bg-muted/20 border border-border/20'
};

const createEmptyBoard = () => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL));

const getRandomPiece = () => {
  const pieces = Object.keys(TETROMINOES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    shape: TETROMINOES[randomPiece],
    type: randomPiece,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[randomPiece][0].length / 2),
    y: 0
  };
};

const NotFound = () => {
  const location = useLocation();
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  useSEO({
    title: '404 - Play Tetris | Vireia AI',
    description: 'Page not found? No worries! Play our beautiful Tetris game while you\'re here.',
    canonical: `https://www.vireia.com${location.pathname}`,
    keywords: '404, page not found, tetris game, puzzle game',
    noindex: true
  });

  // Check collision
  const checkCollision = useCallback((piece, board, dx = 0, dy = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece) => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Place piece on board
  const placePiece = useCallback((piece, board) => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      }
    }
    return newBoard;
  }, []);

  // Clear lines
  const clearLines = useCallback((board) => {
    const newBoard = board.filter(row => row.some(cell => cell === EMPTY_CELL));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }
    
    return { board: newBoard, clearedLines };
  }, []);

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (!gameRunning || gameOver) return;
    
    setCurrentPiece(prev => {
      if (!checkCollision(prev, board, dx, dy)) {
        return { ...prev, x: prev.x + dx, y: prev.y + dy };
      }
      return prev;
    });
  }, [gameRunning, gameOver, board, checkCollision]);

  // Rotate current piece
  const rotateCurrent = useCallback(() => {
    if (!gameRunning || gameOver) return;
    
    setCurrentPiece(prev => {
      const rotated = rotatePiece(prev);
      if (!checkCollision(rotated, board)) {
        return rotated;
      }
      return prev;
    });
  }, [gameRunning, gameOver, board, checkCollision, rotatePiece]);

  // Game tick
  const gameTick = useCallback(() => {
    setCurrentPiece(prev => {
      if (checkCollision(prev, board, 0, 1)) {
        // Place piece and spawn new one
        const newBoard = placePiece(prev, board);
        const { board: clearedBoard, clearedLines } = clearLines(newBoard);
        
        setBoard(clearedBoard);
        setLines(l => l + clearedLines);
        setScore(s => s + (clearedLines * 100 * level) + 10);
        setLevel(l => Math.floor((lines + clearedLines) / 10) + 1);
        
        const newPiece = getRandomPiece();
        if (checkCollision(newPiece, clearedBoard)) {
          setGameOver(true);
          setGameRunning(false);
          return prev;
        }
        
        return newPiece;
      } else {
        return { ...prev, y: prev.y + 1 };
      }
    });
  }, [board, checkCollision, placePiece, clearLines, level, lines]);

  // Game loop
  useEffect(() => {
    if (gameRunning && !gameOver) {
      const speed = Math.max(100, 800 - (level - 1) * 50);
      gameLoopRef.current = setInterval(gameTick, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }
    
    return () => clearInterval(gameLoopRef.current);
  }, [gameRunning, gameOver, gameTick, level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          rotateCurrent();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, gameOver, movePiece, rotateCurrent]);

  // Start/restart game
  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setGameRunning(true);
  };

  // Toggle pause
  const togglePause = () => {
    setGameRunning(prev => !prev);
  };

  // Render game board
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (!gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-5 h-5 sm:w-6 sm:h-6 ${COLORS[cell] || COLORS[0]} transition-all duration-150 hover:brightness-110`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            But hey, why not play some Tetris while you're here?
          </p>
          
          <div className="flex justify-center gap-4 mb-6 sm:mb-8">
            <a href="/">
              <Button variant="default" className="text-sm sm:text-base">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </a>
          </div>
        </div>

        {/* Game Container */}
        <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 items-start justify-center">
          {/* Game Board */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-2xl w-full xl:w-auto">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Tetris
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="bg-gradient-to-br from-background/90 to-muted/30 p-3 sm:p-4 rounded-xl border border-border/40 shadow-inner">
                {renderBoard()}
              </div>
              
              {/* Game Controls */}
              <div className="flex flex-wrap gap-2 justify-center">
                {!gameRunning && !gameOver && (
                  <Button 
                    onClick={startGame} 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}
                
                {gameRunning && (
                  <Button onClick={togglePause} variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                {gameOver && (
                  <Button 
                    onClick={startGame} 
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                )}
              </div>

              {gameOver && (
                <div className="text-center p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border border-destructive/20 backdrop-blur-sm">
                  <h3 className="text-lg sm:text-xl font-bold text-destructive mb-2">Game Over!</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">Final Score: {score}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Panel */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-2xl w-full xl:min-w-[250px] xl:max-w-[250px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Game Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <div className="text-lg sm:text-xl font-semibold text-foreground">{lines}</div>
                  <div className="text-xs text-muted-foreground">Lines</div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                  <div className="text-lg sm:text-xl font-semibold text-foreground">{level}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
              </div>

              {/* Controls Guide */}
              <div className="pt-4 border-t border-border/20">
                <h4 className="font-semibold text-sm text-foreground mb-3">Desktop Controls:</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                    <ArrowDown className="w-3 h-3 text-primary" />
                    <span>Arrow Keys: Move & Drop</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                    <RotateCw className="w-3 h-3 text-primary" />
                    <span>↑ or Space: Rotate</span>
                  </div>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="xl:hidden pt-4 border-t border-border/20">
                <h4 className="font-semibold text-sm text-foreground mb-3 text-center">Touch Controls:</h4>
                <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => movePiece(-1, 0)}
                    className="h-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:bg-primary/20"
                  >
                    ←
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={rotateCurrent}
                    className="h-12 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:bg-accent/20"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => movePiece(1, 0)}
                    className="h-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:bg-primary/20"
                  >
                    →
                  </Button>
                  <div></div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => movePiece(0, 1)}
                    className="h-12 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:bg-secondary/20"
                  >
                    ↓
                  </Button>
                  <div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
