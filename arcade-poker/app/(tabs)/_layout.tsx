import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00FF41",
        tabBarInactiveTintColor: "#2E7D32",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#0D1B0F",
          borderTopColor: "#2E7D32",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "GAME",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="suit.spade.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="paytable"
        options={{
          title: "PAY TABLE",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="list.bullet.rectangle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "RANKING",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="trophy.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
