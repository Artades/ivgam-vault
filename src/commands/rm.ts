import type { VaultStore } from "../types/types.js";
import { saveVault } from "../utils/valut.js";

export async function runRm(store: VaultStore, pass: string, args: string[]) {
  const key = args[0];
  if (!key || !store[key]) {
    console.log("❌ Не найдено");
    process.exit(1);
  }

  delete store[key];
  saveVault(store, pass);
  console.log(`🗑️  Удалено: ${key}`);
  process.exit(0);
}
