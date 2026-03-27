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
      <h2 className="centered-title">Hyderabad Air Quality Index (Live)</h2>
      <div id="aqi-widget-container" className="aqi-widget-inner"></div>
    </section>
  );
}

export default AqiWidget;