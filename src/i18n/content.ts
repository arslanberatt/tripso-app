import i18n from '@/i18n';
import type { Destination, Experience } from '@/types';

/**
 * Mock İÇERİK çevirisi için yardımcılar.
 *
 * Karar: mock objelerine paralel tr/en alan EKLENMEZ; veri şekli API-uyumlu
 * kalır. Render anında `t('content:...')` ile çözülür; mock'taki mevcut İngilizce
 * metin `defaultValue` olarak fallback'tir (eksik key → İngilizce, çökme yok).
 *
 * Slug, mevcut isim/etiketten türetilir (tip değişmez). Tag/highlight gibi
 * paylaşılan sözlükler tek key altında tekilleşir ("Beach" her yerde aynı).
 */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // aksan işaretlerini sil
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** i18next default instance üzerinden t(); helper'lar component dışında da çağrılabilir. */
const t = i18n.t.bind(i18n);

export function destinationName(d: Destination): string {
  return t(`content:destinations.${slugify(d.name)}.name`, { defaultValue: d.name });
}

export function destinationDescription(d: Destination): string {
  return t(`content:destinations.${slugify(d.name)}.description`, {
    defaultValue: d.description,
  });
}

export function tagLabel(tag: string): string {
  return t(`content:tags.${slugify(tag)}`, { defaultValue: tag });
}

export function highlightLabel(label: string): string {
  return t(`content:highlights.${slugify(label)}`, { defaultValue: label });
}

export function experienceTitle(e: Experience): string {
  return t(`content:experiences.${slugify(e.title)}.title`, { defaultValue: e.title });
}

export function experienceDuration(e: Experience): string {
  return t(`content:experiences.durations.${slugify(e.durationLabel)}`, {
    defaultValue: e.durationLabel,
  });
}
