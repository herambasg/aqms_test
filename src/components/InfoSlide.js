import React from 'react';

const InfoSlide = () => {
  return (
    <section className="info-slide-container">
      <div className="info-grid">
        <div className="info-card aqi-definition">
          <h3>What is AQI?</h3>
          <p>The <strong>Air Quality Index</strong> converts complex pollutant data into a scale from <strong>0 to 500</strong>.</p>
        </div>
        <div className="info-card aqi-table-card">
          <h3>AQI Basics Reference</h3>
          <table className="aqi-table">
            <thead>
              <tr><th>Range</th><th>Category</th><th>Health Impact</th></tr>
            </thead>
            <tbody>
              <tr className="row-good"><td>0-50</td><td>Good</td><td>Minimal</td></tr>
              <tr className="row-sat"><td>51-100</td><td>Satisfactory</td><td>Minor</td></tr>
              <tr className="row-mod"><td>101-200</td><td>Moderate</td><td>Discomfort</td></tr>
              <tr className="row-poor"><td>201-300</td><td>Poor</td><td>Health alert</td></tr>
              <tr className="row-vpoor"><td>301-400</td><td>Very Poor</td><td>Illness risk</td></tr>
              <tr className="row-severe"><td>401-500</td><td>Severe</td><td>Serious</td></tr>
            </tbody>
          </table>
        </div>
        <div className="info-card formula-card">
          <h3>How We Calculate AQI</h3>
          <div className="formula-box">
             <p>I<sub>p</sub> = [ (I<sub>hi</sub> - I<sub>lo</sub>) / (BP<sub>hi</sub> - BP<sub>lo</sub>) ] × (C<sub>p</sub> - BP<sub>lo</sub>) + I<sub>lo</sub></p>
          </div>
          <p>Final AQI is the <strong>MAXIMUM</strong> value of all sub-indices.</p>
        </div>
      </div>
    </section>
  );
};

export default InfoSlide;