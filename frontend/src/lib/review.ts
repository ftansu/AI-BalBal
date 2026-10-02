import type { DocumentListItem, MetadataSuggestion, ReviewStatus, SuggestionField } from "../api/types";

export const EXTRA_PREFIX = "extra_fields.";

/** `fields.extra_fields` of a suggestion, typed (the backend nests it under one key). */
export function extraFieldSuggestions(
  suggestion: MetadataSuggestion | null | undefined,
): Record<string, SuggestionField> {
  const raw = (suggestion?.fields as Record<string, unknown> | undefined)?.extra_fields;
  return raw && typeof raw === "object" ? (raw as Record<string, SuggestionField>) : {};
}

/** B-28: narrow a document list to one publication state (null = all). */
export function applyReviewFilter<T extends DocumentListItem>(documents: T[], value: ReviewStatus | null): T[] {
  return value === null ? documents : documents.filter((d) => d.review_status === value);
}
