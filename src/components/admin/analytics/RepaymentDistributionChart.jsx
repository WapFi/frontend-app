

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import DateRangeSelector from "../../common/DateRangeSelector";

function RepaymentDistributionChart({ data, onDateFilter }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const formatYAxisTick = (value) => `₦${Number(value).toLocaleString()}`;

  // Custom Legend and a per-chart date selector wired to the parent
  const renderLegend = () => (
    <div>
      <p className="text-[#222] font-raleway font-semibold text-[18px] mb-2">
        Repayment Breakdown
      </p>
      <div className="flex justify-between items-center mb-10 md:mb-4">
        <div className="w-[65%]">
          <DateRangeSelector onDateChange={onDateFilter}/>
        </div>
        <div className="flex flex-col w-[30%] items-baseline-last gap-2 mt-2 mb-4">
          <div className="flex items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#2D6157",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            <span className="text-sm text-[#222222] font-medium">Cash</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#B88E00",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            <span className="text-sm text-[#222222] font-medium">
              Recyclable
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={6}
          barCategoryGap="24%"
          margin={{ top: 16, right: 24, left: 16, bottom: 16 }}
        >
          {/* DARKER grid, full box grid */}
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
          <Bar
            dataKey="cash_repayment"
            fill="#2D6157"
            name="Cash"
            barSize={24}
          />
          <Bar
            dataKey="recyclable_repayment"
            fill="#B88E00"
            name="Recyclable"
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RepaymentDistributionChart;
