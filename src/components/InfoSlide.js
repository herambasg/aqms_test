import React from 'react';

const InfoSlide = () => {
  return (
    <section className="info-slide-container">
      <div className="info-grid">
        <div className="info-card aqi-definition">
          <h3>What is AQI?</h3>
          <p>The <strong>Air Quality Index</strong> converts complex data into a simple scale from <strong>0 to 500</strong>.</p>
        </div>
        <div className="info-card aqi-table-card">
          <h3>AQI Basics Reference</h3>
          <table className="aqi-table">
            <thead>
              <tr><th>Range</th><th>Category</th><th>Impact</th></tr>
            </thead>
            <tbody>
              <tr className="row-good"><td>0-50</td><td>Good</td><td>Minimal</td></tr>
              <tr className="row-sat"><td>51-100</td><td>Satisfactory</td><td>Minor</td></tr>
              <tr className="row-mod"><td>101-200</td><td>Moderate</td><td>Discomfort</td></tr>
              <tr className="row-poor"><td>201-300</td><td>Poor</td><td>Alert</td></tr>
              <tr className="row-vpoor"><td>301-400</td><td>Very Poor</td><td>Risk</td></tr>
              <tr className="row-severe"><td>401-500</td><td>Severe</td><td>Serious</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
export default InfoSlide;