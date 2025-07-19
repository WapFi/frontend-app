import UserAvatar from "../../common/UserAvatar";

import { useState, useEffect } from "react";
import { getUsers } from "../../../api/adminApi";

function UserManagementTable({ onUserClick }) {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalUsers: 0
	});

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async (page = 1, search = '') => {
		try {
			setLoading(true);
			const response = await getUsers({ page, limit: 10, search });
			
			if (response.status && response.data) {
				const { users: userData, total_users, total_pages, current_page } = response.data;
				
				// Transform the data to match the expected format
				const transformedUsers = userData.map(user => ({
					id: user._id,
					name: user.full_name || 'Unknown User',
					email: user.identifier || 'No email',
					phone: user.phone || 'No phone',
					totalLoanTaken: `₦ ${user.total_loan_taken?.toLocaleString() || '0'}`,
					outstandingLoan: `₦ ${user.outstanding_loan?.toLocaleString() || '0'}`,
					amountRepaid: `₦ ${user.amount_repaid?.toLocaleString() || '0'}`,
					lastLoanDate: user.loan_due_date ? new Date(user.loan_due_date).toLocaleDateString() : 'No loans',
					avatar: user.avatar || null
				}));
				
				setUsers(transformedUsers);
				setPagination({
					currentPage: current_page,
					totalPages: total_pages,
					totalUsers: total_users
				});
			}
		} catch (err) {
			console.error('Error fetching users:', err);
			setError('Failed to load users');
		} finally {
			setLoading(false);
		}
	};
	if (loading) {
		return (
			<div className="overflow-x-auto">
				<div className="animate-pulse">
					<div className="h-12 bg-gray-200 rounded mb-4"></div>
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">{error}</p>
				<button 
					onClick={() => fetchUsers()} 
					className="mt-2 text-blue-600 hover:text-blue-800"
				>
					Retry
				</button>
			</div>
		);
	}

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Loan Taken
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Outstanding Loan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Repaid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loan Due Date
            </th>
            
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onUserClick(user)}>
              <td className="px-6 py-4 whitespace-nowrap">

                <div className="flex items-center">
                  <UserAvatar user={user} />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.totalLoanTaken}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.outstandingLoan}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.amountRepaid}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastLoanDate}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagementTable;