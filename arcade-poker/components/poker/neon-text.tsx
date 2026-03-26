import React from "react";
import { StyleSheet, Text, type TextStyle } from "react-native";

interface NeonTextProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: TextStyle;
  bold?: boolean;
}

export function NeonText({
  children,
  color = "#00FF41",
  size = 16,
  style,
  bold = false,
}: NeonTextProps) {
  return (
    <Text
      style={[
        styles.base,
        {
          color,
          fontSize: size,
          fontWeight: bold ? "900" : "700",
          textShadowColor: color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "monospace",
    letterSpacing: 1,
  },
});
