export type ProductCategory = "men" | "women" | "unisex";

export type CaseSpecs = {
  dimensions?: string;
  material?: string;
  crown?: string;
  waterResistance?: string;
  glass?: string;
  caseback?: string;
  thickness?: string;
};

export type MovementSpecs = {
  type?: string;
  caliber?: string;
  functions?: string;
  components?: string;
  frequency?: string;
  powerReserve?: string;
  jewels?: string;
};

export type HandsSpecs = {
  hoursMinutes?: string;
  seconds?: string;
  finishing?: string;
};

export type ProductDetails = {
  case: CaseSpecs;
  movement: MovementSpecs;
  hands: HandsSpecs;
  care: string;
  giftWrapping: string;
  shippingReturns: string;
};
