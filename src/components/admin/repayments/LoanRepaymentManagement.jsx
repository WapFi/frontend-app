import { useState, useEffect } from "react";
import RepaymentDetailsModal from "../modals/RepaymentDetailsModal";
import UserDetailsModal from "../modals/UserDetailsModal";
import UserAvatar from "../../common/UserAvatar";
import { getRepayments } from "../../../api/adminApi";

function LoanRepaymentManagement() {
	const [repaymentData, setRepaymentData] = useState([]);
	const [selectedRepayment, setSelectedRepayment] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showRepaymentModal, setShowRepaymentModal] = useState(false);
	const [showUserModal, setShowUserModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalRepayments: 0
	});
	const [startDate, setStartDate] = useState("");

	useEffect(() => {
		fetchRepayments();
	}, []);

	const fetchRepayments = async (page = 1, search = '') => {
		try {
		setLoading(true);
		const params = { page, limit: 10 };
		if (search) params.search = search;
		
		const response = await getRepayments(params);
		
		if (response.status && response.data) {
			const { repayments, total_repayments, total_pages, current_page } = response.data;
			
			// Transform the data to match the expected format
			const transformedRepayments = repayments.map(repayment => ({
				id: repayment._id,
				name: repayment.user?.full_name || 'Unknown User',
				email: repayment.user?.identifier || 'No email',
				phone: repayment.user?.phone || 'No phone',
				installmentPayment: `₦ ${repayment.amount?.toLocaleString() || '0'}`,
				loanAmount: `₦ ${repayment.loan?.loan_amount?.toLocaleString() || '0'}`,
				outstandingLoan: `₦ ${(repayment.loan?.total_amount_due - repayment.loan?.amount_paid)?.toLocaleString() || '0'}`,
				datePaid: repayment.payment_date ? new Date(repayment.payment_date).toLocaleDateString() : 'Unknown',
				avatar: repayment.user?.avatar || null,
				totalLoanTaken: `₦ ${repayment.loan?.loan_amount?.toLocaleString() || '0'}`,
				amountRepaid: `₦ ${repayment.loan?.amount_paid?.toLocaleString() || '0'}`,
				lastLoanDate: repayment.loan?.due_date ? new Date(repayment.loan.due_date).toLocaleDateString() : 'Unknown'
			}));
			
			setRepaymentData(transformedRepayments);
			setPagination({
				currentPage: current_page,
				totalPages: total_pages,
				totalRepayments: total_repayments
			});
		}
		} catch (err) {
			console.error('Error fetching repayments:', err);
			setError('Failed to load repayments');
		} finally {
			setLoading(false);
		}
	};

	const handleRepaymentClick = (repayment) => {
		setSelectedRepayment(repayment);
		setShowRepaymentModal(true);
	};

	const handleUserClick = (user) => {
		setSelectedUser(user);
		setShowUserModal(true);
	};

	const handleCloseRepaymentModal = () => {
		setShowRepaymentModal(false);
		setSelectedRepayment(null);
	};

	const handleCloseUserModal = () => {
		setShowUserModal(false);
		setSelectedUser(null);
	};

	const filteredData = repaymentData.filter(repayment =>
		repayment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		repayment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		repayment.phone.includes(searchTerm)
	);

	if (loading) {
		return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Loan Repayment Management</h1>
				<p className="text-sm text-gray-600">31, July 2025</p>
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
				<h1 className="text-2xl font-bold text-gray-900">Loan Repayment Management</h1>
				<p className="text-sm text-gray-600">31, July 2025</p>
			</div>
			<div className="text-center py-8">
				<p className="text-red-600">{error}</p>
				<button 
					onClick={() => fetchRepayments()} 
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
        <h1 className="text-2xl font-bold text-gray-900">Loan Repayment Management</h1>
        <p className="text-sm text-gray-600">31, July 2025</p>
      </div>

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

				{/* Search bar */}
				<div className="w-3/5">
					<div className="relative max-w-md">
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

			</div>
		
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installment Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding Loan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Paid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((repayment) => (
                <tr 
                  key={repayment.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRepaymentClick(repayment)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserAvatar user={repayment} />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{repayment.name}</div>
                        <div className="text-sm text-gray-500">{repayment.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repayment.installmentPayment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repayment.loanAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repayment.outstandingLoan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {repayment.datePaid}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Per page <span className="font-medium">5</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Details Modal */}
      {showRepaymentModal && selectedRepayment && (
        <RepaymentDetailsModal 
          repayment={selectedRepayment} 
          onClose={handleCloseRepaymentModal}
          onViewUser={() => {
            handleCloseRepaymentModal();
            handleUserClick(selectedRepayment);
          }}
        />
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={handleCloseUserModal}
        />
      )}
    </div>
  );
}

export default LoanRepaymentManagement;