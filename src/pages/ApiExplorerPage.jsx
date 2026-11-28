/**
 * @fileoverview Main page for the Rick and Morty API Explorer module. It is mounted
 * from the group's Main Menu through local state navigation (the former `/api` route).
 * Coordinates debounced character search, abortable data fetching, responsive grid
 * rendering, loading/empty/error UI states, and the character detail modal.
 */

import { useCallback, useEffect, useState } from 'react';
import { CharacterDetailModal } from '../components/CharacterDetailModal';
import { useDebounce } from '../hooks/useDebounce';
import { fetchCharacters } from '../services/rickAndMortyApi';
import { getStatusConfig } from '../utils/statusStyles';

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, index) => index);

/**
 * Rick and Morty character explorer view.
 *
 * Responsibilities:
 * - Provides a sticky header with a "Volver al Menú" navigation button and a
 *   debounced search input (3000ms delay) with a quick-clear (`X`) button.
 * - Cancels superseded API requests using `AbortController` to prevent race conditions.
 * - Renders skeleton placeholders during loading, a friendly empty state on zero
 *   matches, an error alert with a retry action on network failures, and a responsive
 *   1-to-4 column character card grid.
 * - Opens `CharacterDetailModal` when a character card is clicked or activated via keyboard.
 *
 * @param {{ onBack?: () => void }} props Optional callback used by the "Volver al Menú" button.
 * @returns {JSX.Element} The rendered API Explorer page.
 */
export function ApiExplorerPage({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm, 3000);

  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const isDebouncing = searchTerm.trim() !== debouncedQuery.trim();

  useEffect(() => {
    const controller = new AbortController();

    /**
     * Requests the current debounced query and publishes one of the four UI states.
     * AbortError is ignored because a newer effect run already superseded this request.
     *
     * @returns {Promise<void>} Resolves when the request settles or is cancelled.
     */
    async function loadCharacters() {
      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchCharacters(debouncedQuery, controller.signal);
        setCharacters(results);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(
          err.message || 'No se pudo conectar con la API de Rick and Morty. Inténtalo de nuevo.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCharacters();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, retryToken]);

  /**
   * Resets the controlled search input, which restarts the debounce cycle.
   *
   * @returns {void}
   */
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  /**
   * Increments the retry token to re-trigger the current character fetch
   * without changing the active query.
   *
   * @returns {void}
   */
  const handleRetry = () => {
    setRetryToken((prev) => prev + 1);
  };

  /**
   * Closes the character detail modal. Memoized so the modal's keydown effect
   * does not re-register on every parent render.
   *
   * @returns {void}
   */
  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onBack?.()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Volver al Menú
            </button>

            <div className="text-right lg:text-left">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Rick &amp; Morty Explorer
              </h1>
              <p className="text-xs text-slate-400">Módulo API REST</p>
            </div>
          </div>

          <div className="w-full lg:max-w-md">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar personaje por nombre (ej. Rick, Morty)..."
                aria-label="Buscar personaje por nombre"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pr-10 pl-10 text-sm text-slate-100 placeholder-slate-400 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Limpiar búsqueda"
                  className="absolute inset-y-0 right-2.5 my-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="mt-1.5 flex min-h-4 items-center gap-2 text-xs text-slate-400">
              {isDebouncing && (
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                  Esperando 3s para buscar...
                </span>
              )}
              {!isDebouncing && isLoading && (
                <span className="inline-flex items-center gap-1.5 text-emerald-300">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  Cargando personajes...
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-rose-500/40 bg-rose-950/30 p-6 text-center"
          >
            <p className="text-base font-semibold text-rose-200">
              Ocurrió un error al cargar los personajes
            </p>
            <p className="mt-2 text-sm text-rose-300/90">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              Reintentar
            </button>
          </div>
        ) : isLoading ? (
          <div
            aria-label="Cargando personajes"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {SKELETON_ITEMS.map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-800" />
                <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-slate-800" />
                <div className="mt-3 flex items-center justify-between">
                  <div className="h-5 w-20 animate-pulse rounded-full bg-slate-800" />
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <p className="text-lg font-semibold text-white">No se encontraron personajes</p>
            <p className="mt-2 text-sm text-slate-400">
              No hay coincidencias para{' '}
              <span className="font-medium text-slate-200">&ldquo;{debouncedQuery}&rdquo;</span>.
              Prueba con otro nombre.
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-5 cursor-pointer rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {characters.map((character) => {
              const statusConfig = getStatusConfig(character.status);

              return (
                <article
                  key={character.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCharacter(character)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedCharacter(character);
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-slate-800">
                    <img
                      src={character.image}
                      alt={character.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-4">
                    <h2 className="truncate text-base font-bold text-white group-hover:text-emerald-300">
                      {character.name}
                    </h2>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${statusConfig.dotClass}`} />
                        {statusConfig.label}
                      </span>

                      <span className="truncate text-xs font-medium text-slate-400">
                        {character.species}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <CharacterDetailModal character={selectedCharacter} onClose={handleCloseModal} />
    </div>
  );
}
