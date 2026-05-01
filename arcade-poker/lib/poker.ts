// ============================================================
// Arcade Poker - Core Game Logic
// ============================================================

export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // unique identifier for animation keys
}

export type HandRank =
  | "royal_flush"
  | "straight_flush"
  | "four_of_a_kind"
  | "full_house"
  | "flush"
  | "straight"
  | "three_of_a_kind"
  | "two_pair"
  | "jacks_or_better"
  | "high_card";

export interface HandResult {
  rank: HandRank;
  name: string;
  nameJa: string;
  multiplier: number;
}

export type GamePhase = "idle" | "betting" | "dealt" | "drawn" | "result";

export interface GameState {
  phase: GamePhase;
  deck: Card[];
  hand: Card[];
  held: boolean[];
  bet: number;
  coins: number;
  lastWin: number;
  lastHand: HandResult | null;
  highScore: number;
  totalGames: number;
  totalWins: number;
}

// ============================================================
// Deck utilities
// ============================================================

const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${rank}-${suit}` });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[], count: number): { cards: Card[]; remaining: Card[] } {
  return {
    cards: deck.slice(0, count),
    remaining: deck.slice(count),
  };
}

// ============================================================
// Rank value helpers
// ============================================================

function rankValue(rank: Rank): number {
  const map: Record<Rank, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
  };
  return map[rank];
}

// ============================================================
// Hand evaluation
// ============================================================

export function evaluateHand(hand: Card[]): HandResult {
  const values = hand.map((c) => rankValue(c.rank)).sort((a, b) => b - a);
  const suits = hand.map((c) => c.suit);
  const ranks = hand.map((c) => c.rank);

  const isFlush = suits.every((s) => s === suits[0]);
  const isStraight = checkStraight(values);
  const counts = getCounts(ranks);
  const countValues = Object.values(counts).sort((a, b) => b - a);

  // Royal Flush
  if (isFlush && isStraight && values[0] === 14 && values[4] === 10) {
    return { rank: "royal_flush", name: "Royal Flush", nameJa: "ロイヤルフラッシュ", multiplier: 800 };
  }
  // Straight Flush
  if (isFlush && isStraight) {
    return { rank: "straight_flush", name: "Straight Flush", nameJa: "ストレートフラッシュ", multiplier: 50 };
  }
  // Four of a Kind
  if (countValues[0] === 4) {
    return { rank: "four_of_a_kind", name: "Four of a Kind", nameJa: "フォーカード", multiplier: 25 };
  }
  // Full House
  if (countValues[0] === 3 && countValues[1] === 2) {
    return { rank: "full_house", name: "Full House", nameJa: "フルハウス", multiplier: 9 };
  }
  // Flush
  if (isFlush) {
    return { rank: "flush", name: "Flush", nameJa: "フラッシュ", multiplier: 6 };
  }
  // Straight
  if (isStraight) {
    return { rank: "straight", name: "Straight", nameJa: "ストレート", multiplier: 4 };
  }
  // Three of a Kind
  if (countValues[0] === 3) {
    return { rank: "three_of_a_kind", name: "Three of a Kind", nameJa: "スリーカード", multiplier: 3 };
  }
  // Two Pair
  if (countValues[0] === 2 && countValues[1] === 2) {
    return { rank: "two_pair", name: "Two Pair", nameJa: "ツーペア", multiplier: 2 };
  }
  // Jacks or Better (pair of Jacks, Queens, Kings, or Aces)
  if (countValues[0] === 2) {
    const pairedRank = Object.entries(counts).find(([, v]) => v === 2)?.[0] as Rank | undefined;
    if (pairedRank && rankValue(pairedRank) >= 11) {
      return { rank: "jacks_or_better", name: "Jacks or Better", nameJa: "ジャックスオアベター", multiplier: 1 };
    }
  }
  // High Card (no win)
  return { rank: "high_card", name: "High Card", nameJa: "ハイカード", multiplier: 0 };
}

function checkStraight(sortedValues: number[]): boolean {
  // Normal straight
  const normal = sortedValues[0] - sortedValues[4] === 4 && new Set(sortedValues).size === 5;
  if (normal) return true;
  // Wheel: A-2-3-4-5
  const isWheel =
    sortedValues[0] === 14 &&
    sortedValues[1] === 5 &&
    sortedValues[2] === 4 &&
    sortedValues[3] === 3 &&
    sortedValues[4] === 2;
  return isWheel;
}

function getCounts(ranks: Rank[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const rank of ranks) {
    counts[rank] = (counts[rank] ?? 0) + 1;
  }
  return counts;
}

// ============================================================
// Pay table
// ============================================================

export const PAY_TABLE: HandResult[] = [
  { rank: "royal_flush", name: "Royal Flush", nameJa: "ロイヤルフラッシュ", multiplier: 800 },
  { rank: "straight_flush", name: "Straight Flush", nameJa: "ストレートフラッシュ", multiplier: 50 },
  { rank: "four_of_a_kind", name: "Four of a Kind", nameJa: "フォーカード", multiplier: 25 },
  { rank: "full_house", name: "Full House", nameJa: "フルハウス", multiplier: 9 },
  { rank: "flush", name: "Flush", nameJa: "フラッシュ", multiplier: 6 },
  { rank: "straight", name: "Straight", nameJa: "ストレート", multiplier: 4 },
  { rank: "three_of_a_kind", name: "Three of a Kind", nameJa: "スリーカード", multiplier: 3 },
  { rank: "two_pair", name: "Two Pair", nameJa: "ツーペア", multiplier: 2 },
  { rank: "jacks_or_better", name: "Jacks or Better", nameJa: "ジャックスオアベター", multiplier: 1 },
];

export function calculatePayout(result: HandResult, bet: number): number {
  return result.multiplier * bet;
}

// ============================================================
// Suit display helpers
// ============================================================

export function getSuitSymbol(suit: Suit): string {
  const map: Record<Suit, string> = {
    spades: "♠",
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
  };
  return map[suit];
}

export function isRedSuit(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}

// ============================================================
// Initial game state
// ============================================================

export const INITIAL_COINS = 100;
export const BET_OPTIONS = [1, 5, 10, 25, 50];

export function createInitialState(savedCoins?: number, highScore?: number): GameState {
  return {
    phase: "idle",
    deck: [],
    hand: [],
    held: [false, false, false, false, false],
    bet: 5,
    coins: savedCoins ?? INITIAL_COINS,
    lastWin: 0,
    lastHand: null,
    highScore: highScore ?? 0,
    totalGames: 0,
    totalWins: 0,
  };
}
