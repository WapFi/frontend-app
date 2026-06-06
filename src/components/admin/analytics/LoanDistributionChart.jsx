
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import DateRangeSelector from "../../common/DateRangeSelector";

function LoanDistributionChart({ data, onDateFilter }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const formatYAxisTick = (value) => `₦${Number(value).toLocaleString()}`;

  // Custom Legend circles and a per-chart date selector wired to the parent
  const renderLegend = () => (
    <div>
      <p className="text-[#222] font-raleway font-semibold text-[18px] mb-2">
        Loan Distribution Over Time
      </p>
      <div className="flex justify-between gap-2 items-center w-full mb-10 md:mb-4">
        <div className="w-[65%]">
          <DateRangeSelector onDateChange={onDateFilter} />
        </div>
        <div className="flex flex-col mt-2 w-[30%] mb-4 items-baseline-last">
          <div className="flex items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#67385B",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            <p className="text-sm text-[#222222] font-medium">New Loans</p>
          </div>
          <div className="flex items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#6FA49C",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            <p className="text-sm text-[#222222] font-medium">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 16, right: 24, left: 16, bottom: 16 }}
        >
          {/* box grid, pronounced lines */}
          <CartesianGrid
            stroke="#bbb"
            strokeDasharray="0"
            vertical
            horizontal
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            fontSize={14}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={14}
            width={56}
            tickFormatter={formatYAxisTick}
            tick={{ fill: "#484747", fontWeight: 500 }}
          />
          <Tooltip
            formatter={(value) => `₦${Number(value).toLocaleString()}`}
            contentStyle={{ borderRadius: 8, boxShadow: "0 2px 16px #bbb2" }}
          />
          <Legend content={renderLegend} verticalAlign="top" align="right" />
          <Line
            type="monotone"
            dataKey="new_loans"
            stroke="#67385B"
            strokeWidth={3}
            dot={{ fill: "#fff", r: 6, stroke: "#67385B", strokeWidth: 1 }}
            activeDot={{ r: 8 }}
            name="New Loans"
          />
          <Line
            type="monotone"
            dataKey="overdue_loans"
            stroke="#6FA49C"
            strokeWidth={3}
            dot={{ fill: "#fff", r: 6, stroke: "#6FA49C", strokeWidth: 1 }}
            activeDot={{ r: 8 }}
            name="Overdue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LoanDistributionChart;
