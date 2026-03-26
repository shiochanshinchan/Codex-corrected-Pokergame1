import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { BET_OPTIONS } from "@/lib/game-context";

interface BetButtonsProps {
  currentBet: number;
  maxBet: number;
  onSelect: (bet: number) => void;
  disabled?: boolean;
}

export function BetButtons({ currentBet, maxBet, onSelect, disabled }: BetButtonsProps) {
  const handlePress = (bet: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(bet);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>BET</Text>
      <View style={styles.buttons}>
        {BET_OPTIONS.map((bet) => {
          const isSelected = currentBet === bet;
          const isDisabled = disabled || bet > maxBet;
          return (
            <Pressable
              key={bet}
              onPress={() => handlePress(bet)}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.button,
                isSelected && styles.selectedButton,
                isDisabled && styles.disabledButton,
                pressed && !isDisabled && { transform: [{ scale: 0.93 }] },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.selectedText,
                  isDisabled && styles.disabledText,
                ]}
              >
                {bet}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 10,
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  buttons: {
    flexDirection: "row",
    gap: 6,
  },
  button: {
    width: 44,
    height: 36,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#2E7D32",
    backgroundColor: "#1A2E1C",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    borderColor: "#FFD700",
    backgroundColor: "#2A3A1C",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4CAF50",
    fontFamily: "monospace",
  },
  selectedText: {
    color: "#FFD700",
  },
  disabledText: {
    color: "#2E7D32",
  },
});
