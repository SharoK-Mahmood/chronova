export type StoredCartEntry = {
  slug: string;
  quantity: number;
  unitPriceUsd?: number;
};

export type CartLineItem = {
  slug: string;
  quantity: number;
  unitPriceUsd: number;
};
