import * as fs from "fs";
import * as path from "path";
import askHidden from "../utils/askHidden.js";
import { saveVault } from "../utils/valut.js";

const VAULT_PATH = path.join(process.env.HOME || ".", ".local", "vault.dat");

export async function runInit(): Promise<void> {
  if (fs.existsSync(VAULT_PATH)) {
    console.log("⚠️ Vault already exists at", VAULT_PATH);
    process.exit(1);
  }

  const pass = await askHidden("Create master password: ");
  const pass2 = await askHidden("Confirm password: ");
  if (pass !== pass2) {
    console.log("❌ Passwords do not match");
    process.exit(1);
  }

  saveVault({}, pass);
  console.log("✅ Vault successfully created:", VAULT_PATH);
  process.exit(0);
}
