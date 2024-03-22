import { useEffect, useReducer, useRef, useState } from "react";
import { GameState, GameStateAction, Actions, KeyboardEvents } from "./interfaces";
import {
  drawTetris,
  getColorByType,
  initializeState,
  processGame,
} from "./utils";

export const Tetris = () => {
  const [gameState, dispatch] = useReducer<
    (state: GameState, action: GameStateAction) => GameState
  >(processGame, initializeState());

  const intervalId = useRef<number | null>(0);
  const [tick, setTick] = useState(0);
  const [timeInterval, setTimeInterval] = useState(3000);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === KeyboardEvents.ArrowDown) {
        event.preventDefault();
        dispatch({ type: Actions.DROP });
      } else if (event.key === KeyboardEvents.ArrowLeft) {
        event.preventDefault();
        dispatch({ type: Actions.MOVE_LEFT });
      } else if (event.key === KeyboardEvents.ArrowRight) {
        event.preventDefault();
        dispatch({ type: Actions.MOVE_RIGHT });
      } else if (event.key === KeyboardEvents.ArrowUp) {
        event.preventDefault();
        dispatch({ type: Actions.ROTATE });
      } else if (event.key === KeyboardEvents.Space) {
        event.preventDefault();
        dispatch({ type: Actions.DROP_FULL });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Increase speed
  useEffect(() => {
    setTimeInterval((interval) => {
      return interval - 100;
    });
  }, [gameState.level]);

  // Game loop
  useEffect(() => {
    if (!intervalId.current) {
      intervalId.current = setInterval(() => {
        setTick((prevTick) => prevTick + 1);
      }, timeInterval);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [timeInterval]);

  // Drop piece
  useEffect(() => {
    if (tick !== 0) {
      dispatch({ type: Actions.DROP });
    }
  }, [tick]);

  // Draw
  return (
    <div>
      {drawTetris(gameState).map((rows) => {
        const gridRow = rows.map((cell) => {
          if (cell[1] === "clear") {
            // Draw an empty square using svg
            return (
              <svg width="20" height="20">
                <rect
                  width="20"
                  height="20"
                  fill="white"
                  stroke="black"
                  strokeWidth="1"
                />
              </svg>
            );
          }

          // Draw a filled svg cell
          return (
            <svg width="20" height="20">
              <rect
                width="20"
                height="20"
                fill={getColorByType(cell[1])}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          );
        });

        return [...gridRow, <br />];
      })}
    </div>
  );
};