'use client';

import { useEffect, useState } from 'react';

export default function DonationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchHistory() {
      try {
        const res = await fetch('/api/donations/history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch donation history');

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [token]);

  if (loading) return <p>Loading donation history...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Your Donation History</h1>

      {history.length === 0 && <p>You have not made any donations yet.</p>}

      <ul>
        {history.map((donation) => (
          <li key={donation._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h2>{donation.title}</h2>
            <p><strong>Description:</strong> {donation.description}</p>
            <p><strong>Quantity:</strong> {donation.quantity || 'Not specified'}</p>
            <p><strong>Expires At:</strong> {donation.expiresAt ? new Date(donation.expiresAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Contact Number:</strong> {donation.contactNumber}</p>
            <p><strong>Area:</strong> {donation.area}</p>
            <p><em>Donated on: {new Date(donation.createdAt).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
}