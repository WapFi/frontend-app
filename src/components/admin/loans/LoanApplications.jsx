import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UserDetailsModal from "../modals/UserDetailsModal";
import UserAvatar from "../../common/UserAvatar";
import { getLoanApplications, updateLoanApplicationStatus, getUserDetails } from "../../../api/adminApi";

function LoanApplications() {
	const [loanApplications, setLoanApplications] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showUserModal, setShowUserModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [perPage, setPerPage] = useState(10);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalApplications: 0
	});

	useEffect(() => {
		fetchLoanApplications();
	}, [perPage]);

	// Filter when date or search changes
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchLoanApplications(1, searchTerm, startDate, endDate);
		}, 500); // Debounce search

		return () => clearTimeout(timeoutId);
	}, [searchTerm, startDate, endDate]);

	const fetchLoanApplications = async (page = 1, search = '', startDate = '', endDate = '') => {
		try {
			setLoading(true);
			const params = { page, limit: perPage };
			if (search) params.search = search;
			if (startDate) params.start_date = startDate;
			if (endDate) params.end_date = endDate;
			
			const response = await getLoanApplications(params);
			
			if (response.status && response.data) {
				const { applications, total_applications, total_pages, current_page } = response.data;
				
				// Transform the data to match the expected format
				const transformedApplications = applications.map(app => ({
					id: app._id,
					user: app.user, // Keep the original user object for accessing user ID
					name: app.user?.full_name || 'Unknown User',
					email: app.user?.identifier || 'No email',
					phone: app.user?.phone || 'No phone',
					amount: `₦ ${app.loan_amount?.toLocaleString() || '0'}`,
					loanTerm: `${app.loan_term_months || 0} Months`,
					reason: app.loan_purpose || 'Not specified',
					date: app.application_date ? new Date(app.application_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown',
					action: app.status === 'PENDING' ? 'PENDING' : app.status === 'APPROVED' ? 'APPROVED' : 'DECLINED',
					status: app.status,
					avatar: app.user?.avatar || null,
					tier: app.user?.credit_score?.tier || 'N/A',
					creditScore: app.user?.credit_score?.current_score || 'N/A'
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

	const handleLoanClick = async (loan) => {
		try {
			// Get the user ID directly from the loan object
			const userId = loan.user?._id;
			if (userId) {
				const response = await getUserDetails(userId);
				if (response.status && response.data) {
					setSelectedUser(response.data);
					setShowUserModal(true);
				}
			}
		} catch (err) {
			console.error('Error fetching user details:', err);
		}
	};

	const handleCloseUserModal = () => {
		setShowUserModal(false);
		setSelectedUser(null);
	};

	const handleApprove = async (loanId) => {
		try {
			const response = await updateLoanApplicationStatus(loanId, 'APPROVED');
			if (response.status && response.data) {
				toast.success('Loan application approved successfully');
				fetchLoanApplications();
			} else {
				toast.error('Failed to approve loan application');
			}
		} catch (err) {
			console.error('Error approving loan:', err);
			toast.error('Failed to approve loan application');
		}
	};

	const handleDecline = async (loanId) => {
		try {
			let response = await updateLoanApplicationStatus(loanId, 'REJECTED');
			console.log("response: ", response);
			if (response.status && response.data) {
				toast.success('Loan application declined successfully');
				fetchLoanApplications();
			} else {
				toast.error('Failed to decline loan application');
			}
		} catch (err) {
			console.error('Error declining loan:', err);
			toast.error('Failed to decline loan application');
		}
	};

	// Search is now handled automatically via useEffect

	const handlePageChange = (page) => {
		fetchLoanApplications(page, searchTerm, startDate, endDate);
	};

	const handlePerPageChange = (newPerPage) => {
		setPerPage(newPerPage);
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

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
		if (loan.status === 'PENDING') {
			return (
				<div className="flex space-x-2">
					<button
						onClick={() => handleApprove(loan.id)}
						className="text-green-600 hover:text-green-900 text-sm cursor-pointer"
					>
						Accept
					</button>
				</div>
			);
		} else if (loan.status === 'APPROVED' || loan.status === 'DISBURSED') {
			return (
				<button
					onClick={() => handleDecline(loan.id)}
					className="text-red-600 hover:text-red-900 text-sm cursor-pointer"
				>
					Decline
				</button>
			);
		}
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

		{/* Search and Filter Section */}
		<div className="bg-white rounded-lg shadow">
			<div className="px-6 py-4 border-b border-gray-200">
				<div className="flex justify-between items-center gap-4">

					{/* Date */}
					<div className="w-1/4">
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
						/>
					</div>

					{/* Search Input */}
					<div className="w-3/5">
						<div className="relative">
							<input
								type="text"
								placeholder="Search by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
							/>
							<svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>

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
					</tr>
				</thead>

				<tbody className="bg-white divide-y divide-gray-200">
					{loanApplications.map((loan) => (
						<tr key={loan.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleLoanClick(loan)}>
						<td className="px-6 py-4 whitespace-nowrap">

							<div className="flex items-center">
								<UserAvatar user={loan} />
								<div className="ml-3">
									<div className="text-sm font-medium text-gray-900">{loan.name}</div>
									<div className="text-sm text-gray-500"> Tier {loan.tier}</div>
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
							onClick={() => handlePageChange(pagination.currentPage - 1)}
						>
							Previous
						</button>
					</div>
					
					{/* Per page dropdown - center */}
					<div className="flex items-center">
						<label className="text-sm text-gray-700 mr-2">Per page</label>
						<select 
							value={perPage}
							onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
						>
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
							onClick={() => handlePageChange(pagination.currentPage + 1)}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>

		{/* User Details Modal */}
		{showUserModal && selectedUser && (
			<UserDetailsModal 
			user={selectedUser} 
			onClose={handleCloseUserModal}
			onUserUpdate={() => fetchLoanApplications()}
			/>
		)}

		</div>
	);
}

export default LoanApplications;