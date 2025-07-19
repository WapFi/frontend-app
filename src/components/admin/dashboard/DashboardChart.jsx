import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

function DashboardChart({ data = [], chartType = 'loans' }) {
	// Transform data to match Recharts format
	const chartData = data.map((item, index) => ({
		name: chartType === 'loans' ? 
			(item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
			 item.month ? new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }) : 
			 `Day ${index + 1}`) :
			`Point ${index + 1}`,
		uv: item.value || 0
	}));

	// If no data, use fallback data
	const fallbackData = [
		{ name: "Mon", uv: 4000 },
		{ name: "Tue", uv: 3000 },
		{ name: "Wed", uv: 2000 },
		{ name: "Thu", uv: 2780 },
		{ name: "Fri", uv: 1890 },
		{ name: "Sat", uv: 2390 },
		{ name: "Sun", uv: 3490 }
	];

	const finalData = chartData.length > 0 ? chartData : fallbackData;
	return (
		<div className="h-10">
			<ResponsiveContainer width="100%" height="100%">
			<AreaChart width={100} height={100} data={finalData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
					</linearGradient>
				</defs>
				<XAxis dataKey="name" hide={true} />
				<YAxis hide={true} />
				<Tooltip />
				<Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
				</AreaChart>

			</ResponsiveContainer>
		</div>
	);
}

export default DashboardChart;