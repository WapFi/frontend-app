import { useState } from "react";

function FiltersModal({ onClose }) {
  const [filters, setFilters] = useState({
    tag: "",
    year: "",
    month: "",
    kycStatus: "",
    loanStatus: ""
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      tag: "",
      year: "",
      month: "",
      kycStatus: "",
      loanStatus: ""
    });
  };

  const handleApply = () => {
    // Apply filters logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <select
              value={filters.tag}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Select</option>
              <option value="new-user">New User</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Select</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Select</option>
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
          </div>

          {/* KYC Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
            <div className="space-y-2">
              {["BVN Verified", "NIN Verified", "Unverified", "BVN Unverified"].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="kycStatus"
                    value={status.toLowerCase().replace(' ', '-')}
                    checked={filters.kycStatus === status.toLowerCase().replace(' ', '-')}
                    onChange={(e) => handleFilterChange("kycStatus", e.target.value)}
                    className="mr-2 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}

export default FiltersModal;