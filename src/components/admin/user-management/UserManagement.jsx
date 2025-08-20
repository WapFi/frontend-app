
import { useState } from "react";
import UserManagementTable from "./UserManagementTable";
import UserDetailsModal from "../modals/UserDetailsModal";
import FiltersModal from "../modals/FiltersModal";

function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filters, setFilters] = useState({
    tier: "",
    kycStatus: [],
  });
  const [resultsCount, setResultsCount] = useState(0);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleFiltersClick = () => {
    setShowFiltersModal(true);
  };

  const handleCloseFiltersModal = () => {
    setShowFiltersModal(false);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    handleCloseFiltersModal();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="flex justify-between items-center w-full">
            <div className="w-32">
              <input
                type="date"
                name="loan_list_date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 w-full"
              />
            </div>
            <div className="w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 w-full"
                />
                <svg
                  className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-32 flex justify-end">
              <button
                onClick={handleFiltersClick}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>
        </div>

        <UserManagementTable
          onUserClick={handleUserClick}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          filters={filters}
          onResultsCountUpdate={setResultsCount}
        />
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseUserModal} />
      )}

      {/* Filters Modal */}
      {showFiltersModal && (
        <FiltersModal
          onClose={handleCloseFiltersModal}
          currentFilters={filters}
          onApply={handleApplyFilters}
          resultsCount={resultsCount}
        />
      )}
    </div>
  );
}

export default UserManagement;