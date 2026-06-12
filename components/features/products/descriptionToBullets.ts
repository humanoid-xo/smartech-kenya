/**
 * Render a product `description` string as a CAPPED bullet list:
 *   - splits on sentences / line breaks / bullets
 *   - keeps up to `max` items
 *   - trims each item to `width` chars (no italics, plain sans-serif)
 *
 * Shared by ProductCard and ProductDetail so the wording stays consistent.
 */
export function descriptionToBullets(
  description: string | null | undefined,
  max: number = 3,
  width: number = 70,
): string[] {
  if (!description) return [];
  const cleaned = description
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return [];

  const raw = cleaned
    .split(/(?:[•·\-–—]\s+|\n+|\.(?:\s+|$)|;\s+)/g)
    .map(s => s.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const item of raw) {
    if (out.length >= max) break;
    const t = item.length > width ? item.slice(0, width - 1).trimEnd() + "…" : item;
    out.push(t);
  }
  return out;
}
