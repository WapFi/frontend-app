import { useState, useEffect } from "react";
import DashboardChart from "./DashboardChart";
import { getDashboardStats } from "../../../api/adminApi";

function DashboardStats() {
	const [stats, setStats] = useState([
		{
			label: "Total Loans Disbursed",
			value: "₦ 0",
			change: "0%",
			trend: "up",
			color: "green"
		},
		{
			label: "Active Users",
			value: "0",
			change: "0%",
			trend: "up", 
			color: "blue"
		},
		{
			label: "Repayment Rate",
			value: "0%",
			change: "0%",
			trend: "down",
			color: "red"
		}
	]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardStats = async () => {
			try {
				setLoading(true);
				const response = await getDashboardStats();
				
				if (response.status && response.data) {
					const dashboardData = response.data;
					
					// Format the stats with real data
					const formattedStats = [
						{
							label: "Total Loans Disbursed",
							value: `₦ ${dashboardData.total_loans_disbursed?.toLocaleString() || '0'}`,
							change: "+0%", // You can calculate this from historical data
							trend: "up",
							color: "green"
						},
						{
							label: "Active Users",
							value: dashboardData.active_users?.toLocaleString() || '0',
							change: "+0%", // You can calculate this from historical data
							trend: "up", 
							color: "blue"
						},
						{
							label: "Repayment Rate",
							value: `${dashboardData.repayment_rate?.toFixed(1) || '0'}%`,
							change: "0%", // You can calculate this from historical data
							trend: dashboardData.repayment_rate > 80 ? "up" : "down",
							color: dashboardData.repayment_rate > 80 ? "green" : "red"
						}
					];
					
					setStats(formattedStats);
				}
			} catch (err) {
				console.error('Error fetching dashboard stats:', err);
				setError('Failed to load dashboard statistics');
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardStats();
	}, []);

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<p className="text-md mb-4 text-gray-600">Overview</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="bg-white rounded-lg shadow animate-pulse">
							<div className="p-6">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
								<div className="h-10 bg-gray-200 rounded"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<p className="text-md mb-4 text-gray-600">Overview</p>
				<div className="text-center py-8">
					<p className="text-red-600">{error}</p>
					<button 
						onClick={() => window.location.reload()} 
						className="mt-2 text-blue-600 hover:text-blue-800"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<p className="text-md mb-4 text-gray-600">Overview</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{stats.map((stat, index) => (
					<div key={index} className="bg-white rounded-lg shadow">
						<div className="items-center">

							<div className="p-6 pb-3">
								<p className="text-sm font-medium text-gray-600">{stat.label}</p>
								<p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
							</div>

							<div className={`flex items-center text-sm px-6 py-2 ${
								stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
								}`}>

									<span className="mr-2">{stat.change}</span>			
								{stat.trend === 'up' ? (
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path fillRule="evenodd" clipRule="evenodd" d="M12.577 4.87801C12.6025 4.78286 12.6465 4.69367 12.7065 4.61553C12.7666 4.5374 12.8414 4.47185 12.9267 4.42263C13.012 4.37341 13.1062 4.34149 13.2039 4.32869C13.3016 4.31588 13.4009 4.32245 13.496 4.34801L18.276 5.62902C18.3712 5.65443 18.4605 5.69838 18.5388 5.75833C18.617 5.81829 18.6827 5.89308 18.732 5.97844C18.7813 6.06379 18.8133 6.15803 18.8262 6.25576C18.8391 6.35349 18.8325 6.45281 18.807 6.54801L17.526 11.328C17.4721 11.5172 17.3459 11.6776 17.1748 11.7747C17.0037 11.8718 16.8013 11.8978 16.6112 11.847C16.4211 11.7962 16.2586 11.6728 16.1587 11.5033C16.0588 11.3339 16.0294 11.1319 16.077 10.941L16.887 7.91902C14.696 9.26558 12.7945 11.0342 11.293 13.122C11.2296 13.2103 11.1477 13.2837 11.0531 13.3372C10.9585 13.3907 10.8533 13.423 10.745 13.4318C10.6367 13.4407 10.5277 13.4259 10.4256 13.3884C10.3236 13.351 10.2309 13.2918 10.154 13.215L7 10.06L2.28 14.78C2.13848 14.9166 1.949 14.9921 1.75235 14.9903C1.5557 14.9885 1.36763 14.9095 1.22864 14.7704C1.08965 14.6313 1.01086 14.4431 1.00924 14.2465C1.00763 14.0498 1.08331 13.8604 1.22 13.719L6.47 8.46901C6.61062 8.32856 6.80125 8.24967 7 8.24967C7.19875 8.24967 7.38937 8.32856 7.53 8.46901L10.604 11.542C12.1438 9.5811 14.0216 7.91118 16.149 6.61102L13.107 5.79601C13.0118 5.77049 12.9227 5.72647 12.8445 5.66647C12.7664 5.60646 12.7008 5.53166 12.6516 5.44631C12.6024 5.36097 12.5705 5.26677 12.5577 5.16909C12.5449 5.07141 12.5514 4.97316 12.577 4.87801Z" fill="#22C55E"/>
									</svg>

								) : (
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path fillRule="evenodd" clipRule="evenodd" d="M12.5771 4.87801C12.6026 4.78286 12.6466 4.69367 12.7066 4.61553C12.7666 4.5374 12.8414 4.47185 12.9268 4.42263C13.0121 4.37341 13.1063 4.34149 13.204 4.32869C13.3017 4.31588 13.4009 4.32245 13.4961 4.34801L18.2761 5.62902C18.3713 5.65443 18.4606 5.69838 18.5389 5.75833C18.6171 5.81829 18.6828 5.89308 18.7321 5.97844C18.7814 6.06379 18.8134 6.15803 18.8263 6.25576C18.8391 6.35349 18.8326 6.45281 18.8071 6.54801L17.5261 11.328C17.4721 11.5172 17.346 11.6776 17.1749 11.7747C17.0038 11.8718 16.8013 11.8978 16.6113 11.847C16.4212 11.7962 16.2587 11.6728 16.1587 11.5033C16.0588 11.3339 16.0295 11.1319 16.0771 10.941L16.8871 7.91902C14.6961 9.26558 12.7946 11.0342 11.2931 13.122C11.2296 13.2103 11.1478 13.2837 11.0531 13.3372C10.9585 13.3907 10.8534 13.423 10.7451 13.4318C10.6367 13.4407 10.5278 13.4259 10.4257 13.3884C10.3237 13.351 10.231 13.2918 10.1541 13.215L7.00006 10.06L2.28006 14.78C2.13854 14.9166 1.94906 14.9921 1.75241 14.9903C1.55576 14.9885 1.36769 14.9095 1.2287 14.7704C1.08971 14.6313 1.01092 14.4431 1.0093 14.2465C1.00769 14.0498 1.08337 13.8604 1.22006 13.719L6.47006 8.46901C6.61069 8.32856 6.80131 8.24967 7.00006 8.24967C7.19881 8.24967 7.38943 8.32856 7.53006 8.46901L10.6041 11.542C12.1438 9.5811 14.0217 7.91118 16.1491 6.61102L13.1071 5.79601C13.0119 5.77049 12.9227 5.72647 12.8446 5.66647C12.7664 5.60646 12.7009 5.53166 12.6517 5.44631C12.6025 5.36097 12.5705 5.26677 12.5577 5.16909C12.5449 5.07141 12.5515 4.97316 12.5771 4.87801Z" fill="#EF4444"/>
									</svg>
									
								)}

							</div>

							<div className="mt-3">
								<DashboardChart />
							</div>
						</div>
					</div>
				))}
			</div>
			
		</div>
	);
}

export default DashboardStats;