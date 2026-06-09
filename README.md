# 🗝️ Ivgam Vault

**Ivgam Vault** is a simple and secure CLI password manager that stores encrypted data locally.

The vault is stored at `~/.local/vault.dat` (or `%USERPROFILE%\.local\vault.dat` on Windows).

---

## ⚡ Installation

### From npm

```bash
npm install -g ivgam-vault
```

## Usage

Initialize a new vault:

```bash
vault init
```

Open the interactive shell:

```bash
vault
```

You can also run commands directly:

```bash
vault add <name>
vault get [name]
vault list
vault edit <name>
vault rm <name>
```
