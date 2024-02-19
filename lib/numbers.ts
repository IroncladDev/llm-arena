/**
 * Converts an abbreviated number (e.g 5.2K, 2T, 1.2B) to a number.
 * If the input is a number, it returns the number.
 * @param {string | number} input - The input to parse.
 */
export const parseAbbrNumber = (
  input: string | number
): { success: true; value: number } | { success: false; message: string } => {
  if (typeof input === "number") {
    return { success: true, value: input }
  }

  if (!/^(?:\d+(?:\.\d)?\d*)([%KMBT])?$/.test(input))
    return { success: false, message: `Invalid input "${input}"` }

  const units = {
    "%": 0.01,
    K: 1000,
    M: 1000000,
    B: 1000000000,
    T: 1000000000000
  }

  const unit = input.match(/[KMBT%]$/)?.[0] as keyof typeof units | undefined
  const numberPart = Number(unit ? input.slice(0, -1) : input)

  if (isNaN(numberPart))
    return { success: false, message: `Invalid input "${input}"` }

  return { success: true, value: unit ? numberPart * units[unit] : numberPart }
}

/**
 * Converts a number to a rounded abbreviated format.
 * @param {number} input - The number to abbreviate.
 */
export const abbrNumber = (input: number): string => {
  if (input > 0 && input < 1) {
    const percentage = Math.round(input * 1000) / 10

    return `${percentage}%`
  }

  const units = [
    { threshold: 1000000000000, symbol: "T" },
    { threshold: 1000000000, symbol: "B" },
    { threshold: 1000000, symbol: "M" },
    { threshold: 1000, symbol: "K" }
  ]

  const unit = units.find(u => input >= u.threshold)

  if (unit) {
    let value = input / unit.threshold
    value = Math.round(value * 10) / 10

    return `${value}${unit.symbol}`
  }

  return input.toString()
}
