const numberFormatters = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  options?: Intl.NumberFormatOptions,
) {
  const key = JSON.stringify({ minimumFractionDigits, maximumFractionDigits, ...options });

  const existing = numberFormatters.get(key);

  if (existing) {
    return existing;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
    ...options,
  });

  numberFormatters.set(key, formatter);

  return formatter;
}

export function formatPrice(value: number, fractionDigits = 2) {
  return getNumberFormatter(fractionDigits, fractionDigits).format(value);
}

export function formatSize(value: number, fractionDigits = 2) {
  return getNumberFormatter(0, fractionDigits).format(value);
}

export function formatPercent(value: number, fractionDigits = 2) {
  const formatted = getNumberFormatter(fractionDigits, fractionDigits).format(Math.abs(value));
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${prefix}${formatted}%`;
}

export function formatCurrency(value: number, fractionDigits = 2) {
  return getNumberFormatter(fractionDigits, fractionDigits, {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatPnl(value: number, fractionDigits = 2) {
  const absolute = formatCurrency(Math.abs(value), fractionDigits);
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${prefix}${absolute}`;
}
