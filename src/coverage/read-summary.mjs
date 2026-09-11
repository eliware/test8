export async function readCoverageSummary({ readFile }) {
  const raw = await readFile();
  const parsed = JSON.parse(raw);
  const total = parsed?.total;
  const metrics = ["statements", "branches", "functions", "lines"];
  if (!total || metrics.some((metric) => typeof total[metric]?.pct !== "number")) {
    throw new Error("Invalid coverage summary.");
  }
  return Object.fromEntries(metrics.map((metric) => [metric, total[metric].pct]));
}
