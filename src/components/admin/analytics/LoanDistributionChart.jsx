import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function LoanDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>;
  }
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month"
            axisLine={false}
            tickLine={false}
            fontSize={12}
            fill="#6b7280"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            fontSize={12}
            fill="#6b7280"
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="disbursed" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="Disbursed"
          />
          <Line 
            type="monotone" 
            dataKey="approved" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            name="Approved"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LoanDistributionChart;