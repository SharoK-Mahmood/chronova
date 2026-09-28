import { ScrollView, StyleSheet } from "react-native";

import { CollectionsSection } from "@/src/components/home/CollectionsSection";
import { FeaturedSection } from "@/src/components/home/FeaturedSection";
import { HeritageSection } from "@/src/components/home/HeritageSection";
import { HeroSection } from "@/src/components/home/HeroSection";
import { HomeCtaSection } from "@/src/components/home/HomeCtaSection";
import { SpotlightSection } from "@/src/components/home/SpotlightSection";
import { colors } from "@/src/theme/colors";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HeroSection />
      <HeritageSection />
      <SpotlightSection />
      <CollectionsSection />
      <FeaturedSection />
      <HomeCtaSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 8,
  },
});
