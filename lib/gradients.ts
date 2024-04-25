/**
 * Creates a stack of gradient stops.
 * @param {Array<[string, number | string]>} ...stops The color stops.
 * @returns {Array<string>} - The stack of gradient stops.
 */
function stack(...stops: Array<[string, number | string]>): Array<string> {
  return stops
    .reduce(
      (acc, [color, stop]) => {
        const last = acc.at(-1)

        if (last) {
          acc.push([color, last[1]])
          acc.push([color, stop])
        } else {
          acc.push([color, 0])
          acc.push([color, stop])
        }

        return acc
      },
      [] as Array<[string, number | string]>,
    )
    .map(
      ([color, stop]) =>
        `${color} ${stop + (typeof stop === "number" ? "px" : "")}`,
    )
}

/**
 * Creates a linear gradient.
 * @param {string} [angle] The angle of the gradient.
 * @param {string[]} ...stops The color stops.
 * @returns {string} - The linear gradient.
 */
function linear(angle: number, ...stops: Array<string>): string
function linear(...stops: Array<string>): string
function linear(stopOrAngle: number | string, ...stops: Array<string>): string {
  if (typeof stopOrAngle === "number") {
    return `linear-gradient(${stopOrAngle}deg, ${stops.join(", ")})`
  }

  return `linear-gradient(${stops.join(",")})`
}

/**
 * Creates a radial gradient.
 * @param {string[]} ...stops The color stops.
 * @returns {string} - The radial gradient.
 */
function radial(...stops: Array<string>): string {
  return `radial-gradient(${stops.join(",")})`
}

/**
 * Creates a repeating radial gradient.
 * @param [stopOrAngle] The position of the gradient.
 * @param {string[]} ...stops The color stops.
 * @returns {string} - The radial gradient.
 */
function rLinear(angle: number, ...stops: Array<string>): string
function rLinear(...stops: Array<string>): string
function rLinear(
  stopOrAngle: number | string,
  ...stops: Array<string>
): string {
  if (typeof stopOrAngle === "number") {
    return `repeating-linear-gradient(${stopOrAngle}deg, ${stops.join(", ")})`
  }

  return `repeating-linear-gradient(${[stopOrAngle, ...stops].join(",")})`
}

/**
 * Creates a repeating radial gradient.
 * @param {string} [position] The position of the gradient.
 * @param {string[]} ...stops The color stops.
 * @returns {string} - The radial gradient.
 */
function rRadial(position: string, ...stops: Array<string>): string
function rRadial(...stops: Array<string>): string
function rRadial(positionOrStop: string, ...stops: Array<string>): string {
  if (typeof positionOrStop === "string") {
    return `repeating-radial-gradient(${positionOrStop}, ${stops.join(", ")})`
  }

  return `repeating-radial-gradient(${stops.join(",")})`
}

/**
 * Merges multiple gradients into one.
 * @param gradients The gradients to merge.
 * @returns {string} - The merged gradient.
 */
function merge(...gradients: Array<string>): string {
  return gradients.join(",")
}

const gr = {
  stack,
  linear,
  merge,
  radial,
  rLinear,
  rRadial,
}

export default gr
