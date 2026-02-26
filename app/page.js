// app/page.js
'use client';
import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import DonationForm from '../components/DonationForm';
import RegisterForm from '../components/RegisterForm';

export default function HomePage() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div>
      {!token ? (
        showRegister ? (
          <>
            <RegisterForm onRegister={() => setShowRegister(false)} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onLogin={setToken} />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </>
        )
      ) : (
        <>
          <DonationForm token={token} />
          <button onClick={() => setToken(null)}>Logout</button>
        </>
      )}
    </div>
  );
}
