import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { ActionButton } from "@/components/poker/action-button";
import { BetButtons } from "@/components/poker/bet-buttons";
import { CoinDisplay } from "@/components/poker/coin-display";
import { PokerCard } from "@/components/poker/card";
import { WinDisplay } from "@/components/poker/win-display";
import { useGame } from "@/lib/game-context";

export default function GameScreen() {
  useKeepAwake();
  const { state, setBet, deal, toggleHold, draw, nextRound } = useGame();
  const { phase, hand, held, bet, coins, lastWin, lastHand } = state;

  const isIdle = phase === "idle";
  const isDealt = phase === "dealt";
  const isResult = phase === "result";
  const canDeal = (isIdle || isResult) && coins >= bet;

  const handleMainAction = () => {
    if (isDealt) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      draw();
    } else if (isResult) {
      nextRound();
    } else {
      deal();
    }
  };

  const getActionLabel = () => {
    if (isDealt) return "DRAW";
    if (isResult) return "NEXT";
    return "DEAL";
  };

  const isGameOver = isResult && coins <= 0;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Title + Stats */}
        <View style={styles.header}>
          <Text style={styles.title}>ARCADE{"\n"}POKER</Text>
          <View style={styles.statsRow}>
            <CoinDisplay label="COINS" value={coins} large />
            <View style={styles.divider} />
            <CoinDisplay label="BET" value={bet} highlight />
            <View style={styles.divider} />
            <CoinDisplay label="WIN" value={lastWin} highlight={lastWin > 0} />
          </View>
        </View>

        {/* Scanline decoration */}
        <View style={styles.scanline} />

        {/* Cards area */}
        <View style={styles.cardsSection}>
          <View style={styles.cardsRow}>
            {hand.length > 0
              ? hand.map((card, i) => (
                  <PokerCard
                    key={card.id}
                    card={card}
                    held={held[i]}
                    onPress={() => isDealt && toggleHold(i)}
                    disabled={!isDealt}
                    faceDown={false}
                    index={i}
                  />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <PokerCard
                    key={`empty-${i}`}
                    card={null}
                    held={false}
                    disabled
                    faceDown
                    index={i}
                  />
                ))}
          </View>

          {/* Hold instruction */}
          {isDealt && (
            <Text style={styles.holdInstruction}>
              タップしてカードをキープ
            </Text>
          )}
        </View>

        {/* Win / Result display */}
        <View style={styles.resultArea}>
          <WinDisplay
            result={lastHand}
            winAmount={lastWin}
            visible={isResult}
          />
          {isGameOver && (
            <Text style={styles.gameOverText}>GAME OVER — コインをリセットしました</Text>
          )}
          {!isResult && !isDealt && (
            <Text style={styles.idleText}>
              {coins < bet ? "コインが不足しています" : "DEAL を押してゲーム開始"}
            </Text>
          )}
        </View>

        {/* Bet buttons */}
        <BetButtons
          currentBet={bet}
          maxBet={coins}
          onSelect={setBet}
          disabled={isDealt}
        />

        {/* Main action button */}
        <View style={styles.actionArea}>
          <ActionButton
            label={getActionLabel()}
            onPress={handleMainAction}
            disabled={!canDeal && !isDealt && !isResult}
            pulse={isIdle && canDeal}
          />
        </View>

        {/* Bottom glow line */}
        <View style={styles.bottomGlow} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#00FF41",
    fontFamily: "monospace",
    letterSpacing: 6,
    textAlign: "center",
    textShadowColor: "#00FF41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    lineHeight: 38,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#1A2E1C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
    width: "100%",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#2E7D32",
  },
  scanline: {
    height: 2,
    backgroundColor: "#00FF41",
    opacity: 0.3,
    marginHorizontal: 0,
    shadowColor: "#00FF41",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cardsSection: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  holdInstruction: {
    fontSize: 11,
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
  },
  resultArea: {
    alignItems: "center",
    minHeight: 70,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  idleText: {
    fontSize: 13,
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
  },
  gameOverText: {
    fontSize: 12,
    color: "#FF3131",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "#FF3131",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  actionArea: {
    alignItems: "center",
    paddingVertical: 4,
  },
  bottomGlow: {
    height: 2,
    backgroundColor: "#00FF41",
    opacity: 0.2,
    marginHorizontal: 0,
  },
});
