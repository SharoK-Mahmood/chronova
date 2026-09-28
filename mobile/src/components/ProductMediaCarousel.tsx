import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { getProductImageUrls } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import type { Product } from "@/src/types/product";

const AUTOPLAY_MS = 4200;

type ProductMediaCarouselProps = {
  product: Pick<Product, "imageUrl" | "imageUrls">;
  style?: StyleProp<ViewStyle>;
  autoplay?: boolean;
  showControls?: boolean;
  /** Pause rotation while the user is touching the gallery (PDP). Off on cards. */
  pauseOnTouch?: boolean;
};

export function ProductMediaCarousel({
  product,
  style,
  autoplay = true,
  showControls = true,
  pauseOnTouch = true,
}: ProductMediaCarouselProps) {
  const urls = getProductImageUrls(product);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = urls.length;
  const activeIndex = count === 0 ? 0 : index % count;
  const urlsKey = urls.join("|");

  useEffect(() => {
    setIndex(0);
  }, [urlsKey]);

  useEffect(() => {
    if (!autoplay || paused || count < 2) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [autoplay, paused, count, urlsKey]);

  function goTo(next: number) {
    if (count < 2) {
      return;
    }
    setIndex(((next % count) + count) % count);
  }

  return (
    <View
      style={[styles.wrap, style]}
      onTouchStart={pauseOnTouch ? () => setPaused(true) : undefined}
      onTouchEnd={pauseOnTouch ? () => setPaused(false) : undefined}
      onTouchCancel={pauseOnTouch ? () => setPaused(false) : undefined}
    >
      {count === 0 ? (
        <View style={styles.placeholder}>
          <View style={styles.placeholderDot} />
        </View>
      ) : (
        urls.map((uri, imageIndex) => (
          <Image
            key={`${uri}-${imageIndex}`}
            source={{ uri }}
            style={[
              styles.image,
              { opacity: imageIndex === activeIndex ? 1 : 0 },
            ]}
            contentFit="contain"
            transition={400}
          />
        ))
      )}

      {showControls && count > 1 ? (
        <>
          <Pressable
            accessibilityLabel="Previous image"
            hitSlop={8}
            onPress={() => goTo(activeIndex - 1)}
            style={[styles.chevron, styles.chevronPrev]}
          >
            <Text style={styles.chevronLabel}>‹</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Next image"
            hitSlop={8}
            onPress={() => goTo(activeIndex + 1)}
            style={[styles.chevron, styles.chevronNext]}
          >
            <Text style={styles.chevronLabel}>›</Text>
          </Pressable>
          <View style={styles.dots}>
            {urls.map((uri, imageIndex) => (
              <View
                key={`${uri}-dot-${imageIndex}`}
                style={[
                  styles.dot,
                  imageIndex === activeIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#F0EEE9",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderDot: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chevron: {
    position: "absolute",
    top: "50%",
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  chevronPrev: {
    left: 8,
  },
  chevronNext: {
    right: 8,
  },
  chevronLabel: {
    fontSize: 22,
    color: colors.text,
    lineHeight: 24,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(17,17,17,0.2)",
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 14,
  },
});
