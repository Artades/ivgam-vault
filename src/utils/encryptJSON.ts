import * as crypto from "crypto";
import type { VaultStore } from "../types/types.js";
import deriveKey from "./dkf.js";

function encryptJSON(obj: VaultStore, password: string): string {
  const salt = crypto.randomBytes(16);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const plain = Buffer.from(JSON.stringify(obj), "utf-8");

  const ct = Buffer.concat([cipher.update(plain), cipher.final()]);

  const tag = cipher.getAuthTag();


  return Buffer.concat([salt, iv, tag, ct]).toString("base64");

}

export default encryptJSON;


