// lib/verifyJwtEdge.js
import { jwtVerify } from 'jose';

const encoder = new TextEncoder();

// For HS256 (HMAC), provide the secret as a Uint8Array
export async function verifyJwtEdge(token) {
    if (!token) throw new Error('No token provided');

    // Ensure you set process.env.JWT_SECRET (a strong secret, >= 32 bytes recommended)
    const secret = encoder.encode(process.env.JWT_SECRET || '');

    try {
        // third param: optional verification options (issuer, audience, algorithms)
        const { payload } = await jwtVerify(token, secret, {
            // optionally validate issuer/audience if you know them:
            // issuer: 'https://your-issuer.example',
            // audience: 'your-audience',
            // algorithms: ['HS256'], // optional
        });

        // payload is a plain object with the claims. 'exp' has been checked by jwtVerify already.
        return { valid: true, payload };
    } catch (err) {
        // Helpful diagnostics for common cases
        const message = err?.message || String(err);
        if (message.includes('expired')) {
            return { valid: false, reason: 'expired' };
        }
        if (message.includes('invalid')) {
            return { valid: false, reason: 'invalid' };
        }
        return { valid: false, reason: 'error', error: err };
    }
}
