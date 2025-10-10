import type { VaultStore } from "../types/types.js";

export async function runList(store: VaultStore) {
  const keys = Object.keys(store);
  if (keys.length === 0) {
    console.log("(пусто)");
  } else {
    console.log(keys.join("\n"));
  }
  process.exit(0);
}
