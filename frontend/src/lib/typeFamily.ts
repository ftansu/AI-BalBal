import type { GuideFamily } from "../api/types";

export const OTHER_FAMILY = "other";
export const MAX_EXTRA_FIELDS = 20;

/** Case-insensitive key with the Turkish dotted-İ fix — mirrors backend `type_family.fold`. */
export function fold(text: string): string {
  return text.toLocaleLowerCase("tr").replace("i\u0307", "i");
}

/** Longest matching pattern wins ("Licence Amendment" → amendment); none → other. Same rule
 * as the backend (`type_family.match_family`), so the screen and the classifier agree. */
export function matchFamily(documentType: string | null | undefined, guides: GuideFamily[]): string {
  if (!documentType) return OTHER_FAMILY;
  const haystack = fold(documentType);
  let best: { length: number; family: string } | null = null;
  for (const guide of guides) {
    if (!guide.is_active) continue;
    for (const pattern of guide.type_patterns) {
      const needle = fold(pattern);
      if (needle && haystack.includes(needle) && (best === null || needle.length > best.length)) {
        best = { length: needle.length, family: guide.family };
      }
    }
  }
  return best?.family ?? OTHER_FAMILY;
}

export function guideFor(documentType: string | null | undefined, guides: GuideFamily[]): GuideFamily | null {
  const family = matchFamily(documentType, guides);
  return guides.find((g) => g.family === family) ?? null;
}

/** Preview of how the server will normalise an extra-field key (snake_case, ascii). */
export function normalizeExtraKey(raw: string): string {
  let key = raw.trim().toLocaleLowerCase("tr");
  key = key
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]+/g, "")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
  return key.slice(0, 48);
}
