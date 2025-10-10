import * as crypto from 'crypto';
import * as readline from 'readline';
import { saveVault } from '../utils/valut.js';
import type { VaultStore } from '../types/types.js';

export async function runAdd(store: VaultStore, pass: string, args: string[]) {
  const key = args[0];
  if (!key) {
    console.log('⚠️ Please provide a record name');
    process.exit(1);
  }
  if (store[key]) {
    console.log('❌ Record already exists');
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

  const username = await ask('Username: ');
  const password = (await ask('Password (leave empty to generate): ')) || generatePassword();
  const url = await ask('URL (optional): ');
  const notes = await ask('Notes (optional): ');
  rl.close();

  store[key] = { username, password, url, notes, updated: new Date().toISOString() };
  saveVault(store, pass);
  console.log(`✅ Added: ${key}`);
  process.exit(0);
}

function generatePassword() {
  const val = crypto.randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  console.log('🔑 Generated password:', val);
  return val;
}
