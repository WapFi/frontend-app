

import { useEffect, useState } from "react";
import UserDetailsModal from "../modals/UserDetailsModal";
import UserAvatar from "../../common/UserAvatar";
import {
  getVerifications,
  processIdentityVerification,
} from "../../../api/adminApi";
import unverifiedIcon from "../../../assets/unverified icon.svg";
import verifiedIcon from "../../../assets/verified icon.svg";
import calendarIcon from "../../../assets/calendar icon.svg";
import chevronDown from "../../../assets/chevron-down.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function formatDateText(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function NINVerification() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [startDate, setStartDate] = useState(null);

  const [ninData, setNinData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVerifications, setTotalVerifications] = useState(0);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageOptions = [10, 20, 30, 40, 50];

  // debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 2500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // fetch
  useEffect(() => {
    const fetchNINs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { type: "nin", page: currentPage, limit: itemsPerPage };
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (startDate) {
          const d = startDate;
          params.start_date = `${d.getFullYear()}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }
        const res = await getVerifications(params);
        setNinData(res.data.verifications || []);
        setTotalVerifications(res.data.total_verifications || 0);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        setError("Failed to fetch NIN verifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNINs();
  }, [debouncedSearchTerm, startDate, currentPage, itemsPerPage]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleVerify = async (userId) => {
    setActionLoading(userId);
    try {
      await processIdentityVerification(userId, "VERIFY", "NIN");
      setNinData((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: "verified" } : u))
      );
    } catch (err) {
      alert("Failed to verify user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId);
    try {
      await processIdentityVerification(userId, "REJECT", "NIN");
      setNinData((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: "rejected" } : u))
      );
    } catch (err) {
      alert("Failed to reject user");
    } finally {
      setActionLoading(null);
    }
  };

  // pagination handlers
  const handlePreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

  // showing X–Y
  const startCount = (currentPage - 1) * itemsPerPage + 1;
  const endCount = Math.min(currentPage * itemsPerPage, totalVerifications);

  if (loading)
    return <div className="p-6 text-center">Loading NIN verifications...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Page header (mobile date + search) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">NIN Verification</h1>
          <div className="relative md:hidden text-[rgba(34,34,34,0.60)]">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              placeholderText="Select Date"
              className="pl-8 py-2 border border-[rgba(0,0,0,0.08)] rounded-2xl text-sm text-[rgba(34,34,34,0.60)] focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer"
              calendarClassName="z-50"
            />
            <img
              src={calendarIcon}
              alt="calendar icon"
              className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
            />
            {startDate && (
              <span className="absolute left-8 top-2.5 text-[rgba(34,34,34,0.60)] bg-white pr-2 pointer-events-none select-none">
                {formatDateText(startDate)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="relative md:hidden mt-3">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 w-full"
          />
          <svg
            className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
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

      {/* Search and Date Filters (Desktop) */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="hidden md:flex justify-between gap-3 w-full">
          <div className="relative w-full md:w-[20%] flex items-center text-[rgba(34,34,34,0.60)]">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              placeholderText="Select Date"
              className="pl-8 pr-3 py-2 border border-[rgba(0,0,0,0.08)] rounded-2xl text-sm focus:outline-none  focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 w-full cursor-pointer"
              calendarClassName="z-50"
            />
            <img
              src={calendarIcon}
              alt="calendar icon"
              className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
            />
            {startDate && (
              <span className="absolute left-8 top-2.5 text-[rgba(34,34,34,0.60)] bg-white pr-2 pointer-events-none select-none">
                {formatDateText(startDate)}
              </span>
            )}
          </div>
          <div className="relative w-[70%]">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 w-full"
            />
            <svg
              className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
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
              {ninData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No NIN verifications found.
                  </td>
                </tr>
              ) : (
                ninData.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar user={user} />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.nin || user.identity_value}
                    </td>
                    <td className="px-6 py-4">
                      {user.nin_verified === true ? (
                        <div className="inline-flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] text-[#16A34A] text-xs border border-[#D3F3DF] bg-[#F2FDF5] w-max min-w-0">
                          <img src={verifiedIcon} alt="verified icon" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] text-[#EF4444] text-xs border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)] w-max min-w-0">
                          <img src={unverifiedIcon} alt="unverified icon" />
                          <span>Unverified</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status === "unverified" ? (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          disabled={actionLoading === user._id}
                        >
                          {actionLoading === user._id
                            ? "Verifying..."
                            : "Verify"}
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
                        onClick={() => handleReject(user._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? "Rejecting..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalVerifications > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Showing {startCount}-{endCount} of {totalVerifications}
          </span>

          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
            >
              <p className="text-[#999] text-sm py-1">Per page</p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
                {itemsPerPage}
              </span>
              <img src={chevronDown} alt="dropdown icon" className="ml-1 w-4" />
            </div>
            {showPerPageDropdown && (
              <div className="absolute bg-white border rounded shadow z-10">
                {perPageOptions.map((num) => (
                  <div
                    key={num}
                    onClick={() => handlePerPageChange(num)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseUserModal} />
      )}
    </div>
  );
}

export default NINVerification;
