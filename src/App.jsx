/**
 * @fileoverview Root application shell for the class project. It keeps the simulated
 * login, the module menu, and the state-based integration point that mounts the Rick
 * and Morty API Explorer when the user selects the "Api" tile.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calculator,
  FileText,
  Globe,
  LogIn,
  LogOut,
  Plus,
} from 'lucide-react';
import SumModule from './components/Sum/SumModule';
import CalculatorModule from './components/Calculator/CalculatorModule';
import FormModule from './components/Form/FormModule';
import { ApiExplorerPage } from './pages/ApiExplorerPage';

const MENU_ITEMS = [
  {
    id: 'sum',
    title: 'SUM',
    description: 'Suma de dos números y resultado',
    icon: Plus,
    owner: 'Compañero',
    ready: false,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Calculadora Samsung One UI con historial y conversor',
    icon: Calculator,
    owner: 'Compañero (Listo)',
    ready: true,
  },
  {
    id: 'api',
    title: 'Api',
    description: 'Búsqueda con debounce, tarjetas y popup',
    icon: Globe,
    owner: 'Mi módulo (Listo)',
    ready: true,
  },
  {
    id: 'form',
    title: 'Form',
    description: 'Formik / React Hook Form + Zod + Animaciones',
    icon: FileText,
    owner: 'Mi apartado (Listo)',
    ready: true,
  },
];

/**
 * Root application shell. Navigation is handled with local React state only,
 * so no external routing library is required.
 *
 * State flow:
 * - `user` gates access to the workspace.
 * - `activeView` decides which module is rendered ('menu', 'sum', 'form',
 *   'calculator', or 'api').
 * - Selecting the "Api" tile sets `activeView` to 'api', which mounts
 *   `ApiExplorerPage` (the former `/api` route, now a state-driven view).
 *
 * @returns {JSX.Element} The rendered application shell.
 */
export function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeView, setActiveView] = useState('menu');

  /**
   * Validates the simulated credentials and opens the module workspace.
   *
   * @param {import('react').FormEvent<HTMLFormElement>} e - Submit event from the login form.
   * @returns {void}
   */
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError('Ingresa usuario y contraseña para continuar.');
      return;
    }
    setLoginError('');
    setUser(username.trim());
    setActiveView('menu');
  };

  /**
   * Clears the simulated session and returns to the login screen.
   *
   * @returns {void}
   */
  const handleLogout = () => {
    setUser(null);
    setUsername('');
    setPassword('');
    setActiveView('menu');
  };

  if (user && activeView === 'calculator') {
    return <CalculatorModule onBack={() => setActiveView('menu')} />;
  }

  // Integration point for the API module: the old `/api` URL route was replaced
  // by this state-driven branch, and onBack returns to the group's Main Menu.
  if (user && activeView === 'api') {
    return <ApiExplorerPage onBack={() => setActiveView('menu')} />;
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            className="glass-card"
            style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.25 }}
          >
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Iniciar Sesión
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Login simulado para acceder al menú de módulos React
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field-group">
                <label className="field-label" htmlFor="login-user">
                  Usuario
                </label>
                <input
                  id="login-user"
                  type="text"
                  className="input-control"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="login-pass">
                  Contraseña
                </label>
                <input
                  id="login-pass"
                  type="password"
                  className="input-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {loginError && <span className="error-text">{loginError}</span>}

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <LogIn size={18} />
                Entrar
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            className="glass-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {activeView !== 'menu' && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveView('menu')}
                  >
                    <ArrowLeft size={16} />
                    Volver al menú
                  </button>
                )}
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Sesión activa como <strong>{user}</strong>
                  </span>
                </div>
              </div>

              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                <LogOut size={16} />
                Salir
              </button>
            </div>

            {activeView === 'menu' && (
              <div>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Menú Principal
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Selecciona un módulo para abrirlo. <strong>Calculator</strong>,{' '}
                  <strong>Form</strong> y <strong>Api</strong> ya están integrados.
                </p>

                <div className="menu-grid">
                  {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`menu-tile ${item.ready ? 'active-owner' : ''}`}
                        onClick={() => setActiveView(item.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Icon size={22} color={item.ready ? '#34d399' : '#818cf8'} />
                          <span className={`badge ${item.ready ? 'badge-ready' : 'badge-teammate'}`}>
                            {item.owner}
                          </span>
                        </div>
                        <strong style={{ fontSize: '1.1rem' }}>{item.title}</strong>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeView === 'sum' && <SumModule />}
            {activeView === 'form' && <FormModule />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
