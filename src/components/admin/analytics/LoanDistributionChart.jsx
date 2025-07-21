import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', disbursed: 45, approved: 40 },
  { month: 'Feb', disbursed: 52, approved: 48 },
  { month: 'Mar', disbursed: 41, approved: 45 },
  { month: 'Apr', disbursed: 58, approved: 52 },
  { month: 'May', disbursed: 48, approved: 55 },
  { month: 'Jun', disbursed: 62, approved: 58 },
  { month: 'Jul', disbursed: 55, approved: 60 },
  { month: 'Aug', disbursed: 68, approved: 62 },
  { month: 'Sep', disbursed: 61, approved: 65 },
  { month: 'Oct', disbursed: 72, approved: 68 },
  { month: 'Nov', disbursed: 65, approved: 70 },
  { month: 'Dec', disbursed: 78, approved: 72 },
];

function LoanDistributionChart() {
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