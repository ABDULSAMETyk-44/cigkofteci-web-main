// -----------------------------------------------------------------------------
// Basit oturum (session) yönetimi.
//
// Web Crypto API (crypto.subtle) kullanır, bu sayede hem normal Node.js
// route handler'larında hem de Edge runtime'da (middleware.ts) çalışır.
// Ekstra bir kütüphaneye (jsonwebtoken vb.) ihtiyaç duymaz.
// -----------------------------------------------------------------------------

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SESSION_COOKIE_NAME = 'admin_session';
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 gün

export interface SessionPayload {
  sub: string; // admin id
  email: string;
  name: string;
  exp: number; // unix seconds
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Prod ortamında .env dosyasına ADMIN_SESSION_SECRET eklenmesi şiddetle
    // tavsiye edilir. Geliştirme kolaylığı için burada bir varsayılan
    // değer sağlanır ama bu ASLA canlı ortamda kullanılmamalıdır.
    return 'adiyaman-cigkofte-gelistirme-anahtari-degistirin';
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function createSessionToken(
  payload: Omit<SessionPayload, 'exp'>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<string> {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadStr = base64urlEncode(encoder.encode(JSON.stringify(fullPayload)));
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadStr));
  const sigStr = base64urlEncode(new Uint8Array(sig));
  return `${payloadStr}.${sigStr}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, sigStr] = parts;

  try {
    const key = await getKey();
    const expectedSig = base64urlDecode(sigStr);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      expectedSig as BufferSource,
      encoder.encode(payloadStr)
    );
    if (!valid) return null;

    const json = decoder.decode(base64urlDecode(payloadStr));
    const payload = JSON.parse(json) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
