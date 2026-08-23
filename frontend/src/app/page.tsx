import {
  CollectionsSection,
  FeaturedProducts,
  HeritageSection,
  HeroSection,
  HomeCta,
  HomeSpotlight,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HeritageSection />
      <HomeSpotlight />
      <CollectionsSection />
      <FeaturedProducts />
      <HomeCta />
    </>
  );
}
