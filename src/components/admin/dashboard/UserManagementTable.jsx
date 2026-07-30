import { useEffect, useState } from "react";
import { getUsers } from "../../../api/adminApi";
import UserAvatar from "../../common/UserAvatar";

function UserManagementTable({
  onUserClick,
  onUserUpdate,
  searchTerm = "",
  selectedDate = "",
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [perPage, searchTerm, selectedDate]);

  const fetchUsers = async (
    page = 1,
    search = "",
    startDate = "",
    // endDate = ""
  ) => {
    try {
      setLoading(true);
      const response = await getUsers({
        page,
        limit: perPage,
        search: search || searchTerm,
        start_date: startDate || selectedDate,
        // end_date: endDate || selectedDate
      });

      if (response.status && response.data) {
        const {
          users: userData,
          total_users,
          total_pages,
          current_page,
        } = response.data;

        // Transform the data to match the expected format
        const transformedUsers = userData.map((user) => ({
          _id: user._id,
          full_name: user.full_name || "Unknown User",
          email: user.identifier || "No email",
          phone: user.phone || "No phone",
          totalLoanTaken: `₦ ${user.total_loan_taken?.toLocaleString() || "0"}`,
          outstandingLoan: `₦ ${
            user.outstanding_loan?.toLocaleString() || "0"
          }`,
          amountRepaid: `₦ ${user.amount_repaid?.toLocaleString() || "0"}`,
          lastLoanDate: user.loan_due_date
            ? new Date(user.loan_due_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No loans",
          profile_picture: user.profile_picture || null,
          bvnVerified: user.bvn_verified,
          phoneVerified: user.phone_verified,
          ninVerified: user.nin_verified,
        }));

        setUsers(transformedUsers);
        setPagination({
          currentPage: current_page,
          totalPages: total_pages,
          totalUsers: total_users,
        });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchUsers(page, searchTerm, selectedDate, selectedDate);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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
    <div className="w-full overflow-x-auto md:overflow-visible">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
              Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
              Total Loan Taken
            </th>
            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Outstanding Loan
            </th>
            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Repaid
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
              <span className="sm:hidden">Due Date</span>
              <span className="hidden sm:inline">Loan Due Date</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onUserClick(user)}
            >
              <td className="px-3 py-4 sm:px-6">
                <div className="flex items-center">
                  <UserAvatar user={user} />
                  <div className="ml-3 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.full_name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.phone}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                {user.totalLoanTaken}
              </td>
              <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.outstandingLoan}
              </td>
              <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.amountRepaid}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                {user.lastLoanDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center">
            <label className="text-sm text-gray-700 mr-2">Per page</label>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserManagementTable;
