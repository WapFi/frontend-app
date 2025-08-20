
import { useEffect, useState } from "react";

function FiltersModal({ onClose, currentFilters, onApply}) {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleTierChange = (tier) => {
    setLocalFilters((prev) => ({
      ...prev,
      tier: prev.tier === tier ? "" : tier,
    }));
  };

  const handleKycStatusChange = (status) => {
    setLocalFilters((prev) => {
      const newStatus = prev.kycStatus.includes(status)
        ? prev.kycStatus.filter((s) => s !== status)
        : [...prev.kycStatus, status];
      return { ...prev, kycStatus: newStatus };
    });
  };

  const handleReset = () => {
    const defaultFilters = { tier: "", kycStatus: [] };
    setLocalFilters(defaultFilters);
    onApply(defaultFilters);
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const kycStatuses = ["BVN Verified", "BVN Unverified", "NIN Verified", "NIN Unverified"];

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(currentFilters);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] shadow-xl w-full max-w-[400px]">
        <div className="relative p-6 md:p-8">
        
          <div className="relative flex items-center justify-center pb-6">
            <p className="text-[20px] md:text-2xl font-bold text-[#222] text-center">Filters</p>
            <button
              onClick={onClose}
              className="absolute right-0 text-[#888] hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tier Filter */}
          <div className="mb-6 border-t border-[#E8E8E8] pt-6">
            <p className="text-[#222] text-sm font-semibold mb-3">Tier</p>
            <div className="flex flex-wrap gap-3">
              {["Tier 0", "Tier 1", "Tier 2"].map((tier) => (
                <label
                  key={tier}
                  className="flex items-center space-x-2 cursor-pointer py-2 px-4 border border-[#E5E5E5] rounded-full transition-colors duration-200 bg-white"
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier}
                    checked={localFilters.tier === tier}
                    onChange={() => handleTierChange(tier)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200
                      ${
                        localFilters.tier === tier
                          ? "border-[#B88E00] bg-[#B88E00]"
                          : "border-[#D5D5D5]"
                      }`}
                  >
                    {localFilters.tier === tier && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={4}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#5F6366]">{tier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* KYC Status Filter */}
          <div className="mb-8 border-t border-[#E8E8E8] pt-6">
            <p className="text-[#222] text-sm font-semibold mb-3">KYC Status</p>
            <div className="flex flex-wrap gap-3">
              {kycStatuses.map((status) => (
                <label
                  key={status}
                  className="flex items-center space-x-2 cursor-pointer py-2 px-4 border border-[#E5E5E5] rounded-full transition-colors duration-200 bg-white"
                >
                  <input
                    type="checkbox"
                    value={status}
                    checked={localFilters.kycStatus.includes(status)}
                    onChange={() => handleKycStatusChange(status)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200
                      ${
                        localFilters.kycStatus.includes(status)
                          ? "border-[#B88E00] bg-[#B88E00]"
                          : "border-[#D5D5D5]"
                      }`}
                  >
                    {localFilters.kycStatus.includes(status) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={4}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#5F6366]">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-8">
            <button
              onClick={handleReset}
              className="py-3 text-[rgba(34,34,34,0.80)] font-medium rounded-full bg-transparent border border-[#E5E5E5] hover:bg-gray-100 transition-colors duration-200 w-full"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              disabled={!hasChanges}
              className="py-3 text-white font-medium rounded-full bg-[#B88E00] hover:bg-[#A07A00] transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersModal;