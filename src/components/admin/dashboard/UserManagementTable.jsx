import UserAvatar from "../../common/UserAvatar";
import { useState, useEffect } from "react";
import { getUsers } from "../../../api/adminApi";

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
        console.log("res: ", response.data);
        const {
          users: userData,
          total_users,
          total_pages,
          current_page,
        } = response.data;

        console.log("user data: ", userData);

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
            <tr
              key={user._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onUserClick(user)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <UserAvatar user={user} />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name}
                    </div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
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

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * perPage + 1} to{" "}
            {Math.min(pagination.currentPage * perPage, pagination.totalUsers)}{" "}
            of {pagination.totalUsers} results
          </span>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Per page:</label>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-3 py-1 text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserManagementTable;
