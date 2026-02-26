import './DonationImpact.css';

export default function DonationImpact() {
  return (
    <div className="impact-container fade-in">
      <header className="impact-header">
        <h1>Making Every Meal Count</h1>
        <p>Your one donation is the first mile in someone’s day</p>
      </header>

      <section className="impact-stats">
        <div className="stat-card">
          <h2>1,200+</h2>
          <p>Meals Delivered Across Cities</p>
        </div>
        <div className="stat-card">
          <h2>800+</h2>
          <p>Families Supported with Essentials</p>
        </div>
        <div className="stat-card">
          <h2>300+</h2>
          <p>Volunteers in Action</p>
        </div>
      </section>

      <section className="impact-gallery">
        <h2>Impact In Action</h2>
        <div className="gallery-grid">
          <img src="/donates.jpeg" alt="Volunteers Distributing Food" />
          <img src="/donates1.jpeg" alt="Family Receiving Food Package" />
          <img src="/donates3.jpeg" alt="Community Meal Event" />
        </div>
      </section>

      <section className="impact-quote">
        <h2>Real Stories</h2>
        <blockquote>
         FoodLink’s support gave us hope when we had nowhere else to turn.”
          <footer>– pune, lavasa</footer>
        </blockquote>
      </section>

      <section className="impact-cta">
        <h2>Continue the Mission</h2>
        <p>Your next donation could bring relief to another family today. Let’s make it happen together.</p>
        <a href="/" className="btn-donate">Donate Again</a>
      </section>

      <footer className="impact-footer">
        <p>© {new Date().getFullYear()} FoodLink.</p>
        <p>Contact: kadu.ashok@bcah.christuniversity.in | +91 7737824141</p>
        <p>Contact:om.samal@bcah.christuniversity.in   |91 92843 58771</p>
      </footer>
    </div>
  );
}
