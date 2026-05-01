import { describe, expect, it } from "vitest";

import {
  calculatePayout,
  createDeck,
  evaluateHand,
  shuffleDeck,
  type Card,
} from "../lib/poker";

// Helper to create a card
function c(rank: Card["rank"], suit: Card["suit"]): Card {
  return { rank, suit, id: `${rank}-${suit}` };
}

describe("createDeck", () => {
  it("creates 52 unique cards", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    const ids = new Set(deck.map((c) => c.id));
    expect(ids.size).toBe(52);
  });
});

describe("shuffleDeck", () => {
  it("returns same number of cards", () => {
    const deck = createDeck();
    const shuffled = shuffleDeck(deck);
    expect(shuffled).toHaveLength(52);
  });

  it("does not modify original deck", () => {
    const deck = createDeck();
    const original = [...deck];
    shuffleDeck(deck);
    expect(deck).toEqual(original);
  });
});

describe("evaluateHand", () => {
  it("detects Royal Flush", () => {
    const hand = [
      c("A", "spades"),
      c("K", "spades"),
      c("Q", "spades"),
      c("J", "spades"),
      c("10", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("royal_flush");
    expect(result.multiplier).toBe(800);
  });

  it("detects Straight Flush", () => {
    const hand = [
      c("9", "hearts"),
      c("8", "hearts"),
      c("7", "hearts"),
      c("6", "hearts"),
      c("5", "hearts"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("straight_flush");
    expect(result.multiplier).toBe(50);
  });

  it("detects Four of a Kind", () => {
    const hand = [
      c("A", "spades"),
      c("A", "hearts"),
      c("A", "diamonds"),
      c("A", "clubs"),
      c("K", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("four_of_a_kind");
    expect(result.multiplier).toBe(25);
  });

  it("detects Full House", () => {
    const hand = [
      c("K", "spades"),
      c("K", "hearts"),
      c("K", "diamonds"),
      c("Q", "clubs"),
      c("Q", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("full_house");
    expect(result.multiplier).toBe(9);
  });

  it("detects Flush", () => {
    const hand = [
      c("A", "clubs"),
      c("9", "clubs"),
      c("7", "clubs"),
      c("4", "clubs"),
      c("2", "clubs"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("flush");
    expect(result.multiplier).toBe(6);
  });

  it("detects Straight", () => {
    const hand = [
      c("9", "spades"),
      c("8", "hearts"),
      c("7", "diamonds"),
      c("6", "clubs"),
      c("5", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("straight");
    expect(result.multiplier).toBe(4);
  });

  it("detects Wheel Straight (A-2-3-4-5)", () => {
    const hand = [
      c("A", "spades"),
      c("2", "hearts"),
      c("3", "diamonds"),
      c("4", "clubs"),
      c("5", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("straight");
  });

  it("detects Three of a Kind", () => {
    const hand = [
      c("7", "spades"),
      c("7", "hearts"),
      c("7", "diamonds"),
      c("K", "clubs"),
      c("Q", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("three_of_a_kind");
    expect(result.multiplier).toBe(3);
  });

  it("detects Two Pair", () => {
    const hand = [
      c("A", "spades"),
      c("A", "hearts"),
      c("K", "diamonds"),
      c("K", "clubs"),
      c("Q", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("two_pair");
    expect(result.multiplier).toBe(2);
  });

  it("detects Jacks or Better (pair of Jacks)", () => {
    const hand = [
      c("J", "spades"),
      c("J", "hearts"),
      c("9", "diamonds"),
      c("7", "clubs"),
      c("3", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("jacks_or_better");
    expect(result.multiplier).toBe(1);
  });

  it("detects Jacks or Better (pair of Aces)", () => {
    const hand = [
      c("A", "spades"),
      c("A", "hearts"),
      c("9", "diamonds"),
      c("7", "clubs"),
      c("3", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("jacks_or_better");
    expect(result.multiplier).toBe(1);
  });

  it("returns High Card for pair of Tens (below Jacks)", () => {
    const hand = [
      c("10", "spades"),
      c("10", "hearts"),
      c("9", "diamonds"),
      c("7", "clubs"),
      c("3", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("high_card");
    expect(result.multiplier).toBe(0);
  });

  it("returns High Card for no matching hand", () => {
    const hand = [
      c("A", "spades"),
      c("9", "hearts"),
      c("7", "diamonds"),
      c("5", "clubs"),
      c("3", "spades"),
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe("high_card");
    expect(result.multiplier).toBe(0);
  });
});

describe("calculatePayout", () => {
  it("multiplies the hand multiplier by the bet", () => {
    const result = evaluateHand([
      c("A", "spades"),
      c("A", "hearts"),
      c("A", "diamonds"),
      c("A", "clubs"),
      c("K", "spades"),
    ]);

    expect(calculatePayout(result, 5)).toBe(125);
  });

  it("returns 0 for a losing hand", () => {
    const result = evaluateHand([
      c("A", "spades"),
      c("9", "hearts"),
      c("7", "diamonds"),
      c("5", "clubs"),
      c("3", "spades"),
    ]);

    expect(calculatePayout(result, 50)).toBe(0);
  });
});
