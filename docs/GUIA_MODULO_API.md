# Guía Técnica del Módulo API (Rick and Morty Explorer)

Esta guía explica cómo funciona internamente el **Módulo API** implementado en la rama `feature/API`, pensada para estudiar y defender la arquitectura ante tu grupo o docente.

---

## 1. Arquitectura y Flujo de Datos

El módulo sigue una separación limpia por responsabilidades:

- **Servicio (`src/services/rickAndMortyApi.js`):** Encapsula las llamadas HTTP `fetch`, la codificación de parámetros, el manejo de `404` y la cancelación con `AbortSignal`.
- **Hook (`src/hooks/useDebounce.js`):** Retrasa la actualización del término de búsqueda para evitar peticiones innecesarias mientras el usuario escribe.
- **Utilidad (`src/utils/statusStyles.js`):** Mapea `Alive`, `Dead` y `unknown` a clases de Tailwind CSS sin duplicar lógica entre las cards y el modal.
- **Página (`src/pages/ApiExplorerPage.jsx`):** Orquesta el estado de búsqueda, carga, error, grid responsivo y el personaje seleccionado.
- **Modal (`src/components/CharacterDetailModal.jsx`):** Muestra el detalle completo del personaje seleccionado con soporte accesible para teclado (`Escape`) y cierre por backdrop.

### Diagrama de flujo paso a paso

```text
[Usuario escribe "Rick" en el <input>]
        │
        ▼
  searchTerm = "Rick"  (actualización inmediata en UI; muestra "Esperando 3s...")
        │
        ▼  (useDebounce espera 3000 ms de inactividad)
  debouncedQuery = "Rick"
        │
        ▼  (useEffect en ApiExplorerPage)
  Crea new AbortController() ──► Si cambia debouncedQuery antes de terminar:
        │                        controller.abort() cancela la petición anterior
        ▼
  fetchCharacters("Rick", controller.signal)
        │
        ├──► HTTP 200 OK ──► setCharacters(data.results) ──► Renderiza Grid de Cards
        ├──► HTTP 404    ──► devuelve []                 ──► "No se encontraron personajes"
        └──► Error Red   ──► setError(msg)               ──► Alerta + botón "Reintentar"
                                                                  │
[Usuario hace clic en una Card] ◄─────────────────────────────────┘
        │
        ▼
  setSelectedCharacter(character)
        │
        ▼
  <CharacterDetailModal /> se abre
        │
        ├──► Clic en botón X      ──► onClose() ──► selectedCharacter = null
        ├──► Clic en el backdrop  ──► onClose() ──► selectedCharacter = null
        └──► Tecla Escape         ──► onClose() ──► selectedCharacter = null
```

---

## 2. Explicación Técnica de Piezas Clave

### A. ¿Cómo funciona el Debounce (`useDebounce`) y por qué se usa?

En `src/hooks/useDebounce.js`:

```js
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  return () => {
    clearTimeout(timer);
  };
}, [value, delay]);
```

- Cada vez que el usuario presiona una tecla, `searchTerm` cambia de inmediato (para que el input se sienta fluido), pero **no** dispara la petición a la API directamente.
- `useDebounce(searchTerm, 3000)` programa un `setTimeout` de `3000 ms`.
- Si el usuario vuelve a escribir antes de que pasen los 3 segundos, React ejecuta la función de limpieza (`clearTimeout(timer)`) del efecto anterior y reinicia el conteo.
- **Beneficio:** Si alguien escribe `"Morty"` (5 letras), en lugar de hacer 5 peticiones HTTP seguidas, solo se realiza **1 petición** cuando termina de escribir. Esto evita saturar la API pública (rate limiting) y ahorra ancho de banda.

### B. Prevención de *Race Conditions* con `AbortController` y manejo del `404`

**¿Qué es una *race condition*?**
Si una búsqueda `"A"` tarda 2 segundos en responder y otra búsqueda `"B"` hecha después tarda solo 0.3 segundos, sin cancelación podría llegar primero `"B"` y luego `"A"` sobrescribir la pantalla con resultados viejos.

**Cómo lo evitamos:**
En `ApiExplorerPage.jsx`, cada ejecución del `useEffect` crea su propio `const controller = new AbortController()` y pasa `controller.signal` a `fetchCharacters(...)`.
Cuando `debouncedQuery` cambia o el componente se desmonta, la función de limpieza ejecuta `controller.abort()`. El navegador cancela la petición anterior y, si lanza un `AbortError`, el `catch` lo ignora silenciosamente (`if (err.name === 'AbortError') return;`).

**¿Qué pasa cuando la API responde `404`?**
La API de Rick and Morty devuelve HTTP `404 Not Found` cuando buscas un nombre que no existe (por ejemplo, `"xyz123"`). En lugar de tratarlo como un fallo grave:
- `fetchCharacters` detecta `if (response.status === 404) return [];`.
- Así, `characters` queda como arreglo vacío `[]` y la interfaz muestra el estado amigable `"No se encontraron personajes"` en vez de mostrar una alerta de error rojo.

### C. Grid Responsivo y Modal Accesible

**Grid Responsivo (Tailwind CSS):**
Se utiliza la clase:
`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
- Móvil (`< 640px`): **1 columna**
- Tablet pequeña (`sm >= 640px`): **2 columnas**
- Tablet / Laptop (`md >= 768px`): **3 columnas**
- Escritorio (`lg >= 1024px`): **4 columnas**

**Modal / Popup (`CharacterDetailModal.jsx`):**
1. **Estado seleccionado:** `selectedCharacter` vive en `ApiExplorerPage`. Si es `null`, el modal retorna `null` y no ocupa espacio en el DOM.
2. **Tecla `Escape`:** Un `useEffect` registra `document.addEventListener('keydown', handleKeyDown)` mientras `character` exista y llama `onClose()` al presionar `Escape`, limpiando el listener al cerrarse. También bloquea el scroll del `body` (`overflow = 'hidden'`) mientras está abierto.
3. **Clic fuera del cuadro (Backdrop):** El contenedor externo oscuro tiene `onClick={onClose}`. El cuadro interno del modal tiene `onClick={(event) => event.stopPropagation()}` para evitar que los clics dentro de la ficha técnica suban hasta el backdrop y cierren el modal por accidente.

### D. Conexión desde el Menú Principal con estado de React

En `src/App.jsx` se usa únicamente `useState` para decidir qué vista se muestra:
- El botón **Api** del menú ejecuta `setActiveView('api')`.
- Cuando `activeView === 'api'`, `App` renderiza `<ApiExplorerPage onBack={() => setActiveView('menu')} />`.
- El botón **"Volver al Menú"** del explorador llama a la prop `onBack()` y regresa al menú principal sin recargar la página.
- No se usa ninguna librería de enrutamiento: la navegación es interna por estado, por lo que la URL no cambia y no existen rutas profundas como `/api`.
