
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function DashboardChart({
  data = [],
  trend = "up", // expects 'up' or 'down'
}) {
  // Transform data for recharts
  console.log("chart data: ", data)
  const chartData = data.map((item) => ({
    name: item.date // The date is consistent across all three API data sets.
      ? new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "N/A", // Fallback for cases with no date
    value: item.value || 0,
  }));

  // Conditionally render a message if data is empty
  if (chartData.length === 0) {
    return (
      <div className="h-10 w-full rounded-b-lg flex items-center justify-center text-sm text-gray-400">
        No data available
      </div>
    );
  }

  // Colors based on trend
  const waveColor = trend === "up" ? "#22C55E" : "#EF4444";

  return (
    <div className="h-10 w-full rounded-b-lg">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={waveColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={waveColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide={true} />
          <YAxis hide={true} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={waveColor}
            fillOpacity={1}
            fill="url(#colorWave)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardChart;