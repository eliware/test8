const metrics = ["statements", "branches", "functions", "lines"];

function parseTextSummary(raw) {
  const row = raw.split(/\r?\n/).find((line) => /^\s*All files\s*\|/i.test(line));
  if (!row) return null;
  const values = row
    .split("|")
    .slice(1, 5)
    .map((value) => Number.parseFloat(value));
  if (values.length !== metrics.length || values.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return Object.fromEntries(metrics.map((metric, index) => [metric, values[index]]));
}

export async function readCoverageSummary({ readFile, stat, reportPath, startedAt = 0 }) {
  let before;
  if (startedAt && stat && reportPath) {
    before = await stat(reportPath);
    if (!Number.isFinite(before?.mtimeMs) || before.mtimeMs <= startedAt) {
      throw new Error("Coverage summary is stale.");
    }
  }
  if (startedAt && stat && reportPath) {
    const after = await stat(reportPath);
    if (!Number.isFinite(after?.mtimeMs) || after.mtimeMs !== before.mtimeMs) {
      throw new Error("Coverage summary changed while being read.");
    }
  }
  const raw = await readFile();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const textSummary = parseTextSummary(raw);
    if (textSummary) return textSummary;
    throw new Error("Invalid coverage summary.");
  }
  const total = parsed?.total;
  if (!total || metrics.some((metric) => typeof total[metric]?.pct !== "number")) {
    throw new Error("Invalid coverage summary.");
  }
  return Object.fromEntries(metrics.map((metric) => [metric, total[metric].pct]));
}
