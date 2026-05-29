/**
 * Ortak tip yardımcıları.
 *
 * KURAL (backend uyumu): tüm `id` alanları `string` (UUID) ve tüm tarih/zaman
 * alanları ISO 8601 **string** olarak tiplenir (Date objesi DEĞİL). Backend
 * (NestJS/Prisma → JSON) tarihleri ISO string döndürür; REST'e bağlandığımızda
 * tip uyuşmazlığı yaşamamak için mock'lar da bu kurala uyar.
 */

/** UUID — backend `@db.Uuid`. */
export type UUID = string;

/** ISO 8601 tarih-saat damgası, ör. "2026-05-29T10:00:00.000Z". */
export type ISODateTime = string;

/** ISO 8601 tarih (saat yok), ör. "2026-06-12". */
export type ISODate = string;

/** "HH:mm:ss" — Prisma `@db.Time`. */
export type TimeString = string;

/** Soft-delete + zaman damgası taşıyan kayıtlar için ortak alanlar. */
export interface Timestamps {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
}
