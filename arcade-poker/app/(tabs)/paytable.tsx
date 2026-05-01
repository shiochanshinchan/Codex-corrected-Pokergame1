import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { NeonText } from "@/components/poker/neon-text";
import { PAY_TABLE, calculatePayout } from "@/lib/poker";
import { useGame } from "@/lib/game-context";

export default function PayTableScreen() {
  const { state } = useGame();
  const { bet } = state;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <NeonText size={24} bold style={styles.title}>
            PAY TABLE
          </NeonText>
          <Text style={styles.betInfo}>現在のベット: {bet} コイン</Text>
        </View>

        {/* Scanline */}
        <View style={styles.scanline} />

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colHeader, { flex: 2 }]}>役</Text>
          <Text style={[styles.colHeader, styles.colRight]}>倍率</Text>
          <Text style={[styles.colHeader, styles.colRight]}>払出</Text>
        </View>

        <FlatList
          data={PAY_TABLE}
          keyExtractor={(item) => item.rank}
          renderItem={({ item, index }) => {
            const payout = calculatePayout(item, bet);
            const isTop = index === 0;
            const rowColor = isTop ? "#FFD700" : index < 3 ? "#00FF41" : "#4CAF50";
            return (
              <View
                style={[
                  styles.row,
                  index % 2 === 0 && styles.rowAlt,
                  isTop && styles.topRow,
                ]}
              >
                <View style={{ flex: 2 }}>
                  <Text style={[styles.handName, { color: rowColor }]}>
                    {item.nameJa}
                  </Text>
                  <Text style={styles.handNameEn}>{item.name}</Text>
                </View>
                <Text style={[styles.multiplier, { color: rowColor }]}>
                  {item.multiplier}x
                </Text>
                <Text style={[styles.payout, { color: rowColor }]}>
                  {payout}
                </Text>
              </View>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Footer note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ※ ジャックス以上のペアのみ払い出し対象
          </Text>
        </View>
      </View>
    </ScreenContainer>
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
    gap: 6,
  },
  title: {
    letterSpacing: 6,
  },
  betInfo: {
    fontSize: 12,
    color: "#FFD700",
    fontFamily: "monospace",
    letterSpacing: 1,
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
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1A2E1C",
    borderBottomWidth: 1,
    borderBottomColor: "#2E7D32",
  },
  colHeader: {
    fontSize: 10,
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 2,
    textTransform: "uppercase",
    width: 60,
    textAlign: "right",
  },
  colRight: {
    textAlign: "right",
  },
  list: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A2E1C",
  },
  rowAlt: {
    backgroundColor: "rgba(26, 46, 28, 0.4)",
  },
  topRow: {
    backgroundColor: "rgba(255, 215, 0, 0.08)",
    borderBottomColor: "#FFD700",
    borderBottomWidth: 1,
  },
  handName: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  handNameEn: {
    fontSize: 10,
    color: "#2E7D32",
    fontFamily: "monospace",
  },
  multiplier: {
    width: 60,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  payout: {
    width: 60,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  footer: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1A2E1C",
  },
  footerText: {
    fontSize: 10,
    color: "#2E7D32",
    fontFamily: "monospace",
    textAlign: "center",
  },
});
