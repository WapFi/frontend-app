import { useState } from "react";
import LoanDistributionChart from "./LoanDistributionChart";
import RepaymentDistributionChart from "./RepaymentDistributionChart";
import RecyclableTypeChart from "./RecyclableTypeChart";
import TopPerformingUsersChart from "./TopPerformingUsersChart";
import UserDetailsModal from "../modals/UserDetailsModal";

function Analytics() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-600">Coming soon</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Distribution Over Time */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Distribution Over Time</h3>
          <LoanDistributionChart />
        </div> */}

        {/* Repayment Distribution */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Repayment Distribution</h3>
          <RepaymentDistributionChart />
        </div> */}

        {/* Recyclable Type Distribution */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recyclable Type Distribution</h3>
          <RecyclableTypeChart />
        </div> */}

        {/* Top Performing Users */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Users</h3>
          <TopPerformingUsersChart onUserClick={handleUserClick} />
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

export default Analytics;