/**
 * @fileoverview Service layer for communicating with the public Rick and Morty REST API.
 * Handles initial character listing, partial name search, HTTP 404 empty-state normalization,
 * and request cancellation via AbortController signals.
 */

const BASE_URL = 'https://rickandmortyapi.com/api/character';

/**
 * @typedef {object} CharacterLocationRef
 * @property {string} name - Display name of the origin or location.
 * @property {string} url - API resource URL for the location.
 */

/**
 * @typedef {object} Character
 * @property {number} id - Unique character identifier.
 * @property {string} name - Full character name.
 * @property {'Alive' | 'Dead' | 'unknown'} status - Current life status.
 * @property {string} species - Biological species of the character.
 * @property {string} type - Subspecies or variant (may be an empty string).
 * @property {string} gender - Character gender.
 * @property {CharacterLocationRef} origin - Place of origin.
 * @property {CharacterLocationRef} location - Last known location.
 * @property {string} image - URL to the character's avatar image.
 * @property {string[]} episode - List of episode URLs featuring this character.
 */

/**
 * Fetches Rick and Morty characters from the REST API.
 *
 * Behavior & Edge Cases:
 * - When `query` is empty or whitespace-only, requests the first page of characters.
 * - When `query` is non-empty, performs a URL-encoded partial name search.
 * - If the API responds with HTTP `404` (meaning no characters match the search query),
 *   this function resolves to an empty array `[]` instead of throwing, allowing the UI
 *   to render a friendly empty state.
 * - Accepts an `AbortSignal` from an `AbortController` so callers can cancel stale
 *   in-flight requests and prevent race conditions.
 *
 * @param {string} [query=''] - Optional character name filter.
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel the underlying fetch request.
 * @returns {Promise<Character[]>} Resolves to an array of character objects (or `[]` on 404).
 * @throws {Error} Throws on non-404 HTTP errors or network failures (unless aborted).
 */
export async function fetchCharacters(query = '', signal) {
  const trimmedQuery = query.trim();
  const url = trimmedQuery
    ? `${BASE_URL}/?name=${encodeURIComponent(trimmedQuery)}`
    : BASE_URL;

  const response = await fetch(url, { signal });

  // The Rick and Morty API returns 404 when a name filter yields zero matches.
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(
      `Error al consultar la API (${response.status} ${response.statusText || 'Error de servidor'}).`
    );
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}
