import path from "path";
import * as fs from "fs";
import encryptJSON from "./encryptJSON.js";
import decryptJSON from "./decryptJSON.js";
const HOME_DIR = process.env.HOME || process.env.USERPROFILE || '.';
const VAULT_PATH = path.join(HOME_DIR, '.local', 'vault.dat');
export function saveVault(obj, password) {
    const enc = encryptJSON(obj, password);
    fs.mkdirSync(path.dirname(VAULT_PATH), { recursive: true });
    fs.writeFileSync(VAULT_PATH, enc, { mode: 0o600 });
}
export function loadVault(password) {
    if (!fs.existsSync(VAULT_PATH))
        return {};
    const enc = fs.readFileSync(VAULT_PATH, "utf8");
    return decryptJSON(enc, password);
}
//# sourceMappingURL=valut.js.map