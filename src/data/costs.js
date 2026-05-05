export const costLines = [
  { id: "receiving",   label: "Receiving rework (manual verification)",  base: 18600 },
  { id: "labor",       label: "Manual order entry labor",                base: 47200 },
  { id: "chargebacks", label: "Chargebacks & compliance disputes",       base: 12400 },
  { id: "forecast",    label: "Forecast errors (bad supplier data)",     base: 34000 },
  { id: "ap",          label: "AP & invoice reconciliation labor",       base: 23800 },
  { id: "dock",        label: "Dock gridlock (no inbound visibility)",   base: 8000  },
  { id: "onboarding",  label: "Supplier onboarding delays",              base: 9000  },
  { id: "exceptions",  label: "Data quality exception handling",         base: 13000 },
  { id: "recall",      label: "Recall scope risk (broad vs. targeted)",  base: 55000 },
  { id: "inventory",   label: "Inventory carrying cost (overstock)",     base: 15000 },
]

export function getMultiplier(supplierCount) {
  return supplierCount / 100
}

export function computeCost(base, supplierCount) {
  return Math.round(base * getMultiplier(supplierCount))
}

export function computeTotal(supplierCount) {
  return costLines.reduce((sum, line) => sum + computeCost(line.base, supplierCount), 0)
}
