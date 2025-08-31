
import crypto from "crypto";
const SECRET = process.env.SESSION_SECRET || "change_me";
function getKey(){ return crypto.createHash("sha256").update(String(SECRET)).digest(); }
export function encryptJson(obj){
  const iv = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const pt = Buffer.from(JSON.stringify(obj), "utf8");
  const enc = Buffer.concat([cipher.update(pt), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}
export function decryptJson(tok){
  const buf = Buffer.from(tok, "base64url");
  const iv = buf.subarray(0,12), tag = buf.subarray(12,28), enc = buf.subarray(28);
  const key = getKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString("utf8"));
}
