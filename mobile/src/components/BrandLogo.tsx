import { Image } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type BrandLogoProps = {
  /** Render height in dp. Width follows the 440×110 wordmark aspect ratio. */
  height?: number;
  /**
   * `light` = navy wordmark for light backgrounds (website light mode).
   * `dark` = cream wordmark for dark backgrounds (website dark mode).
   */
  variant?: "light" | "dark";
  style?: StyleProp<ViewStyle>;
};

const ASPECT = 440 / 110;

const SOURCES = {
  light: require("../../assets/images/chronova-logo-light.png"),
  dark: require("../../assets/images/chronova-logo-dark.png"),
} as const;

export function BrandLogo({
  height = 28,
  variant = "light",
  style,
}: BrandLogoProps) {
  const width = height * ASPECT;

  return (
    <View style={[styles.wrap, { width, height }, style]}>
      <Image
        source={SOURCES[variant]}
        style={{ width, height }}
        contentFit="contain"
        accessibilityLabel="Chronova"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
