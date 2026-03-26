import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getSuitSymbol, isRedSuit, type Card as CardType } from "@/lib/poker";

interface CardProps {
  card: CardType | null;
  held: boolean;
  onPress?: () => void;
  disabled?: boolean;
  faceDown?: boolean;
  index?: number;
}

export function PokerCard({ card, held, onPress, disabled, faceDown = false, index = 0 }: CardProps) {
  const flipProgress = useSharedValue(faceDown ? 0 : 1);
  const dealProgress = useSharedValue(0);

  useEffect(() => {
    // Deal animation with staggered delay
    dealProgress.value = withTiming(1, { duration: 300 + index * 80 });
  }, []);

  useEffect(() => {
    flipProgress.value = withTiming(faceDown ? 0 : 1, { duration: 300 });
  }, [faceDown]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 0.5, 1], [180, 90, 0]);
    const opacity = interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 0.5, 1], [0, 90, 180]);
    const opacity = interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const dealStyle = useAnimatedStyle(() => {
    return {
      opacity: dealProgress.value,
      transform: [
        { translateY: interpolate(dealProgress.value, [0, 1], [30, 0]) },
      ],
    };
  });

  const red = card ? isRedSuit(card.suit) : false;
  const suitSymbol = card ? getSuitSymbol(card.suit) : "";

  return (
    <Animated.View style={[styles.wrapper, dealStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !disabled && { transform: [{ scale: 0.95 }] },
        ]}
      >
        {/* Card container */}
        <View style={[styles.cardContainer, held && styles.heldContainer]}>
          {/* Back face */}
          <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <View style={styles.backPattern}>
            <Text style={styles.backText}>♠ ♥{"\n"}♦ ♣</Text>
          </View>
          </Animated.View>

          {/* Front face */}
          <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
            {card && (
              <>
                {/* Top-left rank + suit */}
                <View style={styles.topLeft}>
                  <Text style={[styles.rankText, red && styles.redText]}>{card.rank}</Text>
                  <Text style={[styles.suitSmall, red && styles.redText]}>{suitSymbol}</Text>
                </View>

                {/* Center suit */}
                <Text style={[styles.centerSuit, red && styles.redText]}>{suitSymbol}</Text>

                {/* Bottom-right rank + suit (rotated) */}
                <View style={[styles.topLeft, styles.bottomRight]}>
                  <Text style={[styles.rankText, red && styles.redText, styles.rotated]}>{card.rank}</Text>
                  <Text style={[styles.suitSmall, red && styles.redText, styles.rotated]}>{suitSymbol}</Text>
                </View>
              </>
            )}
          </Animated.View>
        </View>

        {/* HOLD badge */}
        {held && (
          <View style={styles.holdBadge}>
            <Text style={styles.holdText}>HOLD</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 6,
  },
  pressable: {
    alignItems: "center",
    gap: 6,
  },
  cardContainer: {
    width: 62,
    height: 90,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2E7D32",
    overflow: "hidden",
    position: "relative",
  },
  heldContainer: {
    borderColor: "#FFD700",
    borderWidth: 3,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 6,
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#1A3A5C",
    justifyContent: "center",
    alignItems: "center",
  },
  cardFront: {
    backgroundColor: "#FFFFFF",
    padding: 4,
  },
  backPattern: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  backText: {
    fontSize: 18,
    color: "#4A90D9",
    letterSpacing: 2,
    textAlign: "center",
    lineHeight: 24,
  },
  topLeft: {
    position: "absolute",
    top: 3,
    left: 4,
    alignItems: "center",
  },
  bottomRight: {
    top: undefined,
    left: undefined,
    bottom: 3,
    right: 4,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1A1A1A",
    lineHeight: 16,
  },
  suitSmall: {
    fontSize: 10,
    color: "#1A1A1A",
    lineHeight: 12,
  },
  centerSuit: {
    position: "absolute",
    top: "50%",
    left: "50%",
    fontSize: 28,
    color: "#1A1A1A",
    transform: [{ translateX: -14 }, { translateY: -16 }],
  },
  redText: {
    color: "#CC0000",
  },
  rotated: {
    transform: [{ rotate: "180deg" }],
  },
  holdBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  holdText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#0D1B0F",
    letterSpacing: 1,
  },
});
