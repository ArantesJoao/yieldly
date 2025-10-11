export const PRESETS = [
  { label: "Last 7 days", key: "last7Days", days: 7 },
  { label: "Last 15 days", key: "last15Days", days: 15 },
  { label: "Last 30 days", key: "last30Days", days: 30 },
  { label: "Last 90 days", key: "last90Days", days: 90 },
  { label: "Last 6 months", key: "last6Months", days: 180 },
  { label: "Last year", key: "lastYear", days: 365 },
] as const

