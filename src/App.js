import React, { useState, useEffect } from 'react';
import './App.css'; 
import Header from './components/Header';
import Footer from './components/Footer';
import AqiWidget from './components/AqiWidget';
import MainAqiCard from './components/MainAqiCard';
import SensorGrid from './components/SensorGrid';

function App() {
  const [lastUpdated, setLastUpdated] = useState('Awaiting data...');
  const [aqi, setAqi] = useState('--');
  const [aqiCategory, setAqiCategory] = useState('Awaiting Data...');
  const [sensorData, setSensorData] = useState({
    temperature: '-- °C',
    humidity: '-- %',
    pm25: '-- &mu;g/m³',
    pm10: '-- &mu;g/m³',
    co: '-- ppm',
    ozone: '-- ppb',
    nh3: '-- ppm',
    no2: '-- ppm',
  });

  const channelID = '2824554';
  const readAPIKey = 'RFES375XAD85P4TZ';

  const calculateAQI = (pm25, pm10, o3ppm, coPPM, nh3PPM, no2PPM) => {
    // Conversions to standard AQI units
    const o3UG = o3ppm * 1960;   // ppm to µg/m³
    const coMG = coPPM * 1.145;   // ppm to mg/m³
    const nh3UG = nh3PPM * 696;  // ppm to µg/m³
    const no2UG = no2PPM * 1880; // ppm to µg/m³

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
      return value > 1 ? 500 : 0;
    }

    const subIndices = [
      getSubIndex(pm25, "PM2.5"),
      getSubIndex(pm10, "PM10"),
      getSubIndex(o3UG, "Ozone"),
      getSubIndex(coMG, "CO"),
      getSubIndex(nh3UG, "NH3"),
      getSubIndex(no2UG, "NO2")
    ];

    const overall = Math.max(...subIndices);
    const category = overall <= 50 ? "Good" : overall <= 100 ? "Satisfactory" : overall <= 200 ? "Moderate" : overall <= 300 ? "Poor" : overall <= 400 ? "Very Poor" : "Severe";

    return { aqi: overall, category: `Air Quality is ${category}` };
  }

  useEffect(() => {
    const fetchThingSpeakData = async () => {
      const url = `https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${readAPIKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data === -1 || !data.field1) throw new Error("No data");

        const vals = {
          t: parseFloat(data.field1), h: parseFloat(data.field2),
          p25: parseFloat(data.field3), p10: parseFloat(data.field4),
          o3: parseFloat(data.field5), co: parseFloat(data.field6),
          nh3: parseFloat(data.field7), no2: parseFloat(data.field8)
        };

        setSensorData({
          temperature: isNaN(vals.t) ? "-- °C" : `${vals.t.toFixed(1)} °C`,
          humidity: isNaN(vals.h) ? "-- %" : `${vals.h.toFixed(1)} %`,
          pm25: isNaN(vals.p25) ? "-- &mu;g/m³" : `${vals.p25.toFixed(1)} &mu;g/m³`,
          pm10: isNaN(vals.p10) ? "-- &mu;g/m³" : `${vals.p10.toFixed(1)} &mu;g/m³`,
          co: isNaN(vals.co) ? "-- ppm" : `${vals.co.toFixed(2)} ppm`,
          ozone: isNaN(vals.o3) ? "-- ppb" : `${(vals.o3 * 1000).toFixed(0)} ppb`,
          nh3: isNaN(vals.nh3) ? "-- ppm" : `${vals.nh3.toFixed(2)} ppm`,
          no2: isNaN(vals.no2) ? "-- ppm" : `${vals.no2.toFixed(2)} ppm`
        });

        if (!isNaN(vals.p25)) {
          const { aqi, category } = calculateAQI(vals.p25, vals.p10, vals.o3, vals.co, vals.nh3, vals.no2);
          setAqi(aqi);
          setAqiCategory(category);
        }
        setLastUpdated(`Last Updated: ${new Date().toLocaleTimeString('en-IN')}`);
      } catch (error) { console.error(error); }
    };

    fetchThingSpeakData();
    const intervalId = setInterval(fetchThingSpeakData, 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <main>
        <p id="last-updated">{lastUpdated}</p>
        <div className="left-column">
          <AqiWidget />
          <MainAqiCard aqi={aqi} category={aqiCategory} />
        </div>
        <div className="right-column">
          <SensorGrid data={sensorData} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;