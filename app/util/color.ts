// convert 6-digit hex to float [0, 1] rbg
export const hexToFloat = (hex: string) => {
  const int = parseInt(hex.replace("#", ""), 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return [r / 255, g / 255, b / 255] as const;
};
