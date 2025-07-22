import { useEffect, useState } from "react";
import UserAvatar from "../../common/UserAvatar";
import { getUsers } from "../../../api/adminApi";

function UserManagementTable({ onUserClick, searchTerm = "" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        const res = await getUsers(params);
        // If paginated, res.data.users; else res.data
        setUsers(res.data?.users || res.data || []);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  if (loading) return <div className="p-6 text-center">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
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
              Last Loan Date
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
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id || user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserAvatar user={user} />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{user.name || user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.totalLoanTaken || user.total_loan_taken || "0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.outstandingLoan || user.outstanding_loan || "0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.amountRepaid || user.amount_repaid || "0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLoanDate || user.last_loan_date || "0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onUserClick(user)}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    View
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination placeholder (implement if backend supports) */}
    </div>
  );
}

export default UserManagementTable;