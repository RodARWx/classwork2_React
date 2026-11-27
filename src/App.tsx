import { Sparkles } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import type { LoginCredentials } from './types/auth';
import './App.css';

export function App() {
  const handleLoginSubmit = (credentials: LoginCredentials) => {
    // TODO: Teammate will implement navigation/redirect to the main dashboard here.
    console.info('Login submitted:', { username: credentials.username });
  };

  return (
    <main className="login-page">
      <div className="login-backdrop-glow login-backdrop-glow--top" aria-hidden="true" />
      <div className="login-backdrop-glow login-backdrop-glow--bottom" aria-hidden="true" />

      <section className="login-card" aria-labelledby="login-heading">
        <header className="login-header">
          <div className="login-brand-badge">
            <Sparkles size={18} aria-hidden="true" />
            <span>Classwork Portal</span>
          </div>
          <h1 id="login-heading" className="login-title">
            Welcome back
          </h1>
          <p className="login-subtitle">
            Sign in with your username and password to continue.
          </p>
        </header>

        <LoginForm onLoginSubmit={handleLoginSubmit} />
      </section>
    </main>
  );
}

export default App;
