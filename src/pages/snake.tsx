import { useEffect, useRef, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { siteMetadata } from "@/data/siteMetaData.mjs";

const GRID_SIZE = 20;
const GAME_SPEED = 150; // Milliseconds

// --- FIX: Define a type for positions ---
type Position = { x: number; y: number };

export default function SnakeGamePage() {
  // Use state for UI-related values
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Use refs for game logic state
  const boardRef = useRef<HTMLDivElement>(null);

  const gameIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Use the new Position type ---
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Position>({ x: 15, y: 10 });
  const directionRef = useRef<"up" | "down" | "left" | "right">("right");
  const pendingDirectionRef = useRef<"up" | "down" | "left" | "right">("right");
  const scoreRef = useRef(0);

  // Keep scoreRef in sync with score state
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Load high score from local storage on mount
  useEffect(() => {
    const storedHighScore = localStorage.getItem("snakeHighScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  // Update high score if score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snakeHighScore", String(score));
    }
  }, [score, highScore]);

  // Main game drawing function
  const drawGame = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;

    board.innerHTML = ""; // Clear board

    // Draw Snake
    snakeRef.current.forEach((segment) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.gridRowStart = String(segment.y);
      snakeElement.style.gridColumnStart = String(segment.x);
      snakeElement.classList.add("snake");
      board.appendChild(snakeElement);
    });

    // Draw Food
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = String(foodRef.current.y);
    foodElement.style.gridColumnStart = String(foodRef.current.x);
    foodElement.classList.add("food");
    board.appendChild(foodElement);
  }, []);

  // Generate new food in a valid spot
  const generateFood = useCallback(() => {
    // --- FIX: Explicitly type newFoodPosition ---
    let newFoodPosition: Position;

    // --- FIX #2: Disable linter for intentional 'while(true)' ---
    // eslint-disable-next-line no-constant-condition
    while (true) {
      newFoodPosition = {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1,
      };
      const onSnake = snakeRef.current.some(
        (segment) =>
          segment.x === newFoodPosition.x && segment.y === newFoodPosition.y,
      );
      if (!onSnake) break;
    }
    foodRef.current = newFoodPosition;
  }, []);

  // Game over logic
  const gameOver = useCallback(() => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    setIsGameRunning(false);
    setIsGameOver(true);
  }, []);

  // Main game loop
  const gameLoop = useCallback(() => {
    directionRef.current = pendingDirectionRef.current;
    const snake = snakeRef.current;
    const head = { ...snake[0] };

    switch (directionRef.current) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    // Wall Wraparound Logic
    if (head.x < 1) head.x = GRID_SIZE;
    if (head.x > GRID_SIZE) head.x = 1;
    if (head.y < 1) head.y = GRID_SIZE;
    if (head.y > GRID_SIZE) head.y = 1;

    // Check for self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }
    snake.unshift(head);
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((prevScore) => prevScore + 1);
      generateFood();
    } else {
      snake.pop();
    }
    drawGame();
  }, [drawGame, generateFood, gameOver]);

  // Start game function
  // --- FIX #3: Wrap startGame in useCallback ---
  const startGame = useCallback(() => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    setIsGameOver(false); // Hide game over message

    // Reset game state
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = "right";
    pendingDirectionRef.current = "right";
    setScore(0);
    scoreRef.current = 0;
    setIsGameRunning(true);

    generateFood();

    gameIntervalRef.current = setInterval(gameLoop, GAME_SPEED);
  }, [gameLoop, generateFood]); // Add dependencies

  // Handle keyboard input
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const validKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
      ];
      if (!validKeys.includes(e.key)) return;

      e.preventDefault();

      // If game is over, the first keypress should restart the game
      if (isGameOver) {
        startGame();
        return;
      }

      // Don't allow input if game isn't running
      if (!isGameRunning) return;

      const dir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (dir !== "down") pendingDirectionRef.current = "up";
          break;
        case "ArrowDown":
        case "s":
          if (dir !== "up") pendingDirectionRef.current = "down";
          break;
        case "ArrowLeft":
        case "a":
          if (dir !== "right") pendingDirectionRef.current = "left";
          break;
        case "ArrowRight":
        case "d":
          if (dir !== "left") pendingDirectionRef.current = "right";
          break;
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
    // --- FIX #4: Add startGame to dependency array ---
  }, [isGameRunning, isGameOver, gameLoop, startGame]); // Rerun if game state changes

  // Autorun on page load
  useEffect(() => {
    startGame();

    // Cleanup interval on component unmount
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
    // --- FIX #5: Add startGame to dependency array ---
  }, [startGame]);

  return (
    <>
      <NextSeo
        title="Snake"
        description="A classic snake game built inside my portfolio."
        canonical={`${siteMetadata.siteUrl}/snake`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/snake`,
          title: "Snake",
          description: "Classic snake game.",
        }}
      />

      <section className="mx-auto mb-40 w-full max-w-7xl gap-20 px-6 sm:px-14 md:px-20">
        <h1 className="mb-6 text-2xl font-semibold text-foreground md:text-4xl">
          Snake Game
        </h1>

        <div className="game-container">
          <div className="game-header">
            <div>
              Score: <span>{score}</span>
            </div>
            <div>
              High Score: <span>{highScore}</span>
            </div>
          </div>

          <div ref={boardRef} className="game-board">
            {isGameOver && (
              <div className="game-over-overlay">
                <div className="game-over-title">Game Over</div>
                <div className="game-over-score">Final Score: {score}</div>
              </div>
            )}
          </div>

          <button onClick={startGame} className="start-button">
            Restart Game
          </button>
        </div>
      </section>

      {/* Scoped CSS for the game */}
      <style jsx>{`
        .game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .game-header {
          display: flex;
          justify-content: space-between;
          width: ${GRID_SIZE * 20}px;
          max-width: 100%;
          font-size: 1.2rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .game-board {
          position: relative;
          display: grid;
          grid-template-rows: repeat(${GRID_SIZE}, 20px);
          grid-template-columns: repeat(${GRID_SIZE}, 20px);
          width: ${GRID_SIZE * 20}px;
          height: ${GRID_SIZE * 20}px;
          border: 3px solid hsl(var(--accent));

          /* --- Use muted color for the board --- */
          background-color: hsl(var(--muted));

          margin-top: 1rem;
          cursor: default;
          background-clip: padding-box;
        }
        .start-button {
          margin-top: 1.5rem;
          padding: 0.5rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: hsl(var(--background));
          background-color: hsl(var(--accent));
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .start-button:hover {
          opacity: 0.8;
        }
        .game-over-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          /* --- Use muted color for overlay --- */
          background-color: hsla(var(--muted), 0.8);

          backdrop-filter: blur(5px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: hsl(var(--accent));
          z-index: 10;
        }
        .game-over-title {
          font-size: 2.5rem;
          font-weight: 700;
        }
        .game-over-score {
          font-size: 1.5rem;
          margin-top: 0.5rem;
        }

        :global(.game-board .snake) {
          background-color: hsl(var(--accent));

          /* --- Snake border is now muted color --- */
          border: 1px solid hsl(var(--muted));
          box-sizing: border-box;
        }
        :global(.game-board .food) {
          /* --- New food color --- */
          background-color: #84e1d9; /* Minty Teal */
          border-radius: 50%;
          box-sizing: border-box;
        }

        :global(.game-board) {
          box-sizing: border-box; /* make width/height include the board border */
          overflow: hidden; /* clip tiny subpixel overflows */
        }

        /* make grid items exactly the size of a cell and keep borders inside */
        :global(.game-board .snake),
        :global(.game-board .food) {
          width: 100%;
          height: 100%;
          box-sizing: border-box; /* include border in the element's size so it won't overflow */
          display: block; /* guard against strange default inline behavior */
        }
      `}</style>
    </>
  );
}
