import { useEffect, useState } from "react";
import { getUsers } from "../../../api/adminApi";
import NairaIcon from "../../../assets/naira icon.svg";
import UserAvatar from "../../common/UserAvatar";

function UserManagementTable({
  onUserClick,
  searchTerm = "",
  selectedDate = "",
  filters,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  function formatCurrency(value) {
    if (value === null || value === undefined) {
      value = 0;
    }
    return new Intl.NumberFormat("en-NG", {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(value);
  }

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: perPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedDate) params.start_date = selectedDate;

      if (filters.tier) params.tier = parseInt(filters.tier.split(" ")[1], 10);
      if (filters.kycStatus.includes("BVN Verified"))
        params.bvn_verified = true;
      if (filters.kycStatus.includes("BVN Unverified"))
        params.bvn_verified = false;
      if (filters.kycStatus.includes("NIN Verified"))
        params.nin_verified = true;
      if (filters.kycStatus.includes("NIN Unverified"))
        params.nin_verified = false;

      const res = await getUsers(params);

      if (res.data) {
        const {
          users: userData,
          total_users,
          total_pages,
          current_page,
        } = res.data;
        const transformedUsers = (userData || []).map((user) => ({
          _id: user._id,
          full_name: user.full_name || "Unknown User",
          email: user.identifier || "No email",
          phone: user.phone || "No phone",
          total_loan_taken: user.total_loan_taken,
          outstanding_loan: user.outstanding_loan,
          amount_repaid: user.amount_repaid,
          loan_due_date: user.loan_due_date,
          profile_picture: user.profile_picture || null,
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
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [searchTerm, selectedDate, perPage, filters]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      fetchUsers(page);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(Number(newPerPage));
  };

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
              <tr key={user._id} className="hover:bg-gray-50">
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
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span>{formatCurrency(user.total_loan_taken)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span>{formatCurrency(user.outstanding_loan)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span>{formatCurrency(user.amount_repaid)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.loan_due_date
                    ? new Date(user.loan_due_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No loans"}
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

      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between sm:hidden">
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
                onChange={(e) => handlePerPageChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            </div>

            <div className="flex items-center">
              <label className="text-sm text-gray-700 mr-2">Per page</label>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div>
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
      )}
    </div>
  );
}

export default UserManagementTable;
