// Klasör ağacı yardımcıları — B-26 (docs/BACKEND_GAPS.md §2.6). Ağaç, düz bir listeden
// (`id`, `parent_id`) derinlik sırasıyla (önce üst, sonra alt klasörler) kurulur.

interface FolderLike {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface TreeRow<T> {
  folder: T;
  depth: number;
}

/** Üst klasörün hemen altında alt klasörleri gelecek şekilde sıralar; kardeşler ada göre. */
export function orderTree<T extends FolderLike>(folders: T[]): TreeRow<T>[] {
  const ids = new Set(folders.map((f) => f.id));
  const byParent = new Map<string | null, T[]>();
  for (const f of folders) {
    // Görülemeyen bir üst klasörün altındakiler kök gibi gösterilir (paylaşılan alt klasör).
    const key = f.parent_id !== null && ids.has(f.parent_id) ? f.parent_id : null;
    byParent.set(key, [...(byParent.get(key) ?? []), f]);
  }
  const rows: TreeRow<T>[] = [];
  const walk = (parent: string | null, depth: number) => {
    const children = [...(byParent.get(parent) ?? [])].sort((a, b) => a.name.localeCompare(b.name, "tr"));
    for (const child of children) {
      rows.push({ folder: child, depth });
      walk(child.id, depth + 1);
    }
  };
  walk(null, 0);
  return rows;
}

/** Klasörün kendisi ve bütün alt klasörlerinin id'leri. */
export function subtreeIds<T extends FolderLike>(folders: T[], rootId: string): Set<string> {
  const result = new Set<string>([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const f of folders) {
      if (f.parent_id !== null && result.has(f.parent_id) && !result.has(f.id)) {
        result.add(f.id);
        grew = true;
      }
    }
  }
  return result;
}

/** Kökten klasöre kadar üst klasörlerin adları (klasörün kendisi hariç). */
export function ancestorNames<T extends FolderLike>(folders: T[], id: string): string[] {
  const byId = new Map(folders.map((f) => [f.id, f]));
  const names: string[] = [];
  let current = byId.get(id)?.parent_id ?? null;
  while (current !== null) {
    const parent = byId.get(current);
    if (!parent) break;
    names.unshift(parent.name);
    current = parent.parent_id;
  }
  return names;
}
