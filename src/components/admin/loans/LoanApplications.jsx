import { useState, useEffect } from "react";
import LoanApplicationModal from "../modals/LoanApplicationModal";
import UserAvatar from "../../common/UserAvatar";
import { getLoanApplications, updateLoanApplicationStatus } from "../../../api/adminApi";

function LoanApplications() {
	const [loanApplications, setLoanApplications] = useState([]);
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [showLoanModal, setShowLoanModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalApplications: 0
	});

	useEffect(() => {
		fetchLoanApplications();
	}, []);

	const fetchLoanApplications = async (page = 1, search = '', date = '') => {
		try {
			setLoading(true);
			const params = { page, limit: 10 };
			if (search) params.search = search;
			if (date) params.date = date;
			
			const response = await getLoanApplications(params);
			
			if (response.status && response.data) {
				const { applications, total_applications, total_pages, current_page } = response.data;
				
				// Transform the data to match the expected format
				const transformedApplications = applications.map(app => ({
					id: app._id,
					name: app.user?.full_name || 'Unknown User',
					email: app.user?.identifier || 'No email',
					phone: app.user?.phone || 'No phone',
					amount: `₦ ${app.loan_amount?.toLocaleString() || '0'}`,
					loanTerm: `${app.loan_term || 0} Months`,
					reason: app.loan_purpose || 'Not specified',
					date: app.application_date ? new Date(app.application_date).toLocaleDateString() : 'Unknown',
					action: app.status === 'PENDING' ? 'Pending' : app.status === 'APPROVED' ? 'Accept' : 'Decline',
					status: app.status?.toLowerCase() || 'pending',
					avatar: app.user?.avatar || null
				}));
				
				setLoanApplications(transformedApplications);
				setPagination({
					currentPage: current_page,
					totalPages: total_pages,
					totalApplications: total_applications
				});
			}
		} catch (err) {
			console.error('Error fetching loan applications:', err);
			setError('Failed to load loan applications');
		} finally {
			setLoading(false);
		}
	};

	const handleLoanClick = (loan) => {
		setSelectedLoan(loan);
		setShowLoanModal(true);
	};

	const handleCloseLoanModal = () => {
		setShowLoanModal(false);
		setSelectedLoan(null);
	};

	const handleApprove = async (loanId) => {
		try {
			await updateLoanApplicationStatus(loanId, 'APPROVED');
			// Refresh the data
			fetchLoanApplications();
		} catch (err) {
			console.error('Error approving loan:', err);
			alert('Failed to approve loan application');
		}
	};

	const handleDecline = async (loanId) => {
		try {
			await updateLoanApplicationStatus(loanId, 'REJECTED');
			// Refresh the data
			fetchLoanApplications();
		} catch (err) {
			console.error('Error declining loan:', err);
			alert('Failed to decline loan application');
		}
	};

	const handleSearch = () => {
		fetchLoanApplications(1, searchTerm, selectedDate);
	};

	const filteredApplications = loanApplications.filter(loan =>
		loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		loan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		loan.reason.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusColor = (status) => {
		switch (status) {
		case 'approved':
			return 'bg-green-100 text-green-800';
		case 'declined':
		case 'rejected':
			return 'bg-red-100 text-red-800';
		case 'pending':
			return 'bg-yellow-100 text-yellow-800';
		default:
			return 'bg-gray-100 text-gray-800';
		}
	};

	const getActionButton = (loan) => {
		if (loan.status === 'pending') {
		return (
			<div className="flex space-x-2">
			<button
				onClick={() => handleApprove(loan.id)}
				className="text-green-600 hover:text-green-900 text-sm"
			>
				Accept
			</button>
			<button
				onClick={() => handleDecline(loan.id)}
				className="text-red-600 hover:text-red-900 text-sm"
			>
				Decline
			</button>
			</div>
		);
		}
		return (
		<button
			onClick={() => handleLoanClick(loan)}
			className="text-yellow-600 hover:text-yellow-900 text-sm"
		>
			View
		</button>
		);
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<div className="animate-pulse">
						<div className="h-12 bg-gray-200 rounded mb-4"></div>
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
				</div>
				<div className="text-center py-8">
					<p className="text-red-600">{error}</p>
					<button 
						onClick={() => fetchLoanApplications()} 
						className="mt-2 text-blue-600 hover:text-blue-800"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
		{/* Page header */}
		<div>
			<h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
		</div>

		{/* Search bar */}
		<div className="bg-white rounded-lg shadow">
			<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
				<div className="w-1/4">
					<input
						type="date"
						name="loan_list_date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
					/>
				</div>

				<div className="relative w-2/4">
					<input
					type="text"
					placeholder="Search"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 w-full"
					/>
					<svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Name
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Amount
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Loan Term
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Reason
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Date
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Action
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Action
						</th>
					</tr>
				</thead>

				<tbody className="bg-white divide-y divide-gray-200">
				{filteredApplications.map((loan) => (
					<tr key={loan.id} className="hover:bg-gray-50 cursor-pointer">
					<td className="px-6 py-4 whitespace-nowrap">

						<div className="flex items-center">
							<UserAvatar user={loan} />
							<div className="ml-3">
								<div className="text-sm font-medium text-gray-900">{loan.name}</div>
								<div className="text-sm text-gray-500">{loan.phone}</div>
							</div>
						</div>
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
						{loan.amount}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
						{loan.loanTerm}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
						{loan.reason}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{loan.date}
					</td>
					<td className="px-6 py-4 whitespace-nowrap">
						{getActionButton(loan)}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
						{getActionButton(loan)}
					</td>
					</tr>
				))}
				</tbody>
			</table>
			</div>

			{/* Pagination */}
			<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
				{/* Mobile pagination */}
				<div className="flex-1 flex justify-between sm:hidden">
					<button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
						Previous
					</button>
					<button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
						Next
					</button>
				</div>
				
				{/* Desktop pagination */}
				<div className="hidden sm:flex sm:items-center sm:justify-between w-full">
					{/* Previous button - left */}
					<div>
						<button 
							className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							disabled={pagination.currentPage === 1}
							onClick={() => fetchLoanApplications(pagination.currentPage - 1)}
						>
							Previous
						</button>
					</div>
					
					{/* Per page dropdown - center */}
					<div className="flex items-center">
						<label className="text-sm text-gray-700 mr-2">Per page</label>
						<select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
						</select>
					</div>
					
					{/* Next button - right */}
					<div>
						<button 
							className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							disabled={pagination.currentPage === pagination.totalPages}
							onClick={() => fetchLoanApplications(pagination.currentPage + 1)}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>

		{/* Loan Application Modal */}
		{showLoanModal && selectedLoan && (
			<LoanApplicationModal 
			loan={selectedLoan} 
			onClose={handleCloseLoanModal}
			/>
		)}

		</div>
	);
}

export default LoanApplications;