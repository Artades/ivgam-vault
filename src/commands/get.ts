import clipboard from 'clipboardy';
import type { VaultStore } from '../types/types.js';
import { selectEntry } from '../utils/selectEntry.js';

type GetOptions = {
  waitForClipboardClear?: boolean;
  showClipboardCleared?: boolean;
};

export async function runGet(
  store: VaultStore,
  _pass: string,
  args: string[],
  options: GetOptions = {},
): Promise<number> {
  const waitForClipboardClear = options.waitForClipboardClear ?? true;
  const showClipboardCleared = options.showClipboardCleared ?? true;
  let key = args[0];

  if (!key || !store[key]) {
    if (key) console.log('❌ Not found');

    const selectedKey = await selectEntry(Object.keys(store), key);

    if (!selectedKey) {
      console.log('Cancelled');
      return 1;
    }

    key = selectedKey;
  }

  const entry = store[key];
  if (!entry) {
    console.log('❌ Not found');
    return 1;
  }

  console.log('👤 User:', entry.username || '');
  console.log('🌐 URL:', entry.url || '');
  console.log('📝 Notes:', entry.notes || '');
  console.log('🔑 Password:', entry.password);

  await clipboard.write(entry.password);
  console.log('(Password copied to the clipboard for 10 seconds)');

  const clearClipboard = async () => {
    await clipboard.write('');
    if (showClipboardCleared) console.log('🧹 Clipboard cleared');
  };

  if (waitForClipboardClear) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await clearClipboard();
  } else {
    setTimeout(() => {
      void clearClipboard();
    }, 10000);
  }

  return 0;
}
