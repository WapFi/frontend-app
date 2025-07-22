import { useEffect, useState } from "react";
import LoanDistributionChart from "./LoanDistributionChart";
import RepaymentDistributionChart from "./RepaymentDistributionChart";
import RecyclableTypeChart from "./RecyclableTypeChart";
import TopPerformingUsersChart from "./TopPerformingUsersChart";
import UserDetailsModal from "../modals/UserDetailsModal";
import { getAnalyticsData } from "../../../api/adminApi";

function Analytics() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAnalyticsData();
        setAnalytics(res.data);
      } catch (err) {
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Distribution Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Distribution Over Time</h3>
          <LoanDistributionChart data={analytics.loan_distribution} />
        </div>

        {/* Repayment Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Repayment Distribution</h3>
          <RepaymentDistributionChart data={analytics.repayment_breakdown} />
        </div>

        {/* Recyclable Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recyclable Type Distribution</h3>
          <RecyclableTypeChart data={analytics.recyclable_distribution} />
        </div>

        {/* Top Performing Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Users</h3>
          <TopPerformingUsersChart users={analytics.top_performers} onUserClick={handleUserClick} />
        </div>
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