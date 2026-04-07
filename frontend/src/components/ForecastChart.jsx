import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from "recharts";
import { useMemo } from "react";

const CHART_MARGIN = { top: 8, right: 8, left: 8, bottom: 0 };
const TICK_STYLE = { fill: "#71717a", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" };
const DOT_STYLE = { r: 3, fill: "#000", stroke: "#00E5FF", strokeWidth: 2 };
const ACTIVE_DOT_STYLE = { r: 5, fill: "#00E5FF", stroke: "#000", strokeWidth: 2 };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="forecast-tooltip">
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#a1a1aa", marginBottom: "0.15rem" }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: "#00E5FF", fontWeight: 500 }}>{payload[0].value.toFixed(1)}°C</div>
    </div>
  );
};

const ForecastChart = ({ forecast }) => {
  const chartData = useMemo(
    () => forecast.map((d) => {
      const date = new Date(d.date + "T00:00:00");
      return { day: date.toLocaleDateString("en-US", { weekday: "short" }), temp: d.temperature };
    }),
    [forecast]
  );

  return (
    <div data-testid="forecast-chart" style={{ width: "100%", height: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={TICK_STYLE} dy={8} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area type="monotone" dataKey="temp" stroke="#00E5FF" strokeWidth={2}
            fill="url(#cyanGradient)" dot={DOT_STYLE} activeDot={ACTIVE_DOT_STYLE} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
