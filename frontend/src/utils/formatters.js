/**
 * Formatters for Currency, Numbers, Percentages, and Timestamps
 */

export const formatCurrency = (value, currency = "USD") => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Number(value));
};

export const formatNumber = (value) => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "0";
  }
  return new Intl.NumberFormat("en-US").format(Number(value));
};

export const formatPercentage = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "0.00%";
  }
  const num = Number(value);
  // If already formatted as 0-1 ratio vs 0-100 percentage
  const displayVal = num <= 1 && num > 0 && decimals > 1 ? num * 100 : num;
  return `${displayVal.toFixed(decimals)}%`;
};

export const formatPercentRaw = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "0.00%";
  }
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};

export const formatTimeOnly = (timestamp) => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};

export const getRiskClassification = (probability) => {
  const prob = Number(probability) || 0;
  if (prob >= 70) {
    return {
      level: "HIGH",
      label: "HIGH RISK",
      color: "red",
      bgClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
      badgeClass: "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-300 dark:border-red-800",
      barColor: "bg-red-600 dark:bg-red-500",
    };
  }
  if (prob >= 40) {
    return {
      level: "MEDIUM",
      label: "MEDIUM RISK",
      color: "amber",
      bgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      barColor: "bg-amber-500 dark:bg-amber-400",
    };
  }
  return {
    level: "LOW",
    label: "LOW RISK",
    color: "emerald",
    bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    barColor: "bg-emerald-600 dark:bg-emerald-500",
  };
};
