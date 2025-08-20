import { useState, useEffect } from "react";
import AddAdminModal from "../modals/AddAdminModal";
import { getAdmins, updateUserStatus } from "../../../api/adminApi";
import { toast } from "react-toastify";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAdmins();
        setAdmins(response.data.admins);
      } catch (err) {
        setError("Failed to fetch admins");
        toast.error("Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [refresh]);

  const handleDeactivateAdmin = async (adminId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateUserStatus(adminId, newStatus);
      toast.success(
        `Admin ${
          newStatus === "ACTIVE" ? "activated" : "deactivated"
        } successfully`
      );
      setRefresh((r) => !r);
    } catch (err) {
      toast.error("Failed to update admin status");
    } finally {
      setLoading(false);
    }
  };

  // Add admin logic will be handled in AddAdminModal and should call setRefresh to reload

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
      </div>

      {/* Admin table */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Administrators</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="theme_bg_color text-white px-4 py-2 rounded-full font-medium hover:bg-yellow-600 transition-colors cursor-pointer"
          >
            Add Admin
          </button>
        </div>
        {error && <div className="text-red-500 px-6 py-2">{error}</div>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Identifier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.identifier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{admin.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(admin.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      handleDeactivateAdmin(admin._id, admin.status)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                      admin.status === "ACTIVE"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {admin.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onAdminAdded={() => {
            setShowAddModal(false);
            setRefresh((r) => !r);
          }}
        />
      )}
    </div>
  );
}

export default AdminManagement;
