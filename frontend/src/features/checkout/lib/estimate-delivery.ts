type DeliveryWindow = {
  minDays: number;
  maxDays: number;
};

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }

  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function estimateDelivery(
  method: DeliveryWindow,
  fromDate = new Date(),
) {
  const from = addBusinessDays(fromDate, method.minDays);
  const to = addBusinessDays(fromDate, method.maxDays);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    label:
      method.minDays === method.maxDays
        ? formatDate(from)
        : `${formatDate(from)} – ${formatDate(to)}`,
  };
}
