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
  });

  const channelID = '2824554';
  const readAPIKey = 'RFES375XAD85P4TZ';

  // FIX: Added 'ozone' and 'co' to the parameters list
  const calculateAQI = (pm25, pm10, ozone, co) => {
    const breakpoints = {
      "PM2.5": [[0,30,0,50],[31,60,51,100],[61,90,101,200],[91,120,201,300],[121,250,301,400],[251,Infinity,401,500]],
      "PM10": [[0,50,0,50],[51,100,51,100],[101,250,101,200],[251,350,201,300],[351,430,301,400],[431,Infinity,401,500]],
      "Ozone": [[0,50,0,50],[51,100,51,100],[101,168,101,200],[169,208,201,300],[209,748,301,400],[749,Infinity,401,500]],
      "CO": [[0,1,0,50],[1.1,2,51,100],[2.1,10,101,200],[11,17,201,300],[18,34,301,400],[35,Infinity,401,500]]
    };

    const getSubIndex = (value, pollutant) => {
      if (isNaN(value)) return 0;
      const poll_breakpoints = breakpoints[pollutant];
      for (const [Clow, Chigh, Ilow, Ihigh] of poll_breakpoints) {
        if (value >= Clow && value <= Chigh) {
          return Math.round(((Ihigh - Ilow) / (Chigh - Clow)) * (value - Clow) + Ilow);
        }
      }
      return 0;
    }

    const aqi25 = getSubIndex(pm25, "PM2.5");
    const aqi10 = getSubIndex(pm10, "PM10");
    const aqiOzone = getSubIndex(ozone, "Ozone"); // Now defined via parameters
    const aqiCO = getSubIndex(co, "CO");          // Now defined via parameters

    const overall = Math.max(aqi25, aqi10, aqiOzone, aqiCO);
    
    const category = overall <= 50 ? "Good" :
                     overall <= 100 ? "Moderate" :
                     overall <= 200 ? "Poor" :
                     overall <= 300 ? "Unhealthy" :
                     overall <= 400 ? "Severe" :
                     "Hazardous";
    return { aqi: overall, category: `Air Quality is ${category}` };
  }

  useEffect(() => {
    const fetchThingSpeakData = async () => {
      const url = `https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${readAPIKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();

        if (data === -1 || !data.field1) throw new Error("Channel is empty or has no data.");

        const temp = parseFloat(data.field1);
        const humidity = parseFloat(data.field2);
        const pm25 = parseFloat(data.field3);
        const pm10 = parseFloat(data.field4);
        const ozone = parseFloat(data.field5); // Ensure these match your ThingSpeak fields
        const co = parseFloat(data.field6);

        setSensorData({
          temperature: isNaN(temp) ? "-- °C" : `${temp.toFixed(2)} °C`,
          humidity: isNaN(humidity) ? "-- %" : `${humidity.toFixed(2)} %`,
          pm25: isNaN(pm25) ? "-- &mu;g/m³" : `${pm25.toFixed(2)} &mu;g/m³`,
          pm10: isNaN(pm10) ? "-- &mu;g/m³" : `${pm10.toFixed(2)} &mu;g/m³`,
          co: isNaN(co) ? "-- ppm" : `${co.toFixed(2)} ppm`,
          ozone: isNaN(ozone) ? "-- ppb" : `${ozone.toFixed(2)} ppb`
        });

        // FIX: Passing ozone and co to the calculation function
        if (!isNaN(pm25) || !isNaN(pm10) || !isNaN(ozone) || !isNaN(co)) {
          const { aqi, category } = calculateAQI(pm25, pm10, ozone, co);
          setAqi(aqi);
          setAqiCategory(category);
        } else {
          setAqi("--");
          setAqiCategory("Awaiting Data...");
        }

        setLastUpdated(`Last Updated: ${new Date().toLocaleString('en-IN', { timeStyle: 'medium', dateStyle: 'long', hour12: true })}`);

      } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
        setAqiCategory("Failed to load data.");
      }
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