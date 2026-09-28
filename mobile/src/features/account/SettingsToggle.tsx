import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/theme/colors";

type SettingsToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: SettingsToggleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        onPress={() => onChange(!checked)}
        style={[styles.track, checked && styles.trackOn]}
      >
        <View style={[styles.thumb, checked && styles.thumbOn]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    backgroundColor: colors.border,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: colors.accent,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
  },
  thumbOn: {
    alignSelf: "flex-end",
  },
});
