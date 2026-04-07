import { X, MapPin, Cpu } from "lucide-react";
import { Droplets, Wind, CloudRain } from "lucide-react";
import ForecastChart from "@/components/ForecastChart";
import MetricCard from "@/components/MetricCard";

const PanelHeader = ({ location, onClose }) => (
  <div style={{ padding: "1.5rem 1.5rem 0" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
          <MapPin size={14} strokeWidth={1.5} color="#00E5FF" />
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#71717a" }}>
            WEATHER STATION
          </span>
        </div>
        <h1 data-testid="city-name" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#ffffff", lineHeight: 1.2 }}>
          {location.city}
        </h1>
        {location.country && (
          <span data-testid="country-name" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.8rem", color: "#a1a1aa" }}>
            {location.country}
          </span>
        )}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#52525b", marginTop: "0.25rem" }}>
          {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </div>
      </div>
      <button data-testid="close-panel-btn" className="close-btn" onClick={onClose}
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.4rem", cursor: "pointer", color: "#a1a1aa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  </div>
);

const HeroTemperature = ({ temperature }) => (
  <div style={{ padding: "1.25rem 1.5rem" }}>
    <div data-testid="temp-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "4rem", fontWeight: 300, letterSpacing: "-0.05em", color: "#ffffff", lineHeight: 1 }}>
      {temperature.toFixed(1)}
      <span style={{ fontSize: "1.5rem", color: "#71717a", fontWeight: 400, marginLeft: "0.1rem" }}>°C</span>
    </div>
  </div>
);

const MetricsGrid = ({ current }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0 1.5rem" }}>
    <MetricCard testId="humidity-value" icon={<Droplets size={16} strokeWidth={1.5} color="#00E5FF" />} label="HUMIDITY" value={`${current.humidity}%`} />
    <MetricCard testId="wind-speed" icon={<Wind size={16} strokeWidth={1.5} color="#00E5FF" />} label="WIND" value={`${current.wind_speed} km/h`} />
    <MetricCard testId="precipitation-value" icon={<CloudRain size={16} strokeWidth={1.5} color="#00E5FF" />} label="PRECIP" value={`${current.precipitation} mm`} colSpan />
  </div>
);

const ForecastSection = ({ forecast }) => (
  <div style={{ padding: "1.25rem 1.5rem 0" }}>
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#71717a", marginBottom: "0.75rem" }}>
      TEMPERATURE FORECAST
    </div>
    <ForecastChart forecast={forecast} />
  </div>
);

const ModelInfoBadges = ({ modelInfo }) => {
  if (!modelInfo) return null;
  return (
    <div style={{ padding: "0.75rem 1.5rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <div className="model-tag" data-testid="model-info">
          <Cpu size={10} strokeWidth={1.5} />
          {modelInfo.model}
        </div>
        {modelInfo.mae !== null && <div className="model-tag">MAE: {modelInfo.mae}°</div>}
        {modelInfo.training_samples && <div className="model-tag">{modelInfo.training_samples} samples</div>}
      </div>
    </div>
  );
};

const WeatherPanel = ({ data, onClose }) => {
  const { location, current, forecast, model_info } = data;
  return (
    <div className="weather-panel" data-testid="weather-panel">
      <PanelHeader location={location} onClose={onClose} />
      <HeroTemperature temperature={current.temperature} />
      <MetricsGrid current={current} />
      <ForecastSection forecast={forecast} />
      <ModelInfoBadges modelInfo={model_info} />
    </div>
  );
};

export default WeatherPanel;
