/**
 * @fileoverview Shared presentation helper for mapping Rick and Morty character
 * life statuses ('Alive', 'Dead', 'unknown') to Tailwind CSS badge and dot styles.
 */

/**
 * @typedef {object} StatusStyleConfig
 * @property {string} dotClass - Tailwind background class for the status indicator dot.
 * @property {string} badgeClass - Tailwind classes for badge background, text, and border.
 * @property {string} label - Display label for the status.
 */

/** @type {Record<string, StatusStyleConfig>} */
const STATUS_CONFIG = {
  Alive: {
    dotClass: 'bg-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    label: 'Alive',
  },
  Dead: {
    dotClass: 'bg-rose-500',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    label: 'Dead',
  },
  unknown: {
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    label: 'unknown',
  },
};

/**
 * Resolves the Tailwind CSS classes and label for a given character status.
 * Falls back to the `unknown` style configuration for unexpected values.
 *
 * @param {string} status - Character life status ('Alive', 'Dead', or 'unknown').
 * @returns {StatusStyleConfig} Style tokens and label for the status badge.
 */
export function getStatusConfig(status) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
}
