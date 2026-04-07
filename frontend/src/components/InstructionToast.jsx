const InstructionToast = () => (
  <div className="instruction-toast" data-testid="instruction-toast">
    <div style={{ padding: "0.6rem 1.2rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9999px", fontSize: "0.8rem", color: "#a1a1aa", letterSpacing: "0.02em" }}>
      Click anywhere on the globe to view weather data
    </div>
  </div>
);
export default InstructionToast;
