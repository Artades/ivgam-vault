import type { VaultStore } from "../types/types.js";

export async function runList(store: VaultStore): Promise<number> {
  const keys = Object.keys(store);
  if (keys.length === 0) {
    console.log("(empty)");
  } else {
    console.log(keys.join("\n"));
  }
  return 0;
}
