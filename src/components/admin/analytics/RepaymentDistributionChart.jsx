import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', cash: 20, plastic: 35, recyclables: 25 },
  { month: 'Feb', cash: 25, plastic: 40, recyclables: 30 },
  { month: 'Mar', cash: 18, plastic: 32, recyclables: 28 },
  { month: 'Apr', cash: 30, plastic: 45, recyclables: 35 },
  { month: 'May', cash: 22, plastic: 38, recyclables: 32 },
  { month: 'Jun', cash: 35, plastic: 50, recyclables: 40 },
  { month: 'Jul', cash: 28, plastic: 42, recyclables: 38 },
  { month: 'Aug', cash: 40, plastic: 55, recyclables: 45 },
  { month: 'Sep', cash: 32, plastic: 48, recyclables: 42 },
  { month: 'Oct', cash: 45, plastic: 60, recyclables: 50 },
  { month: 'Nov', cash: 38, plastic: 52, recyclables: 48 },
  { month: 'Dec', cash: 50, plastic: 65, recyclables: 55 },
];

function RepaymentDistributionChart() {
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