/**
 * Joins class names and skips falsy ones.
 *
 * Use this instead of `cn` in client components. `cn` also merges conflicting Tailwind classes, which needs
 * tailwind-merge (about 10 KB gzipped); one client component importing it ships that to every page. A component that
 * only adds classes (never overrides one with another from the same group) does not need the merge step.
 */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
