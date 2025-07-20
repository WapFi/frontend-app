import { useState } from "react";
import DashboardStats from "./DashboardStats";
import DashboardChart from "./DashboardChart";
import UserManagementTable from "./UserManagementTable";
import UserDetailsModal from "../modals/UserDetailsModal";

function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = () => {
    // This will trigger a refresh of the user table
    // The UserManagementTable will re-fetch data when props change
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
      </div>

      {/* Dashboard stats */}
      <DashboardStats />

		{/* User Management Table */}
		<div className="bg-white rounded-xl shadow">
			<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">

				<div>
					<h2 className="text-lg font-medium text-gray-900">User Management</h2>
				</div>

				<div>
					<input
						type="date"
						name="user_list_date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
					/>
				</div>

				<div className="space-x-3 w-1/2">
					<div className="relative w-full">
						<input
							type="text"
							placeholder="Search"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
						/>
						<svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>

				{/* <div>
					<a className="text-white px-4 py-2 rounded-md text-sm font-medium text-yellow-500 font-bold">
						View All
					</a>
				</div> */}
			</div>

			<UserManagementTable 
				onUserClick={handleUserClick} 
				searchTerm={searchTerm}
				selectedDate={selectedDate}
			/>
		</div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={handleCloseUserModal}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}

export default AdminDashboard;