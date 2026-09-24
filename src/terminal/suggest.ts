/** Levenshtein distance between two strings */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost,
      );
    }
  }

  return dp[m]![n]!;
}

const MAX_DISTANCE = 2;

/** Return closest matches within Levenshtein distance ≤ maxDist */
export function suggest(
  input: string,
  candidates: string[],
  maxDist: number = MAX_DISTANCE,
): string[] {
  const lower = input.toLowerCase();
  return candidates
    .map((c) => ({ c, d: levenshtein(lower, c.toLowerCase()) }))
    .filter(({ d }) => d <= maxDist && d > 0)
    .sort((a, b) => a.d - b.d || a.c.localeCompare(b.c))
    .map(({ c }) => c);
}

export function formatSuggestion(input: string, suggestions: string[]): string {
  if (suggestions.length === 0) {
    return `bash: ${input}: command not found`;
  }
  if (suggestions.length === 1) {
    return `bash: ${input}: command not found\nDid you mean '${suggestions[0]}'?`;
  }
  return `bash: ${input}: command not found\nDid you mean: ${suggestions.join(", ")}?`;
}
