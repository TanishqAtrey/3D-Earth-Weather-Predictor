import { useState, useCallback } from "react";
import "@/App.css";
import GlobeView from "@/components/GlobeView";
import WeatherPanel from "@/components/WeatherPanel";
import LoadingIndicator from "@/components/LoadingIndicator";
import HeaderBadge from "@/components/HeaderBadge";
import InstructionToast from "@/components/InstructionToast";
import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL ?? ""}/api`;

const rootStyle = {
  width: "100vw",
  height: "100vh",
  background: "#000",
  position: "relative",
  overflow: "hidden",
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleLocationClick = useCallback(async (lat, lng) => {
    setLoading(true);
    setWeatherData(null);
    setShowInstruction(false);
    setSelectedCoords({ lat, lng });
    try {
      const response = await axios.post(`${API}/weather/point`, {
        lat: parseFloat(lat.toFixed(4)),
        lon: parseFloat(lng.toFixed(4)),
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClosePanel = useCallback(() => {
    setWeatherData(null);
    setSelectedCoords(null);
  }, []);

  return (
    <div data-testid="app-root" style={rootStyle}>
      <div className="globe-container" data-testid="globe-container">
        <GlobeView onLocationClick={handleLocationClick} selectedCoords={selectedCoords} />
      </div>
      <HeaderBadge />
      {showInstruction && <InstructionToast />}
      <div className="ui-overlay">
        {loading && <LoadingIndicator />}
        {weatherData && !loading && (
          <WeatherPanel data={weatherData} onClose={handleClosePanel} />
        )}
      </div>
    </div>
  );
}

export default App;
