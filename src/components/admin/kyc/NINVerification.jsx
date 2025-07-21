import { useState } from "react";
import UserDetailsModal from "../modals/UserDetailsModal";
import UserAvatar from "../../common/UserAvatar";

const ninData = [
  {
    id: 1,
    name: "Aisha Bello",
    email: "aisha@example.com", 
    phone: "+2348123456789",
    nin: "2233*******",
    status: "verified",
    date: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+2348123456789", 
    nin: "2233*******",
    status: "unverified",
    date: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+2348123456789",
    nin: "2233*******",
    status: "unverified", 
    date: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 4,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+2348123456789",
    nin: "2233*******",
    status: "unverified",
    date: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 5,
    name: "Aisha Bello", 
    email: "aisha@example.com",
    phone: "+2348123456789",
    nin: "2233*******",
    status: "unverified",
    date: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 6,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+2348123456789",
    nin: "2233*******",
    status: "unverified",
    date: "July 15, 2025", 
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 7,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+2348123456789",
    nin: "2233*******",
    status: "unverified",
    date: "July 15, 2025",
    avatar: "/api/placeholder/32/32"
  }
];

function NINVerification() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleUserClick = (user) => {
      setSelectedUser(user);
      setShowUserModal(true);
    };

    const handleCloseUserModal = () => {
      setShowUserModal(false);
      setSelectedUser(null);
    };

    const handleVerify = (userId) => {
      // Add verify logic here
      console.log("Verify user:", userId);
    };

    const handleReject = (userId) => {
      // Add reject logic here
      console.log("Reject user:", userId);
    };

    const filteredData = ninData.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">NIN Verification</h1>
        <p className="text-sm text-gray-600">Coming soon</p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow">
        {/* <div className="px-6 py-4 border-b border-gray-200">
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

        {/* Table */}
        {/* <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {filteredData.map((user) => (
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
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.nin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.status === 'unverified' ? (
                      <button
                        onClick={() => handleVerify(user.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserClick(user)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        View
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleReject(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Pagination */}
        {/* <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
        </div> */}
      </div>

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

export default NINVerification;