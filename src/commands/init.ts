import * as fs from "fs";
import * as path from "path";
import askHidden from "../utils/askHidden.js";
import { saveVault } from "../utils/valut.js";

const VAULT_PATH = path.join(process.env.HOME || ".", ".local", "vault.dat");

export async function runInit(): Promise<void> {
     if (fs.existsSync(VAULT_PATH)) {
      console.log("⚠️  Vault уже существует по пути", VAULT_PATH);
      process.exit(1);
    }

    const pass = await askHidden("Создайте master пароль: ");
    const pass2 = await askHidden("Подтвердите пароль: ");
    if (pass !== pass2) {
      console.log("❌ Пароли не совпадают");
      process.exit(1);
    }

    saveVault({}, pass);
    console.log("✅ Vault успешно создан:", VAULT_PATH);
    process.exit(0);
}