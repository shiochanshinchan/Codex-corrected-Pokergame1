import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  pulse?: boolean;
}

export function ActionButton({ label, onPress, disabled, pulse }: ActionButtonProps) {
  const glowOpacity = useSharedValue(1);

  React.useEffect(() => {
    if (pulse && !disabled) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      glowOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [pulse, disabled]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.glow, disabled && styles.glowDisabled, glowStyle]} />
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && { transform: [{ scale: 0.96 }], opacity: 0.9 },
        ]}
      >
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  glow: {
    position: "absolute",
    width: 180,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00FF41",
    opacity: 0.15,
    shadowColor: "#00FF41",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 0,
  },
  glowDisabled: {
    backgroundColor: "#2E7D32",
    opacity: 0.08,
  },
  button: {
    width: 160,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#00FF41",
    backgroundColor: "#0D2B10",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FF41",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    borderColor: "#2E7D32",
    backgroundColor: "#0D1B0F",
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    fontSize: 20,
    fontWeight: "900",
    color: "#00FF41",
    fontFamily: "monospace",
    letterSpacing: 3,
    textShadowColor: "#00FF41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  labelDisabled: {
    color: "#2E7D32",
    textShadowColor: "transparent",
  },
});
