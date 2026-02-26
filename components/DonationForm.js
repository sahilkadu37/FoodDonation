import { useState } from 'react';
import './DonationForm.css';

export default function DonationForm({ token }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantity: '',
    expiresAt: '',
    contactNumber: '',
    area: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false); 

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.contactNumber.match(/^\d{10}$/)) {
      setMessage('Please enter a valid 10-digit contact number.');
      return;
    }

    if (!form.title || !form.description || !form.area) {
      setMessage('Please fill all required fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Donation submitted successfully!');
        setForm({
          title: '',
          description: '',
          quantity: '',
          expiresAt: '',
          contactNumber: '',
          area: '',
        });
        setShowCertificate(true); 
      } else {
        setMessage(data.message || 'Submission failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* About Section */}
      <div className="about-section fade-in">
        <h2>About FoodLink</h2>
        <p>
      FoodLink connects generous donors with people in need by facilitating easy and secure food donations. Join us in fighting hunger and reducing food waste in our community!
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <img
          src="/donate2.jpg"
          alt="Donate Food"
          className="donation-image"
        />
      </div>

      {/* Donation Form */}
      <form className="donation-form fade-in" onSubmit={handleSubmit} aria-label="Food Donation Form">
        <h2>Food Donation</h2>

        <label>
          Title<span className="required">*</span>:
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter title"
          />
        </label>

        <label>
          Description<span className="required">*</span>:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Describe the food"
          />
        </label>

        <label>
          Quantity (approximate amount):
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            placeholder="e.g., 5 packets"
          />
        </label>

        <label>
          Expiry Date:
          <input
            type="date"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Number<span className="required">*</span>:
          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            required
            placeholder="10-digit phone number"
          />
        </label>

        <label>
          Area<span className="required">*</span>:
          <input
            type="text"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            placeholder="Your location/area"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Donation'}
        </button>

        {message && (
          <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>

      {/* 🎁 Certificate Modal */}
      {showCertificate && (
        <div className="certificate-modal fade-in">
          <div className="certificate-box">
            <h3>🎉 Thank You for Your Donation!</h3>
            <p>
              “No one has ever become poor by giving.”<br />
             
            </p>
            <p className="cert-signature">~ FoodLink Team</p>
            <button onClick={() => setShowCertificate(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}

 <footer className="fade-in">
  <p>© {new Date().getFullYear()}FoodLink. All rights reserved.</p>
  <p>
    Email: kadu.ashok@bcah.christuniversity.in | Phone: +91 7737824141
     Email: om.samal@bcah.christuniversity.in  | Phone: +91 92843 58771
    <br/>
    <a href="/impact" style={{ color: '#2980b9', fontWeight: 'bold' }}>See How Your Donations Help →</a>
  </p>
</footer>

    </>
  );
}
