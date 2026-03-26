import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { NeonText } from "@/components/poker/neon-text";
import { CoinDisplay } from "@/components/poker/coin-display";
import { useGame } from "@/lib/game-context";

export default function RankingScreen() {
  const { state } = useGame();
  const { highScore, coins, totalGames, totalWins } = state;

  const winRate =
    totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <NeonText size={24} bold style={styles.title}>
            HIGH SCORE
          </NeonText>
        </View>

        {/* Scanline */}
        <View style={styles.scanline} />

        {/* Trophy area */}
        <View style={styles.trophyArea}>
          <Text style={styles.trophy}>🏆</Text>
          <CoinDisplay label="BEST COINS" value={highScore} highlight large />
        </View>

        {/* Current coins */}
        <View style={styles.currentArea}>
          <View style={styles.statCard}>
            <CoinDisplay label="CURRENT COINS" value={coins} />
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatBox label="TOTAL GAMES" value={totalGames.toString()} />
          <StatBox label="TOTAL WINS" value={totalWins.toString()} />
          <StatBox label="WIN RATE" value={`${winRate}%`} />
        </View>

        {/* Arcade decoration */}
        <View style={styles.arcadeDecor}>
          <Text style={styles.arcadeText}>
            ♠ ♥ ♦ ♣ ♠ ♥ ♦ ♣ ♠ ♥ ♦ ♣
          </Text>
        </View>

        {/* Insert coin message */}
        <View style={styles.insertCoin}>
          <Text style={styles.insertCoinText}>
            INSERT COIN TO PLAY
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 0,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  title: {
    letterSpacing: 6,
  },
  scanline: {
    height: 2,
    backgroundColor: "#00FF41",
    opacity: 0.3,
    shadowColor: "#00FF41",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  trophyArea: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
    backgroundColor: "rgba(255, 215, 0, 0.05)",
    borderBottomWidth: 1,
    borderBottomColor: "#2E7D32",
  },
  trophy: {
    fontSize: 56,
  },
  currentArea: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A2E1C",
  },
  statCard: {
    backgroundColor: "#1A2E1C",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    justifyContent: "center",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1A2E1C",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2E7D32",
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 9,
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#00FF41",
    fontFamily: "monospace",
    textShadowColor: "#00FF41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  arcadeDecor: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#1A2E1C",
  },
  arcadeText: {
    fontSize: 14,
    color: "#2E7D32",
    fontFamily: "monospace",
    letterSpacing: 4,
  },
  insertCoin: {
    alignItems: "center",
    paddingBottom: 20,
  },
  insertCoinText: {
    fontSize: 12,
    color: "#FFD700",
    fontFamily: "monospace",
    letterSpacing: 3,
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
