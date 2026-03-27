import React, { useEffect } from 'react';

function AqiWidget() {
  useEffect(() => {
    const widgetSource = document.getElementById('hyd-aqi-widget-source');
    const widgetContainer = document.getElementById('aqi-widget-container');

    if (widgetSource && widgetContainer && widgetContainer.childElementCount === 0) {
      while (widgetSource.firstChild) {
        widgetContainer.appendChild(widgetSource.firstChild);
      }
    }
  }, []);

  return (
    <section className="aqi-comparision">
      <h2 style={{fontSize: '1.5rem', paddingBottom: '3rem', textAlign: 'center', color: '#000000'}}>
        Hyderabad Air Quality Index (Live)
      </h2>
      <div id="aqi-widget-container" className="aqi-widget"></div>
      <p className="source-note">Real-time air pollution level in Hyderabad taken from aqi.in</p>
    </section>
  );
}

export default AqiWidget;