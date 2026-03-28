import React from 'react';
import logo from '../assets/Hitam logo.png';
import Node_1 from '../assets/Node_1.jpeg';
import Node_2 from '../assets/Node_2.jpeg';

const InfoSlide = () => {
  return (
    <section className="info-slide-container">
      <div className="info-grid">
        
        {/* 1. Top Left */}
        <div className="info-card aqi-definition">
          <h3>What is AQI?</h3>
          <p>The <strong>Air Quality Index</strong> is a "health thermometer" for the air. It converts complex pollutant data into a simple scale from <strong>0 to 500</strong>. Higher values mean higher pollution and greater health risks.</p>
        </div>

        {/* 2. Top Right */}
        <div className="info-card parameters">
          <h3>Monitored Parameters</h3>
          <div className="param-grid">
            <div className="param-item"><strong>PM2.5/10:</strong> Tiny dust that enters lungs/blood.</div>
            <div className="param-item"><strong>CO:</strong> Reduces oxygen in blood.</div>
            <div className="param-item"><strong>NO₂:</strong> Causes respiratory inflammation.</div>
            <div className="param-item"><strong>O₃:</strong> Powerful lung irritant.</div>
          </div>
        </div>

        {/* 3. Middle Full-Width Card */}
        <div className="info-card sensor-node">
          <h3>Our Sensor Node</h3>
          <div className="sensor-content">
            <div className="sensor-dual-images">
              <div className="sensor-image-wrapper">
                <img src={Node_1} alt="Node Exterior" />
              </div>
              <div className="sensor-image-wrapper">
                <img src={Node_2} alt="Node Placement" />
              </div>
            </div>
            <div className="sensor-description">
              <p>
                Located in the <strong>1st Floor Lobby</strong> and facing outdoors, this custom-built Air Quality Monitoring Station runs 24/7 with constant power and internet for real-time air quality updates.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Bottom Left */}
        <div className="info-card formula-card">
          <h3>How We Calculate AQI</h3>
          <div className="formula-box">
            <p className="formula-text">
              I<sub>p</sub> = [ (I<sub>hi</sub> - I<sub>lo</sub>) / (BP<sub>hi</sub> - BP<sub>lo</sub>) ] × (C<sub>p</sub> - BP<sub>lo</sub>) + I<sub>lo</sub>
            </p>
          </div>
          
          {/* Brief Legend */}
          <div style={{ fontSize: '0.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', color: '#475569', marginBottom: '10px' }}>
            <span><strong>I<sub>p</sub>:</strong> Resulting AQI</span>
            <span><strong>C<sub>p</sub>:</strong> Sensor Reading</span>
            <span><strong>BP<sub>hi/lo</sub>:</strong> Table Breakpoints</span>
            <span><strong>I<sub>hi/lo</sub>:</strong> AQI Scale Limits</span>
          </div>

          <p className="formula-desc">We calculate sub-indices for all pollutants; the <strong>Final AQI</strong> is the maximum value among them.</p>
        </div>

        {/* 5. Bottom Right */}
        <div className="info-card aqi-table-card">
          <h3>AQI Basics Reference</h3>
          <table className="aqi-table">
            <thead>
              <tr>
                <th>Range</th>
                <th>Category</th>
                <th>Health Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-good"><td>0 - 50</td><td>Good</td><td>Minimal impact</td></tr>
              <tr className="row-sat"><td>51 - 100</td><td>Satisfactory</td><td>Minor breathing discomfort</td></tr>
              <tr className="row-mod"><td>101 - 200</td><td>Moderate</td><td>Discomfort to children/elderly</td></tr>
              <tr className="row-poor"><td>201 - 300</td><td>Poor</td><td>Health alert for everyone</td></tr>
              <tr className="row-vpoor"><td>301 - 400</td><td>Very Poor</td><td>Respiratory illness risk</td></tr>
              <tr className="row-severe"><td>401 - 500</td><td>Severe</td><td>Serious health impacts</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};

export default InfoSlide;