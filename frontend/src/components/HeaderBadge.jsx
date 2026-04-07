import { Globe as GlobeIcon } from "lucide-react";
const HeaderBadge = () => (
  <div className="header-badge">
    <div data-testid="app-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9999px" }}>
      <GlobeIcon size={16} strokeWidth={1.5} color="#00E5FF" />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a1a1aa" }}>
        EARTH WEATHER STATION
      </span>
    </div>
  </div>
);
export default HeaderBadge;
