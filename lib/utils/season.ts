export type Season = "spring" | "summer" | "fall" | "winter";

export function getSeasonFromDate(date = new Date()): Season {
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return "spring";
  }

  if (month >= 6 && month <= 8) {
    return "summer";
  }

  if (month >= 9 && month <= 11) {
    return "fall";
  }

  return "winter";
}

export const seasonLabels: Record<Season, string> = {
  spring: "Spring dirt under your nails season",
  summer: "Summer garden chaos season",
  fall: "Fall preserve-everything season",
  winter: "Winter soup and root cellar season"
};
