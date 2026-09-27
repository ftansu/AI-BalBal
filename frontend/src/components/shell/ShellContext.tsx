import { createContext, useContext } from "react";

/** Lets any screen open the two shared windows (Balbal, ekip sohbeti) — e.g. the search
 * panel's "Balbal'a sor" or a Home agenda item. Provided by `Layout`. */
export interface ShellValue {
  openBalbal: (question?: string) => void;
  openTeam: () => void;
}

export const ShellContext = createContext<ShellValue>({
  openBalbal: () => undefined,
  openTeam: () => undefined,
});

export const useShell = () => useContext(ShellContext);

/** The user's own upload screen, or null when they belong to no single department. */
export function uploadPathFor(departmentSlugs: string[]): string | null {
  return departmentSlugs.length > 0 ? `/departman/${departmentSlugs[0]}/yukle` : null;
}
