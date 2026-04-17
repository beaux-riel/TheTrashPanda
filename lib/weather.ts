/** Powell River weather via wttr.in — free, no API key */

export type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "rain"
  | "rain-heavy"
  | "snow"
  | "fog"
  | "wind"
  | "storm";

export interface WeatherData {
  condition: WeatherCondition;
  temp: number;
  description: string;
}

// Simple in-memory cache (30 min TTL)
let cached: { data: WeatherData; expires: number } | null = null;

/** Map wttr.in weather codes → our conditions */
function mapCondition(code: number, windKmh: number): WeatherCondition {
  // https://github.com/chubin/wttr.in/blob/master/lib/constants.py
  if ([200, 201, 202, 230, 231, 232, 233].includes(code)) return "storm";
  if ([395, 392, 371, 368, 338, 335, 332, 329, 326, 323, 320, 317, 179].includes(code)) return "snow";
  if ([314, 311, 308, 305, 302, 299, 296, 359, 356].includes(code)) return "rain-heavy";
  if ([353, 266, 263, 293, 176, 185, 281, 284].includes(code)) return "rain";
  if ([248, 260].includes(code)) return "fog";
  if ([116, 119, 122].includes(code)) return windKmh > 40 ? "wind" : "cloudy";
  if ([113].includes(code)) return windKmh > 50 ? "wind" : "sunny";
  // Default: if wind is high, wind; otherwise cloudy
  return windKmh > 40 ? "wind" : "cloudy";
}

export async function getCurrentWeather(): Promise<WeatherData> {
  const now = Date.now();
  if (cached && now < cached.expires) return cached.data;

  try {
    const res = await fetch(
      "https://wttr.in/Powell+River,BC?format=j1",
      { next: { revalidate: 1800 } } // 30 min ISR cache
    );

    if (!res.ok) throw new Error(`wttr.in ${res.status}`);

    const json = await res.json();
    const current = json.current_condition?.[0];

    if (!current) throw new Error("No current condition");

    const code = parseInt(current.weatherCode, 10);
    const windKmh = parseInt(current.windspeedKmph, 10);
    const temp = parseInt(current.temp_C, 10);
    const description = current.weatherDesc?.[0]?.value ?? "Unknown";

    const data: WeatherData = {
      condition: mapCondition(code, windKmh),
      temp,
      description,
    };

    cached = { data, expires: now + 30 * 60 * 1000 };
    return data;
  } catch (err) {
    console.warn("[weather] Failed to fetch:", err);
    // Graceful fallback: assume cloudy Powell River day
    return { condition: "cloudy", temp: 12, description: "Typical coast day" };
  }
}
