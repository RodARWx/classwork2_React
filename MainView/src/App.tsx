import { LayoutGrid, LogOut } from 'lucide-react';
import { MainMenu } from './components/MainMenu';
import type { FeatureKey } from './types/navigation';
import './App.css';

interface AppProps {
  onNavigate?: (feature: FeatureKey) => void;
  onLogout?: () => void;
}

export function App({ onNavigate, onLogout }: AppProps) {
  const handleNavigate = (feature: FeatureKey) => {
    // TODO: Teammate will implement navigation/routing to each feature module here.
    console.info('Navigate to feature:', feature);
    onNavigate?.(feature);
  };

  const handleLogout = () => {
    // TODO: Teammate will connect sign-out redirect back to Login here.
    console.info('Sign out requested');
    onLogout?.();
  };

  return (
    <main className="main-page">
      <div className="main-backdrop-glow main-backdrop-glow--top" aria-hidden="true" />
      <div className="main-backdrop-glow main-backdrop-glow--bottom" aria-hidden="true" />

      <section className="main-card" aria-labelledby="main-heading">
        <header className="main-header">
          <div className="main-header-top">
            <div className="main-brand-badge">
              <LayoutGrid size={16} aria-hidden="true" />
              <span>Classwork Portal</span>
            </div>

            <button
              type="button"
              className="main-logout-btn"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut size={15} aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>

          <h1 id="main-heading" className="main-title">
            Main View
          </h1>
          <p className="main-subtitle">
            Choose a module below to open its workspace.
          </p>
        </header>

        <MainMenu onNavigate={handleNavigate} />
      </section>
    </main>
  );
}

export default App;
