/** Pick the right Bandit variant based on weather + time of day */

import type { WeatherCondition } from "./weather";

export type BanditState =
  // Time of day
  | "dawn-coffee"
  | "morning-garden"
  | "bread-morning"
  | "midday-market"
  | "afternoon-nap"
  | "evening-cooking"
  | "night-prowl"
  // Weather
  | "rain-boots"
  | "rain-heavy"
  | "sunny-bright"
  | "cloudy-cozy"
  | "windy-chaos"
  | "snow-cozy"
  | "fog-mysterious"
  | "storm-dramatic"
  // Special
  | "ferry-waiting"
  // Fallback seasonal
  | "spring"
  | "summer"
  | "fall"
  | "winter";

/** Pick the best Bandit based on weather + hour (0-23, Pacific time) */
export function getBanditVariant(
  weather: WeatherCondition,
  hour: number
): BanditState {
  // 1. Extreme weather always wins
  if (weather === "storm") return "storm-dramatic";
  if (weather === "snow") return "snow-cozy";
  if (weather === "rain-heavy") return "rain-heavy";
  if (weather === "fog") return "fog-mysterious";
  if (weather === "wind") return "windy-chaos";

  // 2. Light rain + time combo
  if (weather === "rain") {
    if (hour >= 5 && hour < 10) return "rain-boots"; // morning rain
    if (hour >= 17) return "rain-boots"; // evening rain walk
    return "rain-boots";
  }

  // 3. Time-of-day variants
  if (hour >= 5 && hour < 7) return "dawn-coffee";
  if (hour >= 7 && hour < 10) {
    return weather === "sunny" ? "bread-morning" : "morning-garden";
  }
  if (hour >= 10 && hour < 14) {
    return weather === "sunny" ? "sunny-bright" : "midday-market";
  }
  if (hour >= 14 && hour < 17) return "afternoon-nap";
  if (hour >= 17 && hour < 20) return "evening-cooking";
  if (hour >= 20 || hour < 5) return "night-prowl";

  // 4. Cloudy fallback
  if (weather === "cloudy") return "cloudy-cozy";

  return "sunny-bright";
}

/** One-liner greeting for each Bandit state */
export function getBanditGreeting(variant: string): string {
  const greetings: Record<string, string> = {
    "dawn-coffee": "Even trash pandas need coffee before they can forage.",
    "morning-garden": "Best stuff goes fast. Bandit's already in the dirt.",
    "bread-morning": "Fresh bread run. The neighbourhood smells incredible.",
    "midday-market": "Peak hours. What are you looking for?",
    "afternoon-nap": "Garden's quiet. Good time to plan dinner.",
    "evening-cooking": "Bandit's making something. You should too.",
    "night-prowl": "The night shift. Best produce gets snagged after dark.",
    "rain-boots": "Rain means the garden's happy. And Bandit has boots.",
    "rain-heavy": "Staying dry. The kale doesn't mind though.",
    "sunny-bright": "Solar-powered trash panda. Everything's growing.",
    "cloudy-cozy": "Sweater weather. Root vegetable weather.",
    "windy-chaos": "Hold onto your lettuce.",
    "snow-cozy": "Preserved goods season. Bandit planned ahead.",
    "fog-mysterious": "Can't see the garden but Bandit knows the way.",
    "storm-dramatic": "Bandit guards the harvest. Even in this.",
    "ferry-waiting": "Waiting for the ferry. At least the food's local.",
    spring: "Dirt under your nails season.",
    summer: "Everything's ripe. Go get it.",
    fall: "Preserve everything. Winter's coming.",
    winter: "Root cellar vibes. Soup weather.",
  };
  return greetings[variant] ?? "Bandit's around here somewhere.";
}
