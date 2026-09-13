const metrics = ["statements", "branches", "functions", "lines"];

function percentage(covered, total) {
  return total > 0 ? (covered / total) * 100 : 100;
}

function location(entry) {
  return entry?.start?.line
    ? `${entry.start.line}${entry.start.column ? `:${entry.start.column}` : ""}`
    : "unknown";
}

function fileGap(file, data) {
  const statements = Object.entries(data.s ?? {})
    .filter(([, count]) => count === 0)
    .map(([id]) => ({ location: location(data.statementMap?.[id]) }));
  const branches = Object.entries(data.b ?? {}).flatMap(([id, counts]) =>
    counts
      .map((count, index) =>
        count === 0 ? { location: location(data.branchMap?.[id]?.locations?.[index] ?? data.branchMap?.[id]) } : null,
      )
      .filter(Boolean),
  );
  const functions = Object.entries(data.f ?? {})
    .filter(([, count]) => count === 0)
    .map(([id]) => ({ name: data.fnMap?.[id]?.name ?? "anonymous", location: location(data.fnMap?.[id]) }));
  const lineEntries = Object.entries(data.l ?? {});
  const lines = (lineEntries.length > 0
    ? lineEntries.filter(([, count]) => count === 0).map(([line]) => line)
    : statements.map(({ location: line }) => line.split(":")[0])
  ).filter((line) => line !== "unknown");
  const lineCovered = lineEntries.length > 0
    ? lineEntries.filter(([, count]) => count > 0).length
    : Object.keys(data.s ?? {}).length - statements.length;
  const lineTotal = lineEntries.length > 0 ? lineEntries.length : Object.keys(data.s ?? {}).length;
  const values = {
    statements: percentage(Object.values(data.s ?? {}).filter((count) => count > 0).length, Object.keys(data.s ?? {}).length),
    branches: percentage(Object.values(data.b ?? {}).flat().filter((count) => count > 0).length, Object.values(data.b ?? {}).flat().length),
    functions: percentage(Object.values(data.f ?? {}).filter((count) => count > 0).length, Object.keys(data.f ?? {}).length),
    lines: percentage(lineCovered, lineTotal),
  };
  if (Object.keys(data.statementMap ?? {}).length === 0 && Object.keys(data.s ?? {}).length === 0) return null;
  return metrics.every((metric) => values[metric] === 100)
    ? null
    : { file, metrics: values, lines, statements, branches, functions };
}

export function parseDetailed(json) {
  const counts = Object.fromEntries(metrics.map((metric) => [metric, { covered: 0, total: 0 }]));
  const gaps = [];
  for (const [file, data] of Object.entries(json ?? {})) {
    const gap = fileGap(file, data);
    if (gap) gaps.push(gap);
    for (const [metric, values] of Object.entries({
      statements: Object.values(data.s ?? {}),
      branches: Object.values(data.b ?? {}).flat(),
      functions: Object.values(data.f ?? {}),
      lines: Object.values(data.l ?? (data.s ?? {})),
    })) {
      counts[metric].total += values.length;
      counts[metric].covered += values.filter((count) => count > 0).length;
    }
  }
  return {
    gaps,
    totals: Object.fromEntries(metrics.map((metric) => [metric, percentage(counts[metric].covered, counts[metric].total)])),
  };
}

export function parseSummary(json) {
  const total = json?.total;
  if (!total || metrics.some((metric) => typeof total[metric]?.pct !== "number")) return null;
  return { gaps: [], totals: Object.fromEntries(metrics.map((metric) => [metric, total[metric].pct])) };
}

export function parseText(text) {
  const row = text.split(/\r?\n/).find((line) => /^\s*All files\s*\|/i.test(line));
  if (!row) return null;
  const values = row.split("|").slice(1, 5).map((value) => Number.parseFloat(value));
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) return null;
  return { gaps: [], totals: Object.fromEntries(metrics.map((metric, index) => [metric, values[index]])) };
}
