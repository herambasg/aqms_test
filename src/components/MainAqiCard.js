import React from 'react';

function MainAqiCard({ aqi, category }) {
  return (
    <section className="main-aqi-card">
      <h2 style={{fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', color: '#000000'}}>
        HITAM Air Quality Index (Live)
      </h2>
      <p id="calculated-aqi">{aqi}</p>
      <p id="aqi-category">{category}</p>
    </section>
  );
}

export default MainAqiCard;