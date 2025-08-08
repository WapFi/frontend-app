// import { useEffect, useState } from "react";
// import UserAvatar from "../../common/UserAvatar";
// import { getUsers } from "../../../api/adminApi";
// import NairaIcon from "../../../assets/naira icon.svg";

// function UserManagementTable({ onUserClick, searchTerm = "" }) {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   function formatCurrency(value) {
//     return new Intl.NumberFormat("en-NG", {
//       style: "decimal",

//       maximumFractionDigits: 2,
//     }).format(value);
//   }

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const params = {};
//         if (searchTerm) params.search = searchTerm;
//         const res = await getUsers(params);
//         // If paginated, res.data.users; else res.data
//         console.log("user mgt: ", res);
//         setUsers(res.data?.users || res.data || []);
//       } catch (err) {
//         setError("Failed to fetch users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [searchTerm]);

//   if (loading) return <div className="p-6 text-center">Loading users...</div>;
//   if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Name
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Total Loan Taken
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Outstanding Loan
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Amount Repaid
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Last Loan Date
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Action
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Action
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
//                 No users found.
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <UserAvatar user={user} />
//                     <div className="ml-3">
//                       <div className="text-sm font-medium text-gray-900">
//                         {user.full_name}
//                       </div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   <div className="flex items-center gap-1">
//                     <img src={NairaIcon} alt="naira icon" />
//                     <span>{formatCurrency(user.total_loan_taken)}</span>
//                   </div>
//                   {/* {user.total_loan_taken || "0"} */}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {/* {user.outstanding_loan || "0"} */}
//                   <div className="flex items-center gap-1">
//                     <img src={NairaIcon} alt="naira icon" />
//                     <span>{formatCurrency(user.outstanding_loan)}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {/* {user.amount_repaid || "0"} */}
//                   <div className="flex items-center gap-1">
//                     <img src={NairaIcon} alt="naira icon" />
//                     <span>{formatCurrency(user.amount_repaid)}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(user.loan_due_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => onUserClick(user)}
//                     className="text-yellow-600 hover:text-yellow-900"
//                   >
//                     View
//                   </button>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button className="text-red-600 hover:text-red-900">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//       {/* Pagination placeholder (implement if backend supports) */}
 
//     </div>
//   );
// }

// export default UserManagementTable;

import { useEffect, useState } from "react";
import UserAvatar from "../../common/UserAvatar";
import { getUsers } from "../../../api/adminApi";
import NairaIcon from "../../../assets/naira icon.svg";

function UserManagementTable({ onUserClick, searchTerm = "", selectedDate = "" }) {
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

  // Refactored to a standalone function for clarity
  const fetchUsers = async (page = 1) => {
    
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: perPage,
      };
      if (searchTerm) params.search = searchTerm;
      // CORRECTED: Add the selectedDate to the API call
      if (selectedDate) params.start_date = selectedDate;

      const res = await getUsers(params);

      if (res.data) {
        // You'll get pagination data if the API supports it
        const { users: userData, total_users, total_pages, current_page } = res.data;
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
    // CORRECTED: The useEffect now depends on selectedDate, searchTerm, AND perPage
    // This will trigger a re-fetch and reset to page 1 whenever any of these props change.
    fetchUsers(1);
  }, [searchTerm, selectedDate, perPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      fetchUsers(page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
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
                onChange={handlePerPageChange}
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
      )}
    </div>
  );
}

export default UserManagementTable;