import UserAvatar from "../../common/UserAvatar";

const users = [
  {
    id: 1,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 50,000",
    outstandingLoan: "₦ 30,000",
    amountRepaid: "₦ 20,000",
    lastLoanDate: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    name: "John Bello",
    email: "john@example.com", 
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 100",
    outstandingLoan: "₦ 100",
    amountRepaid: "₦ 0",
    lastLoanDate: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    name: "Amina Bello",
    email: "amina@example.com",
    phone: "+234 812 345 6789", 
    totalLoanTaken: "₦ 50,000",
    outstandingLoan: "₦ 100",
    amountRepaid: "₦ 0",
    lastLoanDate: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 4,
    name: "Kemi Adeniran",
    email: "kemi@example.com",
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 75,000", 
    outstandingLoan: "₦ 25,000",
    amountRepaid: "₦ 50,000",
    lastLoanDate: "July 12, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 5,
    name: "Ibrahim Musa",
    email: "ibrahim@example.com",
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 120,000",
    outstandingLoan: "₦ 40,000", 
    amountRepaid: "₦ 80,000",
    lastLoanDate: "July 10, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 6,
    name: "Fatima Yusuf",
    email: "fatima@example.com",
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 30,000",
    outstandingLoan: "₦ 10,000",
    amountRepaid: "₦ 20,000", 
    lastLoanDate: "July 08, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 7,
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 90,000",
    outstandingLoan: "₦ 90,000",
    amountRepaid: "₦ 0", 
    lastLoanDate: "July 16, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 8,
    name: "Blessing Okoro",
    email: "blessing@example.com",
    phone: "+234 812 345 6789",
    totalLoanTaken: "₦ 60,000",
    outstandingLoan: "₦ 15,000",
    amountRepaid: "₦ 45,000", 
    lastLoanDate: "July 05, 2025",
    avatar: "/api/placeholder/32/32"
  }
];

function UserManagementTable({ onUserClick, searchTerm = "" }) {
  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

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
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
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
          ))}
        </tbody>
      </table>
      
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementTable;