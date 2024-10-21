export function adjustHSLColor(
  color: string,
  deltaHue: number,
  deltaSaturation: number,
  deltaLightness: number
): string {
  // Parse the color string into its components
  const regex = /hsl\((\d.+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
  const match = color.match(regex);

  if (!match) {
    return color;
  }

  // Extract HSL components
  let hue = parseInt(match[1]);
  let saturation = parseFloat(match[2]);
  let lightness = parseFloat(match[3]);

  // Adjust the components
  hue = (hue + deltaHue) % 360;
  saturation = Math.min(100, Math.max(0, saturation + deltaSaturation));
  lightness = Math.min(100, Math.max(0, lightness + deltaLightness));

  // Construct the new HSL color string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
