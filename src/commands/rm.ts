import type { VaultStore } from "../types/types.js";
import { saveVault } from "../utils/valut.js";

export async function runRm(store: VaultStore, pass: string, args: string[]) {
  const key = args[0];
  if (!key || !store[key]) {
    console.log("❌ Not found");
    process.exit(1);
  }

  delete store[key];
  saveVault(store, pass);
  console.log(`🗑️  Deleted: ${key}`);
  process.exit(0);
}
