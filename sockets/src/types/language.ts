export type GameLanguage = "cs" | "en";

export const DEFAULT_LANGUAGE: GameLanguage = "cs";

/** Returns a valid game language, or null when the client sent something unknown. */
export function parseLanguage(value: unknown): GameLanguage | null {
  if (value === undefined || value === null) return DEFAULT_LANGUAGE;
  return value === "cs" || value === "en" ? value : null;
}
