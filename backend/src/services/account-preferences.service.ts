import { z } from "zod";

import { badRequest } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";

const languageSchema = z.enum(["en", "ar", "ku"]);
const currencySchema = z.enum(["USD", "IQD"]);

const addressSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  countryCode: z.enum(["iraq", "kurdistan-region"]),
  governorate: z.string(),
  city: z.string(),
  district: z.string(),
  street: z.string(),
  details: z.string(),
  postalCode: z.string(),
});

const updatePreferencesSchema = z.object({
  language: languageSchema.optional(),
  currency: currencySchema.optional(),
  notifications: z
    .object({
      emailOrders: z.boolean(),
      emailPromotions: z.boolean(),
      pushNotifications: z.boolean(),
    })
    .optional(),
  billingSameAsShipping: z.boolean().optional(),
  shippingAddress: addressSchema.nullable().optional(),
  billingAddress: addressSchema.nullable().optional(),
});

export type AccountPreferences = {
  language: "en" | "ar" | "ku";
  currency: "USD" | "IQD";
  notifications: {
    emailOrders: boolean;
    emailPromotions: boolean;
    pushNotifications: boolean;
  };
  billingSameAsShipping: boolean;
  shippingAddress: z.infer<typeof addressSchema> | null;
  billingAddress: z.infer<typeof addressSchema> | null;
};

function parseAddressJson(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const result = addressSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function toPreferences(user: {
  language: string;
  currency: string;
  emailOrders: boolean;
  emailPromotions: boolean;
  pushNotifications: boolean;
  billingSameAsShipping: boolean;
  shippingAddressJson: string | null;
  billingAddressJson: string | null;
}): AccountPreferences {
  const language = languageSchema.safeParse(user.language);
  const currency = currencySchema.safeParse(user.currency);

  return {
    language: language.success ? language.data : "en",
    currency: currency.success ? currency.data : "USD",
    notifications: {
      emailOrders: user.emailOrders,
      emailPromotions: user.emailPromotions,
      pushNotifications: user.pushNotifications,
    },
    billingSameAsShipping: user.billingSameAsShipping,
    shippingAddress: parseAddressJson(user.shippingAddressJson),
    billingAddress: parseAddressJson(user.billingAddressJson),
  };
}

export async function getAccountPreferences(
  userId: string,
): Promise<AccountPreferences> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw badRequest("User not found");
  }

  return toPreferences(user);
}

export async function updateAccountPreferences(
  userId: string,
  input: unknown,
): Promise<AccountPreferences> {
  const data = updatePreferencesSchema.parse(input);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.language !== undefined ? { language: data.language } : {}),
      ...(data.currency !== undefined ? { currency: data.currency } : {}),
      ...(data.notifications
        ? {
            emailOrders: data.notifications.emailOrders,
            emailPromotions: data.notifications.emailPromotions,
            pushNotifications: data.notifications.pushNotifications,
          }
        : {}),
      ...(data.billingSameAsShipping !== undefined
        ? { billingSameAsShipping: data.billingSameAsShipping }
        : {}),
      ...(data.shippingAddress !== undefined
        ? {
            shippingAddressJson: data.shippingAddress
              ? JSON.stringify(data.shippingAddress)
              : null,
          }
        : {}),
      ...(data.billingAddress !== undefined
        ? {
            billingAddressJson: data.billingAddress
              ? JSON.stringify(data.billingAddress)
              : null,
          }
        : {}),
    },
  });

  return toPreferences(user);
}
