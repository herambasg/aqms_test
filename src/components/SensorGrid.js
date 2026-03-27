import React from 'react';

function SensorGrid({ data }) {
  return (
    <section className="sensor-grid-container">
      <h2 className="sensor-header" style={{textAlign: 'center', color: '#0369a1'}}>
        HITAM Air Quality Parameter Readings
      </h2>
      <div className="grid">
        <div className="card"><h3>Temperature</h3><p>{data.temperature}</p></div>
        <div className="card"><h3>Humidity</h3><p>{data.humidity}</p></div>
        <div className="card"><h3>PM 2.5</h3><p>{data.pm25}</p></div>
        <div className="card"><h3>PM 10</h3><p>{data.pm10}</p></div>
        <div className="card"><h3>CO</h3><p>{data.co}</p></div>
        <div className="card"><h3>Ozone (O₃)</h3><p>{data.ozone}</p></div>
        <div className="card"><h3>Ammonia (NH₃)</h3><p>{data.nh3}</p></div>
        <div className="card"><h3>Nitrogen Dioxide (NO₂)</h3><p>{data.no2}</p></div>
      </div>
    </section>
  );
}

export default SensorGrid;