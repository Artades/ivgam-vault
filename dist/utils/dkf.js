import crypto from 'crypto';
function deriveKey(password, salt) {
    return crypto.scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
}
export default deriveKey;
//# sourceMappingURL=dkf.js.map