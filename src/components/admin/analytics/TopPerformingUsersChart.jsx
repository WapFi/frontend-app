

import lowIcon from "../../../assets/verified icon.svg";
import highIcon from "../../../assets/failed icon.svg";
import mediumIcon from "../../../assets/pending icon.svg";

function TopPerformingUsersChart({ users = [], onUserClick }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-gray-500">No top performing users available</div>
    );
  }

  return (
    <div className="font-heebo">
      <p className="text-[#222] font-raleway font-semibold text-[18px] lg:mb-5 mb-6">
        Top Performing Users
      </p>

      {/* Desktop/table - only shows on large screens */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left font-medium text-[#222] tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-medium text-[#222] tracking-wider">Tier</th>
              <th className="px-6 py-3 text-left font-medium text-[#222] tracking-wider">Total Repaid</th>
              <th className="px-6 py-3 text-left font-medium text-[#222] tracking-wider">Credit Score</th>
              <th className="px-6 py-3 text-left font-medium text-[#222] tracking-wider">Default Risk</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => (
              <tr
                key={user.id || index}
                className="hover:bg-gray-50 cursor-pointer text-[#484747]"
                onClick={() => onUserClick(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C2C2C]">
                  {user.name || user.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-[#444]">
                  {`Tier ${user.tier}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#444] font-medium">
                  ₦{Number(user.total_repaid).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#444] font-medium">
                  {user.credit_score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`rounded-md ${
                      user.default_risk === "Low"
                        ? "bg-[#F2FDF5]"
                        : user.default_risk === "Medium"
                        ? "bg-[rgba(217,145,0,0.14)]"
                        : "bg-[rgba(239,68,68,0.08)]"
                    } flex gap-1 items-center py-0.5 px-1.5 w-fit`}
                  >
                    <img
                      src={
                        user.default_risk === "Low"
                          ? lowIcon
                          : user.default_risk === "High"
                          ? highIcon
                          : mediumIcon
                      }
                      alt="risk icon"
                      className="w-3 h-3"
                    />
                    <span
                      className={`text-xs font-medium ${
                        user.default_risk === "Low"
                          ? "text-[#16A34A]"
                          : user.default_risk === "Medium"
                          ? "text-[#D99100]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {user.default_risk}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/cards - only show on small screens, Name/Tier combined */}
      <div className="lg:hidden flex flex-col gap-3">
        {/* Mobile Header Row */}
        <div className="grid grid-cols-4 px-1 pb-2 text-sm text-[#222] font-semibold border-b border-b-[#E6E6E6]">
          <div>Name / Tier</div>
          <div>Total Repaid</div>
          <div>Credit Score</div>
          <div>Default Risk</div>
        </div>
        {users.map((user, index) => (
          <div
            key={user.id || index}
            className="grid grid-cols-4 gap-x-2 items-center px-1 py-2 cursor-pointer bg-white"
            onClick={() => onUserClick(user)}
          >
            {/* Name / Tier Column (combined in mobile) */}
            <div className="flex flex-col">
              <span className="font-semibold text-[#2C2C2C] text-xs">{user.name || user.full_name}</span>
              <span className="mt-1 text-xs font-medium text-[#444]">{`Tier ${user.tier}`}</span>
            </div>
            {/* Total Repaid */}
            <div className="text-[#444] text-xs font-medium">
              ₦{Number(user.total_repaid).toLocaleString()}
            </div>
            {/* Credit Score */}
            <div className="text-[#444] text-xs font-medium">{user.credit_score}</div>
            {/* Default Risk */}
            <div>
              <div
                className={`rounded-md ${
                  user.default_risk === "Low"
                    ? "bg-[#F2FDF5]"
                    : user.default_risk === "Medium"
                    ? "bg-[rgba(217,145,0,0.14)]"
                    : "bg-[rgba(239,68,68,0.08)]"
                } flex gap-1 items-center py-0.5 px-1.5 w-fit`}
              >
                <img
                  src={
                    user.default_risk === "Low"
                      ? lowIcon
                      : user.default_risk === "High"
                      ? highIcon
                      : mediumIcon
                  }
                  alt="risk icon"
                  className="w-3 h-3"
                />
                <span
                  className={`text-xs font-medium ${
                    user.default_risk === "Low"
                      ? "text-[#16A34A]"
                      : user.default_risk === "Medium"
                      ? "text-[#D99100]"
                      : "text-[#EF4444]"
                  }`}
                >
                  {user.default_risk}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopPerformingUsersChart;
