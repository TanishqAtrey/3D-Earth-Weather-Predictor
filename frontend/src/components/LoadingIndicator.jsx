const LoadingIndicator = () => (
  <div data-testid="loading-indicator" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", pointerEvents: "auto" }}>
    <svg className="loader-ring" width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="24" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="16 8" strokeLinecap="round" />
      <circle cx="28" cy="28" r="3" fill="#00E5FF" opacity="0.6" />
    </svg>
    <span className="loader-pulse" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#71717a" }}>
      ACQUIRING_TELEMETRY...
    </span>
  </div>
);
export default LoadingIndicator;
