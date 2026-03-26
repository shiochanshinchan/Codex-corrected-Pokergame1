import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CoinDisplayProps {
  label: string;
  value: number;
  highlight?: boolean;
  large?: boolean;
}

export function CoinDisplay({ label, value, highlight = false, large = false }: CoinDisplayProps) {
  const valueColor = highlight ? "#FFD700" : "#00FF41";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          {
            color: valueColor,
            fontSize: large ? 28 : 20,
            textShadowColor: valueColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          },
        ]}
      >
        {value.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 10,
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  value: {
    fontFamily: "monospace",
    fontWeight: "900",
    letterSpacing: 2,
  },
});
