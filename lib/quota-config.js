/**
 * quota-config.js — Konstanta kuota harian "Analisis Mendalam".
 *
 * Dipisah dari app/api/scan/route.js supaya bisa dipakai bareng di
 * halaman /akun (buat nampilin sisa kuota) tanpa duplikasi angka.
 */

export const DEEPSCAN_ANON_MAX = 5;
export const DEEPSCAN_USER_MAX = 30;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const DEEPSCAN_ANON_PREFIX = "deepscan-daily-anon";
export const DEEPSCAN_USER_PREFIX = "deepscan-daily-user";
