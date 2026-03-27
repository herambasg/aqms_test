import React from 'react';

const InfoSlide = () => {
  return (
    <section className="info-slide-container">
      <div className="info-grid">
        
        {/* 1. What is AQI */}
        <div className="info-card aqi-definition">
          <h3>
            What is AQI?
          </h3>
          <p>The <strong>Air Quality Index</strong> is a "health thermometer" for the air. It converts complex pollutant data into a simple scale from <strong>0 to 500</strong>. Higher values mean higher pollution and greater health risks.</p>
        </div>

        {/* 2. Sensor Node Image */}
        <div className="info-card sensor-node">
          <h3>
            Our Sensor Node
          </h3>
          <div className="sensor-content">
            <div className="sensor-placeholder">
               {/* Replace with your actual image path */}
               <img src="/assets/sensor-node.png" alt="HITAM Sensor Node" />
            </div>
            <p>The <strong>HITAM Sentinel</strong>: Custom IoT hardware using laser-scattering and electrochemical sensors for real-time monitoring.</p>
          </div>
        </div>

        {/* 3. AQI Basics Table */}
        <div className="info-card aqi-table-card">
          <h3>
            AQI Basics Reference
          </h3>
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

        {/* 4. Parameters & Impact */}
        <div className="info-card parameters">
          <h3>
            Monitored Parameters
          </h3>
          <div className="param-grid">
            <div className="param-item"><strong>PM2.5/10:</strong> Tiny dust that enters lungs/blood.</div>
            <div className="param-item"><strong>CO:</strong> Reduces oxygen in blood.</div>
            <div className="param-item"><strong>NO₂:</strong> Causes respiratory inflammation.</div>
            <div className="param-item"><strong>O₃:</strong> Powerful lung irritant.</div>
          </div>
        </div>

        {/* 5. Formula & Calculation */}
        <div className="info-card formula-card">
          <h3>
            How We Calculate AQI
          </h3>
          <div className="formula-box">
             <p className="formula-text">
               I<sub>p</sub> = [ (I<sub>hi</sub> - I<sub>lo</sub>) / (BP<sub>hi</sub> - BP<sub>lo</sub>) ] × (C<sub>p</sub> - BP<sub>lo</sub>) + I<sub>lo</sub>
             </p>
          </div>
          <p className="formula-desc">We calculate sub-indices for all pollutants; the <strong>Final AQI</strong> is the maximum value among them.</p>
        </div>

      </div>
    </section>
  );
};

export default InfoSlide;