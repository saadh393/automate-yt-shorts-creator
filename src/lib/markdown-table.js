// Simple markdown table parser: returns { headers: string[], rows: string[][] } or null
export function parseMarkdownTable(md) {
  if (!md) return null;
  const lines = md.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return null;
  // Find the first line with | and at least 2 |
  let headerIdx = lines.findIndex((l) => l.includes("|") && l.split("|").length > 2);
  if (headerIdx === -1 || headerIdx + 1 >= lines.length) return null;
  const headerLine = lines[headerIdx];
  const dividerLine = lines[headerIdx + 1];
  // Divider must be like |---|---| or ---|---
  if (!/^\s*\|?\s*:?[-| ]+:?\s*\|?\s*$/.test(dividerLine)) return null;
  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);
  const rows = [];
  for (let i = headerIdx + 2; i < lines.length; ++i) {
    const row = lines[i]
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (row.length === headers.length) rows.push(row);
  }
  if (!headers.length || !rows.length) return null;
  return { headers, rows };
}
