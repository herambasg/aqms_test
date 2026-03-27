import React, { useEffect } from 'react';

function AqiWidget() {
  return (
    <section className="aqi-comparision">
      <h2>Hyderabad Air Quality Index (Live)</h2>
      <div id="aqi-widget-container" className="aqi-widget">
        {/* The widget content will load here */}
      </div>
      <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic'}}>
        Real-time air pollution level in Hyderabad taken from aqi.in
      </p>
    </section>
  );
}

export default AqiWidget;