import { useEffect, useState } from "react";
import UserDetailsModal from "../modals/UserDetailsModal";
import UserAvatar from "../../common/UserAvatar";
import {
  getVerifications,
  processIdentityVerification,
} from "../../../api/adminApi";
import unverifiedIcon from "../../../assets/unverified icon.svg";
import verifiedIcon from "../../../assets/verified icon.svg";

function NINVerification() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ninData, setNinData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // userId for which action is loading

  useEffect(() => {
    const fetchNINs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { type: "nin" };
        if (searchTerm) params.search = searchTerm;
        const res = await getVerifications(params);
        setNinData(res.data.verifications || []);
      } catch (err) {
        setError("Failed to fetch NIN verifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNINs();
  }, [searchTerm]);

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

  const filteredData = ninData.filter(
    (user) =>
      (user.name || user.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || "").includes(searchTerm)
  );

  if (loading)
    return <div className="p-6 text-center">Loading NIN verifications...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">NIN Verification</h1>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
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

        {/* Table */}
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
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No NIN verifications found.
                  </td>
                </tr>
              ) : (
                filteredData.map((user) => (
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
                      {/* {user.date || user.createdAt?.slice(0, 10)} */}
                      {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseUserModal} />
      )}
    </div>
  );
}

export default NINVerification;
