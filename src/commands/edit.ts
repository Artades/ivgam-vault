import type { VaultEntry, VaultStore } from "../types/types.js";
import edit, { EDIT_MODES } from "../utils/edit.js";
import { saveVault } from "../utils/valut.js";

export async function runEdit(
  store: VaultStore,
  _pass: string,
  args: string[]
): Promise<void> {
  const key = args[0];

  if (!key || !store[key]) {
    console.log("❌ Record not found");
    process.exit(1);
  }

  const entry = store[key];

  for (const [field, value] of Object.entries(entry).filter(
    ([f]) => f !== "updated"
  )) {
    const newValue: string = await edit(
      value,
      `Edit ${field} (current: ${value}): `,
      field !== "password" ? EDIT_MODES.VISIBLE : EDIT_MODES.HIDDEN
    );

    if (newValue.trim()) {
      entry[field as keyof VaultEntry] = newValue;
    }
  }

  entry.updated = new Date().toISOString();
  store[key] = entry;
  saveVault(store, _pass);

  console.log(`✏️ Updated: ${key}`);
  process.exit(0);
}
