"use client";
import { useState } from 'react';
import './AuthForm.css';

export default function LoginForm({ onLogin, handleShowRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        onLogin(data.token);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      setMessage('Error: ' + error.message);
    }
  };

  return (


      <div className="auth-container">
      <video autoPlay muted loop className="auth-bg-video">
        <source src="/background121.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Login</h2>

      <label className="auth-form__label" htmlFor="email">
        Email
        <input
          className="auth-form__input"
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          aria-describedby="emailHelp"
        />
      </label>

      <label className="auth-form__label" htmlFor="password">
        Password
        <input
          className="auth-form__input"
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          aria-describedby="passwordHelp"
        />
      </label>

      <button
        className="auth-form__button"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {message && (
        <p className="auth-form__message" role="alert" aria-live="assertive">
          {message}
        </p>
      )}

      {/* Added Register link below the message */}
      <p className="auth-form__switch-text">
        Don’t have an account?{' '}
        <button
          type="button"
          className="auth-form__link"
          onClick={handleShowRegister}
          aria-label="Register"
        >
          Register here
        </button>
      </p>
    </form>
  </div>
  );
}
