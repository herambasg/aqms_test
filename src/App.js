import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainAqiCard from './components/MainAqiCard';
import SensorGrid from './components/SensorGrid';
import AqiWidget from './components/AqiWidget';
import InfoSlide from './components/InfoSlide';
import './index.css';

function App() {
  const [sensorData, setSensorData] = useState({
    temperature: '--', humidity: '--', pm25: '--', pm10: '--',
    co: '--', ozone: '--', nh3: '--', no2: '--',
  });

  const [aqi, setAqi] = useState('--');
  const [aqiCategory, setAqiCategory] = useState('Fetching...');
  const [lastUpdated, setLastUpdated] = useState('--');
  const [currentSlide, setCurrentSlide] = useState(0);

  const channelID = "2513941";
  const readAPIKey = "4M30784J6QCH8781";

  const calculateAQI = (pm25, pm10, o3, co, nh3, no2) => {
    const getSubIndex = (val, breaks, index) => {
      for (let i = 0; i < breaks.length - 1; i++) {
        if (val >= breaks[i] && val <= breaks[i + 1]) {
          return ((index[i + 1] - index[i]) / (breaks[i + 1] - breaks[i])) * (val - breaks[i]) + index[i];
        }
      }
      return 0;
    };

    const i = [0, 50, 100, 200, 300, 400, 500];
    const si = [
      getSubIndex(pm25, [0, 30, 60, 90, 120, 250, 380], i),
      getSubIndex(pm10, [0, 50, 100, 250, 350, 430, 500], i),
      getSubIndex(o3, [0, 50, 100, 168, 208, 748, 1000], i),
      getSubIndex(co, [0, 1, 2, 10, 17, 34, 50], i),
      getSubIndex(nh3, [0, 200, 400, 800, 1200, 1800, 2400], i),
      getSubIndex(no2, [0, 40, 80, 180, 280, 400, 500], i),
    ];

    const finalAqi = Math.round(Math.max(...si));
    let category = "Good";
    if (finalAqi > 400) category = "Severe";
    else if (finalAqi > 300) category = "Very Poor";
    else if (finalAqi > 200) category = "Poor";
    else if (finalAqi > 100) category = "Moderate";
    else if (finalAqi > 50) category = "Satisfactory";

    return { aqi: finalAqi, category };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${readAPIKey}`
        );
        const data = await response.json();
        if (data) {
          const vals = {
            t: parseFloat(data.field1), h: parseFloat(data.field2),
            p25: parseFloat(data.field3), p10: parseFloat(data.field4),
            o3: parseFloat(data.field5), co: parseFloat(data.field6),
            nh3: parseFloat(data.field7), no2: parseFloat(data.field8),
          };
          setSensorData({
            temperature: `${vals.t.toFixed(1)} °C`,
            humidity: `${vals.h.toFixed(1)} %`,
            pm25: `${vals.p25.toFixed(1)} µg/m³`,
            pm10: `${vals.p10.toFixed(1)} µg/m³`,
            co: `${vals.co.toFixed(2)} ppm`,
            ozone: `${(vals.o3 * 1000).toFixed(0)} ppb`,
            nh3: `${vals.nh3.toFixed(2)} ppm`,
            no2: `${vals.no2.toFixed(2)} ppm`,
          });
          const result = calculateAQI(vals.p25, vals.p10, vals.o3, vals.co, vals.nh3, vals.no2);
          setAqi(result.aqi);
          setAqiCategory(result.category);
          const now = new Date();
          setLastUpdated(`${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
        }
      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchData();
    const dataInterval = setInterval(fetchData, 30000);
    const slideInterval = setInterval(() => { setCurrentSlide((prev) => (prev === 0 ? 1 : 0)); }, 15000);
    return () => { clearInterval(dataInterval); clearInterval(slideInterval); };
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <main className="slider-wrapper">
        <div className="slides-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          <div className="slide">
            <div id="last-updated">Last Updated: {lastUpdated}</div>
            <div className="left-column">
              <AqiWidget currentAqi={aqi} />
              <MainAqiCard aqi={aqi} category={aqiCategory} />
            </div>
            <div className="right-column"><SensorGrid data={sensorData} /></div>
          </div>
          <div className="slide"><InfoSlide /></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default App;