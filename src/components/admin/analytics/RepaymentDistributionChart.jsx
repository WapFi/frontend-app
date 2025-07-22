import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function RepaymentDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>;
  }
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
          <Bar 
            dataKey="cash" 
            fill="#10b981" 
            name="Cash"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="plastic" 
            fill="#f59e0b" 
            name="Plastic"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="recyclables" 
            fill="#3b82f6" 
            name="Recyclables"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RepaymentDistributionChart;