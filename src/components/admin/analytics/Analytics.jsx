

import { useEffect, useState } from "react";
import LoanDistributionChart from "./LoanDistributionChart";
import RepaymentDistributionChart from "./RepaymentDistributionChart";
import TopPerformingUsersTable from "./TopPerformingUsersChart";
import UserDetailsModal from "../modals/UserDetailsModal";
import { getAnalyticsData } from "../../../api/adminApi";
import DateRangeSelector from "../../common/DateRangeSelector";

// Analytics component with both global and per-chart filtering
function Analytics() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global filter state
  const [globalDateRange, setGlobalDateRange] = useState({ from: "", to: "" });

  // Per-chart filter states
  const [loanDistFilter, setLoanDistFilter] = useState({ from: "", to: "" });
  const [repaymentFilter, setRepaymentFilter] = useState({ from: "", to: "" });

  // Each chart's data
  const [loanDistData, setLoanDistData] = useState([]);
  const [repaymentData, setRepaymentData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);

  // Global: fetch everything on load or global filter change
  useEffect(() => {
    // Only fetch global if at least one date is set (or do initial load however you like)
    if ((globalDateRange.from && globalDateRange.to) || (!globalDateRange.from && !globalDateRange.to)) {
      setLoading(true);
      setError(null);
      const params = { analytics_type: "ALL" };
      if (globalDateRange.from) params.start_date = globalDateRange.from;
      if (globalDateRange.to) params.end_date = globalDateRange.to;
      getAnalyticsData(params)
        .then(res => {
          setLoanDistData(
            res.data.loan_distribution?.map(item => ({
              month: item._id.monthName,
              new_loans: item.new_loans,
              overdue_loans: item.overdue_loans,
            })) || []
          );
          setRepaymentData(
            res.data.repayment_breakdown?.map(item => ({
              month: item._id.monthName,
              cash_repayment: item.cash_repayment,
              recyclable_repayment: item.recyclable_repayment,
            })) || []
          );
          setTopPerformers(
            res.data.top_performers?.map(user => ({
              ...user,
              full_name: user.name,
              score: user.credit_score,
              amount: user.total_repaid,
            })) || []
          );
        })
        .catch(err => setError(err.response?.data?.message || "Failed to fetch analytics"))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [globalDateRange.from, globalDateRange.to]);

  // Loan Distribution chart per-filter
  useEffect(() => {
    if (loanDistFilter.from && loanDistFilter.to) {
      setLoading(true);
      setError(null);
      getAnalyticsData({
        analytics_type: "LOAN_DISTRIBUTION",
        start_date: loanDistFilter.from,
        end_date: loanDistFilter.to,
      })
        .then(res => {
          setLoanDistData(
            res.data.loan_distribution?.map(item => ({
              month: item._id.monthName,
              new_loans: item.new_loans,
              overdue_loans: item.overdue_loans,
            })) || []
          );
        })
        .catch(err => setError(err.response?.data?.message || "Failed to fetch loan distribution"))
        .finally(() => setLoading(false));
    }
  }, [loanDistFilter.from, loanDistFilter.to]);

  // Repayment Breakdown chart per-filter
  useEffect(() => {
    if (repaymentFilter.from && repaymentFilter.to) {
      setLoading(true);
      setError(null);
      getAnalyticsData({
        analytics_type: "REPAYMENT_BREAKDOWN",
        start_date: repaymentFilter.from,
        end_date: repaymentFilter.to,
      })
        .then(res => {
          setRepaymentData(
            res.data.repayment_breakdown?.map(item => ({
              month: item._id.monthName,
              cash_repayment: item.cash_repayment,
              recyclable_repayment: item.recyclable_repayment,
            })) || []
          );
        })
        .catch(err => setError(err.response?.data?.message || "Failed to fetch repayment breakdown"))
        .finally(() => setLoading(false));
    }
  }, [repaymentFilter.from, repaymentFilter.to]);

  // Modal logic
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };
  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  if (loading)
    return <div className="p-6 text-center">Loading analytics...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Global Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold font-raleway text-[#222]">Analytics</h1>
        <DateRangeSelector onDateChange={setGlobalDateRange} />
      </div>

      {/* Charts with per-chart calendars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <LoanDistributionChart
            data={loanDistData}
            onDateFilter={setLoanDistFilter}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <RepaymentDistributionChart
            data={repaymentData}
            onDateFilter={setRepaymentFilter}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <TopPerformingUsersTable
            users={topPerformers}
            onUserClick={handleUserClick}
          />
        </div>
      </div>
      
      {showUserModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseUserModal} />
      )}
    </div>
  );
}

export default Analytics;
