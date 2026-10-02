import type { DocumentListItem, ReviewStatus } from "../api/types";

/** B-28: narrow a document list to one publication state (null = all). */
export function applyReviewFilter<T extends DocumentListItem>(documents: T[], value: ReviewStatus | null): T[] {
  return value === null ? documents : documents.filter((d) => d.review_status === value);
}
