const BASE_URL = 'https://rickandmortyapi.com/api/character';

/**
 * Fetches Rick and Morty characters from the REST API.
 * Returns an empty array when the API responds with 404 (no matches).
 *
 * @param {string} [query=''] - Optional character name search query.
 * @param {AbortSignal} [signal] - AbortSignal to cancel in-flight requests.
 * @returns {Promise<Array<object>>} Array of character objects.
 */
export async function fetchCharacters(query = '', signal) {
  const trimmedQuery = query.trim();
  const url = trimmedQuery
    ? `${BASE_URL}/?name=${encodeURIComponent(trimmedQuery)}`
    : BASE_URL;

  const response = await fetch(url, { signal });

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
