const MetricCard = ({ testId, icon, label, value, colSpan }) => (
  <div className="metric-card" data-testid={testId} style={colSpan ? { gridColumn: "1 / -1" } : undefined}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.5rem" }}>
      {icon}
      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a" }}>
        {label}
      </span>
    </div>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", color: "#ffffff" }}>
      {value}
    </div>
  </div>
);
export default MetricCard;
