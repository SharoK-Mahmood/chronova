import { StyleSheet, Text, TextInput, View } from "react-native";

import type { SavedAddress } from "@/src/features/account/types";
import { colors } from "@/src/theme/colors";

type AddressFieldsProps = {
  value: SavedAddress;
  onChange: (next: SavedAddress) => void;
};

const FIELDS: Array<{ key: keyof SavedAddress; label: string; placeholder: string; keyboard?: "phone-pad" | "default" }> = [
  { key: "fullName", label: "Full name", placeholder: "Full name" },
  { key: "phone", label: "Phone", placeholder: "Phone number", keyboard: "phone-pad" },
  { key: "city", label: "City", placeholder: "City" },
  { key: "street", label: "Street", placeholder: "Street address" },
  { key: "details", label: "Details", placeholder: "Apartment, floor, landmark" },
];

export function AddressFields({ value, onChange }: AddressFieldsProps) {
  return (
    <View style={styles.wrap}>
      {FIELDS.map((field) => (
        <View key={field.key} style={styles.field}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            value={value[field.key]}
            onChangeText={(text) => onChange({ ...value, [field.key]: text })}
            placeholder={field.placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={field.keyboard ?? "default"}
            style={styles.input}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
});
