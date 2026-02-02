/**
 * URL hash에 담을 수 있도록 텍스트를 압축·인코딩합니다.
 * - 431 방지: hash는 서버로 전송되지 않음
 * - gzip + base64url로 길이 절감 및 URL 안전 문자만 사용
 */

const BASE64URL_SAFE = { '+': '-', '/': '_' };
const BASE64URL_UNSAFE = { '-': '+', '_': '/' };

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, BASE64URL_SAFE['+']).replace(/\//g, BASE64URL_SAFE['/']).replace(/=+$/, '');
}

function base64UrlToArrayBuffer(str: string): ArrayBuffer {
  let base64 = str.replace(/-/g, BASE64URL_UNSAFE['-']).replace(/_/g, BASE64URL_UNSAFE['_']);
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** 텍스트 → gzip 압축 → base64url (hash/URL 안전) */
export async function encodePayload(text: string): Promise<string> {
  if (typeof CompressionStream === 'undefined') {
    return encodePayloadFallback(text);
  }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(stream).arrayBuffer();
  return arrayBufferToBase64Url(buffer);
}

/** base64url → gzip 복원 → 텍스트 */
export async function decodePayload(encoded: string): Promise<string> {
  if (!encoded.trim()) return '';
  if (typeof DecompressionStream === 'undefined') {
    return decodePayloadFallback(encoded);
  }
  try {
    const buffer = base64UrlToArrayBuffer(encoded);
    const bytes = new Uint8Array(buffer);
    // gzip 매직 넘버(1f 8b)가 아니면 압축이 아닌 예전 형식 → fallback으로만 복원
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
      const blob = await new Response(stream).blob();
      return await blob.text();
    }
    return decodePayloadFallback(encoded);
  } catch {
    // gzip 복원 실패 시 비압축 base64인지 시도; 유효한 헤더('순번')가 있을 때만 반환
    try {
      const fallback = decodePayloadFallback(encoded);
      if (fallback.includes('순번')) return fallback;
    } catch {
      // ignore
    }
    return '';
  }
}

/** CompressionStream 미지원 환경: base64url만 사용 (압축 없음) */
function encodePayloadFallback(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return arrayBufferToBase64Url(bytes.buffer);
}

function decodePayloadFallback(encoded: string): string {
  try {
    const buffer = base64UrlToArrayBuffer(encoded);
    return new TextDecoder().decode(buffer);
  } catch {
    return '';
  }
}
