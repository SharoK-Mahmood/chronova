/** Formats digits into groups of 4 for card display. */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Formats MMYY or MM/YY into MM / YY. */
export function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function formatCvv(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function isCardDetailsComplete(details: {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}): boolean {
  const digits = details.cardNumber.replace(/\D/g, "");
  const expiryDigits = details.expiry.replace(/\D/g, "");
  return (
    details.nameOnCard.trim().length > 1 &&
    digits.length >= 13 &&
    expiryDigits.length === 4 &&
    details.cvv.replace(/\D/g, "").length >= 3
  );
}
