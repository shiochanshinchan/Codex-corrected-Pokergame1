import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { HandResult } from "@/lib/poker";

interface WinDisplayProps {
  result: HandResult | null;
  winAmount: number;
  visible: boolean;
}

export function WinDisplay({ result, winAmount, visible }: WinDisplayProps) {
  const flashOpacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible && winAmount > 0) {
      scale.value = withTiming(1, { duration: 200 });
      flashOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.5, { duration: 300 })
        ),
        6,
        false
      );
    } else {
      scale.value = withTiming(0.8, { duration: 150 });
      flashOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, winAmount]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible || !result) return null;

  const isWin = winAmount > 0;
  const color = isWin ? "#FFD700" : "#FF3131";
  const isRoyal = result.rank === "royal_flush";

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <View style={[styles.badge, { borderColor: color, shadowColor: color }]}>
        {isRoyal && <Text style={styles.crown}>👑</Text>}
        <Text
          style={[
            styles.handName,
            {
              color,
              textShadowColor: color,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            },
          ]}
        >
          {result.nameJa}
        </Text>
        {isWin && (
          <Text
            style={[
              styles.winAmount,
              {
                color,
                textShadowColor: color,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              },
            ]}
          >
            +{winAmount} COINS
          </Text>
        )}
        {!isWin && (
          <Text style={[styles.loseText, { color }]}>LOSE</Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "rgba(13, 27, 15, 0.9)",
    alignItems: "center",
    gap: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  crown: {
    fontSize: 20,
  },
  handName: {
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  winAmount: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  loseText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
});
