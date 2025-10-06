import crypto from 'crypto';


function deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.scryptSync(password, salt, 32, {N: 16384, r:8, p: 1})
}

export default deriveKey;