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
 * Returns Tailwind classes and label for a character's life status.
 *
 * @param {string} status - Character status ('Alive', 'Dead', or 'unknown').
 * @returns {{ dotClass: string, badgeClass: string, label: string }}
 */
export function getStatusConfig(status) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
}
