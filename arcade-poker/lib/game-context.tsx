import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import {
  BET_OPTIONS,
  INITIAL_COINS,
  createDeck,
  createInitialState,
  dealCards,
  evaluateHand,
  shuffleDeck,
  type GameState,
} from "@/lib/poker";

// ============================================================
// Actions
// ============================================================

type Action =
  | { type: "SET_BET"; bet: number }
  | { type: "DEAL" }
  | { type: "TOGGLE_HOLD"; index: number }
  | { type: "DRAW" }
  | { type: "NEXT_ROUND" }
  | { type: "LOAD_SAVED"; coins: number; highScore: number; totalGames: number; totalWins: number };

// ============================================================
// Reducer
// ============================================================

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOAD_SAVED": {
      return {
        ...state,
        coins: action.coins,
        highScore: action.highScore,
        totalGames: action.totalGames,
        totalWins: action.totalWins,
      };
    }

    case "SET_BET": {
      if (state.phase !== "idle" && state.phase !== "result") return state;
      const bet = Math.min(action.bet, state.coins);
      return { ...state, bet };
    }

    case "DEAL": {
      if (state.phase !== "idle" && state.phase !== "result") return state;
      if (state.coins < state.bet) return state;

      const deck = shuffleDeck(createDeck());
      const { cards: hand, remaining } = dealCards(deck, 5);

      return {
        ...state,
        phase: "dealt",
        deck: remaining,
        hand,
        held: [false, false, false, false, false],
        coins: state.coins - state.bet,
        lastWin: 0,
        lastHand: null,
      };
    }

    case "TOGGLE_HOLD": {
      if (state.phase !== "dealt") return state;
      const held = [...state.held];
      held[action.index] = !held[action.index];
      return { ...state, held };
    }

    case "DRAW": {
      if (state.phase !== "dealt") return state;

      // Replace non-held cards
      const newHand = [...state.hand];
      let remaining = [...state.deck];

      for (let i = 0; i < 5; i++) {
        if (!state.held[i]) {
          const [newCard, ...rest] = remaining;
          newHand[i] = newCard;
          remaining = rest;
        }
      }

      const result = evaluateHand(newHand);
      const winAmount = result.multiplier * state.bet;
      const newCoins = state.coins + winAmount;
      const newHighScore = Math.max(state.highScore, newCoins);
      const newTotalGames = state.totalGames + 1;
      const newTotalWins = state.totalWins + (winAmount > 0 ? 1 : 0);

      return {
        ...state,
        phase: "result",
        deck: remaining,
        hand: newHand,
        lastWin: winAmount,
        lastHand: result,
        coins: newCoins,
        highScore: newHighScore,
        totalGames: newTotalGames,
        totalWins: newTotalWins,
      };
    }

    case "NEXT_ROUND": {
      if (state.phase !== "result") return state;
      // If out of coins, reset to initial
      const coins = state.coins <= 0 ? INITIAL_COINS : state.coins;
      return {
        ...state,
        phase: "idle",
        hand: [],
        held: [false, false, false, false, false],
        deck: [],
        lastWin: 0,
        lastHand: null,
        coins,
        bet: Math.min(state.bet, coins),
      };
    }

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

interface GameContextValue {
  state: GameState;
  setBet: (bet: number) => void;
  deal: () => void;
  toggleHold: (index: number) => void;
  draw: () => void;
  nextRound: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const STORAGE_KEY = "arcade_poker_state";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, createInitialState());

  // Load saved state on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({
            type: "LOAD_SAVED",
            coins: parsed.coins ?? INITIAL_COINS,
            highScore: parsed.highScore ?? 0,
            totalGames: parsed.totalGames ?? 0,
            totalWins: parsed.totalWins ?? 0,
          });
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Persist important state whenever it changes
  useEffect(() => {
    if (state.phase === "idle" || state.phase === "result") {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          coins: state.coins,
          highScore: state.highScore,
          totalGames: state.totalGames,
          totalWins: state.totalWins,
        })
      ).catch(() => {});
    }
  }, [state.coins, state.highScore, state.totalGames, state.totalWins, state.phase]);

  const setBet = useCallback((bet: number) => dispatch({ type: "SET_BET", bet }), []);
  const deal = useCallback(() => dispatch({ type: "DEAL" }), []);
  const toggleHold = useCallback((index: number) => dispatch({ type: "TOGGLE_HOLD", index }), []);
  const draw = useCallback(() => dispatch({ type: "DRAW" }), []);
  const nextRound = useCallback(() => dispatch({ type: "NEXT_ROUND" }), []);

  return (
    <GameContext.Provider value={{ state, setBet, deal, toggleHold, draw, nextRound }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export { BET_OPTIONS };
