export type VaultEntry = {
  username?: string;
  password: string;
  url?: string;
  notes?: string;
  updated: string;
};

export type VaultStore = Record<string, VaultEntry>;
