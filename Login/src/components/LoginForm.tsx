import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, User } from 'lucide-react';
import type { LoginCredentials, LoginFormErrors } from '../types/auth';
import './LoginForm.css';

interface LoginFormProps {
  /**
   * Optional callback invoked when the form passes validation.
   * Teammates can connect routing/navigation here later.
   */
  onLoginSubmit?: (credentials: LoginCredentials) => void | Promise<void>;
}

function validateCredentials(credentials: LoginCredentials): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!credentials.username.trim()) {
    errors.username = 'Please enter your username.';
  } else if (credentials.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }

  if (!credentials.password) {
    errors.password = 'Please enter your password.';
  } else if (credentials.password.length < 4) {
    errors.password = 'Password must be at least 4 characters.';
  }

  return errors;
}

export function LoginForm({ onLoginSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUser, setSubmittedUser] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedUser(null);

    const credentials: LoginCredentials = {
      username: username.trim(),
      password,
    };

    const validationErrors = validateCredentials(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (onLoginSubmit) {
        await onLoginSubmit(credentials);
      }
      // Preview state only — navigation to the next view will be added by another teammate.
      setSubmittedUser(credentials.username);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-field">
        <label className="login-label" htmlFor="login-username">
          Username
        </label>
        <div className={`login-input-wrapper ${errors.username ? 'has-error' : ''}`}>
          <User className="login-input-icon" size={18} aria-hidden="true" />
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              if (errors.username) {
                setErrors((prev) => ({ ...prev, username: undefined }));
              }
            }}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
        </div>
        {errors.username && (
          <p id="username-error" className="login-error" role="alert">
            {errors.username}
          </p>
        )}
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="login-password">
          Password
        </label>
        <div className={`login-input-wrapper ${errors.password ? 'has-error' : ''}`}>
          <Lock className="login-input-icon" size={18} aria-hidden="true" />
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            className="login-toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="login-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
        <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
        <ArrowRight className="login-btn-arrow" size={18} aria-hidden="true" />
      </button>

      {submittedUser && (
        <div className="login-preview-banner" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>
            Welcome, <strong>{submittedUser}</strong>! Ready for navigation integration.
          </span>
        </div>
      )}
    </form>
  );
}
