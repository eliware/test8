const metrics = ["statements", "branches", "functions", "lines"];

export function evaluateCoverage(summary) {
  const gaps = metrics.filter((metric) => summary?.[metric] !== 100);
  return { status: gaps.length === 0 ? "pass" : "fail", gaps };
}
