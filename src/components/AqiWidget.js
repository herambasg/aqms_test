import React, { useEffect } from 'react';

function AqiWidget() {
  useEffect(() => {
    // 1. Find the container within our React component
    const widgetContainer = document.getElementById('aqi-widget-container');

    if (widgetContainer) {
      // 2. Clear existing content to prevent duplicate widgets on re-renders
      widgetContainer.innerHTML = '';

      // 3. Create the widget div with the payload you provided
      const widgetDiv = document.createElement('div');
      widgetDiv.setAttribute(
        'data-aqi-widget-payload',
        'https://www.aqi.in/widget?p=eyJvX3ciOjEsIm9fd190X3UiOiJjIiwib190IjoibCIsIm9fYV9zIjoiaW4iLCJ3X3RfaSI6MSwibHMiOlt7InMiOiJpbmRpYS90ZWxhbmdhbmEvaHlkZXJhYmFkL2tvbXBhbGx5In1dfQ=='
      );

      // 4. Create the script tag to load the widget functionality
      const script = document.createElement('script');
      script.src = "https://www.aqi.in/assets/scripts/widget.min.js";
      script.async = true;

      // 5. Append both the div and the script to the container
      widgetContainer.appendChild(widgetDiv);
      widgetContainer.appendChild(script);
    }
  }, []); // The empty array ensures this runs only once after the component mounts.

  return (
    <section className="aqi-comparision">
      <h2>Hyderabad Air Quality Index (Live)</h2>
      {/* This container will now be dynamically populated by the useEffect hook 
          using the aqi.in widget script.
      */}
      <div id="aqi-widget-container" className="aqi-widget"></div>
    </section>
  );
}

export default AqiWidget;