/**
 * validateScanUrl — validasi URL di sisi server (mirror pengecekan di klien).
 *
 * Dipakai oleh /api/scan dan /api/threat-check supaya request yang masuk
 * langsung ke API (lewat curl/Postman dll) tetap divalidasi — bukan hanya
 * mengandalkan validasi di browser yang gampang dilewati.
 *
 * @param {unknown} input - URL mentah dari body request
 * @returns hasil validasi: { ok: true, url } bila valid, atau { ok: false, error } bila tidak
 */
export function validateScanUrl(input) {
  if (!input || typeof input !== "string") {
    return { ok: false, error: "URL tidak valid." };
  }

  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "URL kosong." };
  }

  if (trimmed.length > 2048) {
    return { ok: false, error: "URL terlalu panjang. Maksimal 2048 karakter." };
  }

  // Blokir protokol berbahaya
  if (/^(javascript|data|vbscript|file|ftp):/i.test(trimmed)) {
    return { ok: false, error: "Protokol URL tidak diizinkan." };
  }

  // Blokir karakter XSS / kontrol
  if (/[<>"'`{}\\]/.test(trimmed) || /[\x00-\x1f]/.test(trimmed)) {
    return { ok: false, error: "URL mengandung karakter yang tidak diizinkan." };
  }

  // Normalisasi: tambahkan https:// kalau belum ada protokol
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }

  // Validasi struktur
  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    return { ok: false, error: "Format URL tidak valid." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "Hanya protokol http dan https yang diizinkan." };
  }

  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    return { ok: false, error: "Format URL tidak valid." };
  }

  return { ok: true, url: normalized };
}
