/**
 * @fileoverview Accessible modal dialog component that displays detailed character
 * information when a user selects a character card in the API Explorer.
 */

import { useEffect } from 'react';
import { getStatusConfig } from '../utils/statusStyles';

/**
 * @typedef {object} CharacterDetailModalProps
 * @property {import('../services/rickAndMortyApi').Character | null} character - Selected character
 *   to display. When `null`, the modal renders nothing.
 * @property {() => void} onClose - Callback invoked to close the modal (triggered by Escape key,
 *   backdrop click, or the top-right close button).
 */

/**
 * Centered modal displaying a character's full profile (image, status, species,
 * optional type, gender, origin, last known location, and episode count).
 *
 * Accessibility & Interaction:
 * - Uses `role="dialog"` and `aria-modal="true"` linked to the modal title.
 * - Registers a `keydown` listener to close when the user presses `Escape`.
 * - Locks body scrolling while open and restores it on close/unmount.
 * - Closes when clicking the semi-transparent backdrop while preventing clicks inside
 *   the modal card from bubbling up via `event.stopPropagation()`.
 *
 * @param {CharacterDetailModalProps} props - Component props.
 * @returns {JSX.Element | null} Rendered modal overlay or `null` when closed.
 */
export function CharacterDetailModal({ character, onClose }) {
  useEffect(() => {
    if (!character) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [character, onClose]);

  if (!character) return null;

  const statusConfig = getStatusConfig(character.status);
  const episodeCount = Array.isArray(character.episode) ? character.episode.length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle del personaje"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full bg-slate-800 md:w-5/12">
            <img
              src={character.image}
              alt={character.name}
              className="h-72 w-full object-cover md:h-full"
            />
          </div>

          <div className="flex w-full flex-col justify-between gap-5 p-6 md:w-7/12">
            <div>
              <div className="mb-3 pr-8">
                <h2
                  id="character-modal-title"
                  className="text-2xl font-bold tracking-tight text-white"
                >
                  {character.name}
                </h2>
                <span
                  className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.badgeClass}`}
                >
                  <span className={`h-2 w-2 rounded-full ${statusConfig.dotClass}`} />
                  {statusConfig.label}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Especie
                  </dt>
                  <dd className="mt-1 font-medium text-slate-100">
                    {character.species || 'Desconocida'}
                  </dd>
                </div>

                {character.type && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Tipo
                    </dt>
                    <dd className="mt-1 font-medium text-slate-100">{character.type}</dd>
                  </div>
                )}

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Género
                  </dt>
                  <dd className="mt-1 font-medium text-slate-100">
                    {character.gender || 'Desconocido'}
                  </dd>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Episodios
                  </dt>
                  <dd className="mt-1 font-medium text-emerald-300">
                    {episodeCount} {episodeCount === 1 ? 'episodio' : 'episodios'}
                  </dd>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Origen (Planeta / Dimensión)
                  </dt>
                  <dd className="mt-1 font-medium text-slate-100">
                    {character.origin?.name || 'Desconocido'}
                  </dd>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Última ubicación conocida
                  </dt>
                  <dd className="mt-1 font-medium text-slate-100">
                    {character.location?.name || 'Desconocida'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
