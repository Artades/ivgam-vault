import clipboard from "clipboardy";
import type { VaultStore } from "../types/types.js";

export async function runGet(store: VaultStore, _pass: string, args: string[]) {
  const key = args[0];
  if (!key || !store[key]) {
    console.log("❌ Record not found");
    process.exit(1);
  }

  const entry = store[key];
  console.log("👤 User:", entry.username || "");
  console.log("🌐 URL:", entry.url || "");
  console.log("📝 Notes:", entry.notes || "");
  console.log("🔑 Password:", entry.password);

  await clipboard.write(entry.password);
  console.log("(Password copied to clipboard for 10 seconds)");

  setTimeout(async () => {
    await clipboard.write("");
    console.log("🧹 Clipboard cleared");
    process.exit(0);
  }, 10000);
}
