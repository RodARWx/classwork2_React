/**
 * @fileoverview Temporary Main Menu placeholder page used to test module
 * navigation callbacks until the group's MainView module is integrated.
 */

/** @type {Array<{ name: string, description: string, available: boolean }>} */
const MENU_MODULES = [
  { name: 'SUM', description: 'Módulo de suma (compañero)', available: false },
  { name: 'Calculator', description: 'Módulo de calculadora (compañero)', available: false },
  { name: 'Form', description: 'Módulo de formulario (compañero)', available: false },
  {
    name: 'Api',
    description: 'Explorador de personajes de Rick and Morty',
    available: true,
  },
];

/**
 * Renders the temporary Main Menu with a callback-driven Api module button.
 *
 * @param {{ onNavigate?: (module: string) => void }} props Optional navigation callback.
 * @returns {JSX.Element} The rendered menu view.
 */
export function MenuPage({ onNavigate }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Menú Principal (Acceso Temporal)
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Classwork 2 — React
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Selecciona el módulo <strong className="text-slate-200">Api</strong> para abrir el
            explorador de Rick and Morty.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MENU_MODULES.map((item) =>
            item.available ? (
              <button
                key={item.name}
                type="button"
                onClick={() => onNavigate?.(item.name)}
                className="flex cursor-pointer flex-col justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="text-lg font-bold text-emerald-300">{item.name}</span>
                <span className="mt-1 text-xs text-slate-300">{item.description}</span>
              </button>
            ) : (
              <div
                key={item.name}
                aria-disabled="true"
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-5 opacity-55"
              >
                <span className="text-lg font-semibold text-slate-300">{item.name}</span>
                <span className="mt-1 text-xs text-slate-500">{item.description}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
