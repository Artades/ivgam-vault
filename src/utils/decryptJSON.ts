import * as crypto from "crypto";
import type { VaultStore } from "../types/types.js";
import deriveKey from "./dkf.js";

function decryptJSON(b64: string, password: string): VaultStore {
  const buf = Buffer.from(b64, "base64");
  const salt = buf.slice(0, 16);
  const iv = buf.slice(16, 28);
  const tag = buf.slice(28, 44);
  const ct = buf.slice(44);

  const key = deriveKey(password, salt);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ct), decipher.final()]);

  return JSON.parse(plain.toString("utf-8"));
}

export default decryptJSON;
