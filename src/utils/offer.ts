import type { VaultStore } from "../types/types.js";

export async function offer(key: string, store: VaultStore): Promise<string> {
  const normalizedKey = key.toLowerCase();

  const matches = Object.keys(store)
    .map((storedKey) => ({
      key: storedKey,
      score: getSimilarityScore(key, storedKey),
    }))
    .filter(
      ({ key: storedKey, score }) =>
        score >= 0.35 || storedKey.toLowerCase().includes(normalizedKey),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ key }) => key);

  if (matches.length === 0) return "";

  const message = `Did you mean: ${matches.join(", ")}`;
  console.log(message);
  return matches[0] ?? "";
}

function getSimilarityScore(input: string, candidate: string): number {
  const normalizedInput = input.toLowerCase();
  const normalizedCandidate = candidate.toLowerCase();
  const maxLength = Math.max(
    normalizedInput.length,
    normalizedCandidate.length,
  );

  if (maxLength === 0) return 1;

  const distance = levenshtein(normalizedInput, normalizedCandidate);

  return 1 - distance / maxLength;
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) {
    dp[i]![0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    dp[0]![j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost,
      );
    }
  }

  return dp[a.length]![b.length]!;
}
