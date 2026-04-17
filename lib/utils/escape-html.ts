const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

/**
 * Escape a string for safe interpolation into HTML. Handles the five entities
 * that matter inside element text and double-quoted attribute values.
 * Use this anywhere user-controlled data is being concatenated into a raw
 * HTML string (e.g. mapbox popup `.setHTML()`).
 */
export function escapeHtml(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  return str.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}
