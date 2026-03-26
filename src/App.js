import React, { useState, useEffect } from 'react';
import './App.css'; 
import Header from './components/Header';
import Footer from './components/Footer';
import AqiWidget from './components/AqiWidget';
import MainAqiCard from './components/MainAqiCard';
import SensorGrid from './components/SensorGrid';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('Awaiting data...');
  const [aqi, setAqi] = useState('--');
  const [aqiCategory, setAqiCategory] = useState('Awaiting Data...');
  const [sensorData, setSensorData] = useState({
    temperature: '-- °C', humidity: '-- %',
    pm25: '-- µg/m³', pm10: '-- µg/m³',
    co: '-- ppm', ozone: '-- ppb',
    nh3: '-- ppm', no2: '-- ppm',
  });

  const channelID = '2824554';
  const readAPIKey = 'RFES375XAD85P4TZ';

  const calculateAQI = (pm25, pm10, o3ppm, coPPM, nh3PPM, no2PPM) => {
    const o3UG = o3ppm * 1960;   
    const coMG = coPPM * 1.145;   
    const nh3UG = nh3PPM * 696;  
    const no2UG = no2PPM * 1880; 

    const breakpoints = {
      "PM2.5": [[0,30,0,50],[31,60,51,100],[61,90,101,200],[91,120,201,300],[121,250,301,400],[251,500,401,500]],
      "PM10": [[0,50,0,50],[51,100,51,100],[101,250,101,200],[251,350,201,300],[351,430,301,400],[431,500,401,500]],
      "Ozone": [[0,50,0,50],[51,100,51,100],[101,168,101,200],[169,208,201,300],[209,748,301,400],[749,1000,401,500]],
      "CO": [[0,1,0,50],[1.1,2,51,100],[2.1,10,101,200],[11,17,201,300],[18,34,301,400],[35,100,401,500]],
      "NH3": [[0,200,0,50],[201,400,51,100],[401,800,101,200],[801,1200,201,300],[1201,1800,301,400],[1801,3000,401,500]],
      "NO2": [[0,40,0,50],[41,80,51,100],[81,180,101,200],[181,280,201,300],[281,400,301,400],[401,1000,401,500]]
    };

    const getSubIndex = (value, pollutant) => {
      if (isNaN(value) || value < 0) return 0;
      const poll_breakpoints = breakpoints[pollutant];
      for (const [Clow, Chigh, Ilow, Ihigh] of poll_breakpoints) {
        if (value >= Clow && value <= Chigh) {
          return Math.round(((Ihigh - Ilow) / (Chigh - Clow)) * (value - Clow) + Ilow);
        }
      }
      return value > 0 ? 500 : 0;
    }

    const subIndices = [
      getSubIndex(pm25, "PM2.5"), getSubIndex(pm10, "PM10"),
      getSubIndex(o3UG, "Ozone"), getSubIndex(coMG, "CO"),
      getSubIndex(nh3UG, "NH3"), getSubIndex(no2UG, "NO2")
    ].filter(v => !isNaN(v));

    const overall = Math.max(...subIndices);
    const category = overall <= 50 ? "Good" : overall <= 100 ? "Satisfactory" : overall <= 200 ? "Moderate" : overall <= 300 ? "Poor" : overall <= 400 ? "Very Poor" : "Severe";
    return { aqi: overall, category: `Air Quality is ${category}` };
  };

  useEffect(() => {
    const fetchThingSpeakData = async () => {
      try {
        const response = await fetch(`https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${readAPIKey}`);
        const data = await response.json();
        if (data === -1 || !data.field1) return;

        const vals = {
          t: parseFloat(data.field1), h: parseFloat(data.field2),
          p25: parseFloat(data.field3), p10: parseFloat(data.field4),
          o3: parseFloat(data.field5), co: parseFloat(data.field6),
          nh3: parseFloat(data.field7), no2: parseFloat(data.field8)
        };

        setSensorData({
          temperature: `${vals.t.toFixed(1)} °C`, humidity: `${vals.h.toFixed(1)} %`,
          pm25: `${vals.p25.toFixed(1)} µg/m³`, pm10: `${vals.p10.toFixed(1)} µg/m³`,
          co: `${vals.co.toFixed(2)} ppm`, ozone: `${(vals.o3 * 1000).toFixed(0)} ppb`,
          nh3: `${vals.nh3.toFixed(2)} ppm`, no2: `${vals.no2.toFixed(2)} ppm`
        });

        const result = calculateAQI(vals.p25, vals.p10, vals.o3, vals.co, vals.nh3, vals.no2);
        setAqi(result.aqi);
        setAqiCategory(result.category);
        setLastUpdated(`Last Updated: ${new Date().toLocaleTimeString('en-IN')}`);
      } catch (e) { console.error(e); }
    };

    fetchThingSpeakData();
    const dInt = setInterval(fetchThingSpeakData, 15000);
    const sInt = setInterval(() => setCurrentSlide(p => (p === 0 ? 1 : 0)), 25000);

    return () => { clearInterval(dInt); clearInterval(sInt); };
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="slider-wrapper">
        <div className={`slides-track slide-position-${currentSlide}`}>
          <main className="slide">
            <p id="last-updated">{lastUpdated}</p>
            <div className="left-column">
              <AqiWidget />
              <MainAqiCard aqi={aqi} category={aqiCategory} />
            </div>
            <div className="right-column">
              <SensorGrid data={sensorData} />
            </div>
          </main>
          <main className="slide info-slide">
             <section className="edu-section">
                <h2>Understanding Air Quality Index (AQI)</h2>
                <div className="edu-grid">
                  <div className="edu-card">
                    <h3>What is AQI?</h3>
                    <p>Standardized system to report daily air quality and its associated health effects.</p>
                  </div>
                  <div className="edu-card">
                    <h3>Pollutants</h3>
                    <ul>
                      <li><strong>PM:</strong> Dust particles</li>
                      <li><strong>O₃ & CO:</strong> Smog & Emissions</li>
                      <li><strong>NO₂ & NH₃:</strong> Chemical Gases</li>
                    </ul>
                  </div>
                  <div className="edu-card full-width">
                    <h3>Health Scale</h3>
                    <div className="aqi-scale-bar">
                       <div className="scale-item good">0-50</div>
                       <div className="scale-item satisfactory">51-100</div>
                       <div className="scale-item moderate">101-200</div>
                       <div className="scale-item poor">201-300</div>
                       <div className="scale-item very-poor">301-400</div>
                       <div className="scale-item severe">401+</div>
                    </div>
                  </div>
                </div>
             </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default App;