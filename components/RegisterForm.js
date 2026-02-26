import { useState } from 'react';
import './AuthForm.css';

export default function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage('Registration successful! Please login.');
        onRegister();
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      setMessage('Error: ' + error.message);
    }
  };

  return (

    <div className="auth-container">
      <video autoPlay muted loop className="auth-bg-video">
        <source src="/background1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Register</h2>

      <label className="auth-form__label" htmlFor="name">
        Name
        <input
          className="auth-form__input"
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
      </label>

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
          autoComplete="new-password"
        />
      </label>

      <button
        className="auth-form__button"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      {message && (
        <p className="auth-form__message" role="alert" aria-live="assertive">
          {message}
        </p>
      )}
    </form>
    </div>



  );
}
