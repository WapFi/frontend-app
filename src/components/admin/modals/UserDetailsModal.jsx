import { useEffect, useState } from "react";
import { updateUserStatus, getUserDetails } from "../../../api/adminApi";
import { toast } from "react-toastify";
import PageLoader from "../../PageLoader";
import NairaIcon from "../../../assets/naira icon.svg";

function UserDetailsModal({ user, onClose, onUserUpdate }) {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailedUser, setDetailedUser] = useState(null);
  const [detailsError, setDetailsError] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  if (!user) return null;

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-NG", {
      style: "decimal",

      maximumFractionDigits: 2,
    }).format(value);
  }

  const handleBlockUser = async () => {
    try {
      setLoading(true);
      await updateUserStatus(user._id, "INACTIVE");
      toast.success("User blocked successfully");
      setShowBlockModal(false);
      if (onUserUpdate) {
        onUserUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      setLoading(true);
      await updateUserStatus(user._id, "DEACTIVATED");
      toast.success("User deactivated successfully");
      setShowDeactivateModal(false);
      if (onUserUpdate) {
        onUserUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch the full user details
  useEffect(() => {
    console.log("success: ");
    // Only run if a user is selected
    console.log(user);
    console.log(user._id);
    if (user && user._id) {
      console.log("In here");
      const fetchUserDetails = async () => {
        setIsLoadingDetails(true);
        setDetailsError(null);
        try {
          const response = await getUserDetails(user._id);
          console.log(response);
          if (response && response.data) {
            const fullUserData = response.data;
            setDetailedUser(fullUserData);
          } else {
            setDetailsError(response.data?.message);
            setDetailedUser(null);
          }
        } catch (err) {
          console.error("Error fetching detailed user data:", err);
          setDetailsError(err.response?.data?.message);
        } finally {
          setIsLoadingDetails(false);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  if (isLoadingDetails) {
    return <PageLoader />;
  }

  if (!detailedUser) {
    // Return a loading indicator or just null.
    // Given the `isLoadingDetails` check, this case might only be hit if the fetch fails
    // and `isLoadingDetails` is set back to false.
    return null;
  }

  console.log("detailed user: ", detailedUser);
  // console.log(user.loan_due_date);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-2 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar and Info */}
          <div className="flex items-center space-x-4 border border-gray-200 p-4 rounded-t-lg mb-0">
            <div className="w-22 h-22 bg-gray-300 rounded-full flex items-center justify-center">
              {detailedUser.profile_picture ? (
                <img
                  src={detailedUser.profile_picture}
                  alt={`${detailedUser.full_name}'s avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-medium text-gray-600">
                  {detailedUser.full_name
                    ? detailedUser.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "No Name"}{" "}
                  {/* Fallback for cases where full_name might also be empty or null */}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {detailedUser.full_name}
              </h3>
              <p className="text-sm text-gray-500">
                Tier {detailedUser.credit_tier}
              </p>

              <div className="flex items-center space-x-6">
                {/* Phone with icon */}
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 ">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.94151 14.0585C3.84908 11.962 2.23992 9.43372 1.22658 6.65044C0.669076 5.12874 1.17988 3.45721 2.32601 2.31107L3.0353 1.60276C3.22598 1.41168 3.45248 1.2601 3.70182 1.15667C3.95117 1.05324 4.21846 1 4.4884 1C4.75834 1 5.02564 1.05324 5.27498 1.15667C5.52432 1.2601 5.75082 1.41168 5.94151 1.60276L7.60234 3.26359C7.79341 3.45427 7.945 3.68077 8.04842 3.93011C8.15185 4.17946 8.20509 4.44675 8.20509 4.71669C8.20509 4.98664 8.15185 5.25393 8.04842 5.50327C7.945 5.75262 7.79341 5.97911 7.60234 6.1698L7.1937 6.57844C7.03013 6.74197 6.90038 6.93613 6.81185 7.14981C6.72333 7.3635 6.67777 7.59253 6.67777 7.82382C6.67777 8.05512 6.72333 8.28415 6.81185 8.49783C6.90038 8.71152 7.03013 8.90567 7.1937 9.0692L10.9298 12.8063C11.0934 12.9699 11.2875 13.0996 11.5012 13.1882C11.7149 13.2767 11.9439 13.3222 12.1752 13.3222C12.4065 13.3222 12.6355 13.2767 12.8492 13.1882C13.0629 13.0996 13.2571 12.9699 13.4206 12.8063L13.8302 12.3977C14.0209 12.2066 14.2474 12.055 14.4967 11.9516C14.7461 11.8482 15.0134 11.7949 15.2833 11.7949C15.5533 11.7949 15.8205 11.8482 16.0699 11.9516C16.3192 12.055 16.5457 12.2066 16.7364 12.3977L18.3972 14.0585C18.5883 14.2492 18.7399 14.4757 18.8433 14.725C18.9468 14.9744 19 15.2417 19 15.5116C19 15.7816 18.9468 16.0489 18.8433 16.2982C18.7399 16.5475 18.5883 16.774 18.3972 16.9647L17.6889 17.673C16.5428 18.8201 14.8713 19.3309 13.3496 18.7734C10.5663 17.7601 8.03799 16.1509 5.94151 14.0585Z"
                        stroke="#444444"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">{detailedUser.phone}</p>
                </div>

                {/* Email with icon */}
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 mr-3">
                    <svg
                      width="22"
                      height="18"
                      viewBox="0 0 22 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4.06L10.87 9.95C10.94 10.01 11.06 10.01 11.13 9.95L18 4.06M2.2 1H19.8C20.46 1 21 1.54 21 2.2V14.6C21 15.92 19.92 17 18.6 17H3.4C2.08 17 1 15.92 1 14.6V2.2C1 1.54 1.54 1 2.2 1Z"
                        stroke="#444444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">{detailedUser.email}</p>
                </div>

                {/* BVN Verification Status */}
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 tracking-wide mb-1">
                    BVN
                  </p>
                  <div
                    className={`flex items-center space-x-1 px-2 py-1.5 rounded border ${
                      detailedUser.bvn_verified
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-500"
                    }`}
                  >
                    {detailedUser.bvn_verified ? (
                      <>
                        <div className="w-3 h-3">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12.1225 9.1216C12.5083 8.91758 12.8311 8.61223 13.0563 8.2384C13.2815 7.86458 13.4005 7.43642 13.4005 7C13.4005 6.56359 13.2815 6.13543 13.0563 5.7616C12.8311 5.38777 12.5083 5.08242 12.1225 4.8784C12.2511 4.46136 12.2635 4.01715 12.1585 3.59356C12.0534 3.16998 11.8348 2.78305 11.5263 2.47442C11.2177 2.16578 10.8309 1.94712 10.4073 1.84196C9.98376 1.7368 9.53954 1.74913 9.12247 1.8776C8.91852 1.49161 8.61315 1.16856 8.23923 0.943225C7.86532 0.717892 7.43703 0.598816 7.00046 0.598816C6.5639 0.598816 6.13561 0.717892 5.7617 0.943225C5.38778 1.16856 5.08241 1.49161 4.87847 1.8776C4.46142 1.74901 4.01721 1.73657 3.59362 1.84162C3.17004 1.94666 2.78311 2.16522 2.47448 2.47377C2.16584 2.78233 1.94718 3.1692 1.84202 3.59275C1.73686 4.01631 1.74919 4.46053 1.87767 4.8776C1.49167 5.08155 1.16862 5.38692 0.943286 5.76084C0.717953 6.13475 0.598877 6.56304 0.598877 6.9996C0.598877 7.43616 0.717953 7.86446 0.943286 8.23837C1.16862 8.61228 1.49167 8.91765 1.87767 9.1216C1.74907 9.53865 1.73663 9.98286 1.84168 10.4064C1.94673 10.83 2.16528 11.217 2.47384 11.5256C2.78239 11.8342 3.16926 12.0529 3.59281 12.158C4.01637 12.2632 4.46059 12.2509 4.87767 12.1224C5.08161 12.5084 5.38698 12.8314 5.7609 13.0568C6.13481 13.2821 6.5631 13.4012 6.99967 13.4012C7.43623 13.4012 7.86452 13.2821 8.23843 13.0568C8.61235 12.8314 8.91772 12.5084 9.12167 12.1224C9.53871 12.251 9.98292 12.2634 10.4065 12.1584C10.8301 12.0533 11.217 11.8348 11.5257 11.5262C11.8343 11.2177 12.0529 10.8308 12.1581 10.4073C12.2633 9.9837 12.2509 9.53868 12.1225 9.1216ZM10.0857 5.5536C10.132 5.48983 10.1654 5.41755 10.1839 5.34089C10.2023 5.26422 10.2055 5.18467 10.1932 5.10678C10.1809 5.02889 10.1534 4.95419 10.1122 4.88693C10.071 4.81968 10.017 4.76119 9.95327 4.7148C9.88949 4.66842 9.81721 4.63505 9.74055 4.6166C9.66388 4.59816 9.58433 4.59499 9.50644 4.60728C9.42855 4.61958 9.35385 4.64709 9.28659 4.68826C9.21934 4.72942 9.16085 4.78343 9.11446 4.8472L6.32807 8.6792L4.82407 7.1752C4.76869 7.11792 4.70246 7.07225 4.62924 7.04084C4.55603 7.00943 4.47729 6.99291 4.39762 6.99226C4.31795 6.9916 4.23895 7.00682 4.16523 7.03702C4.09151 7.06723 4.02454 7.11181 3.96823 7.16817C3.91192 7.22453 3.8674 7.29155 3.83726 7.3653C3.80713 7.43905 3.79199 7.51806 3.79272 7.59773C3.79345 7.6774 3.81003 7.75612 3.84151 7.82931C3.87299 7.9025 3.91873 7.96868 3.97607 8.024L5.97607 10.024C6.03737 10.0853 6.11123 10.1327 6.19258 10.1627C6.27393 10.1927 6.36082 10.2048 6.44727 10.198C6.53373 10.1913 6.61769 10.1658 6.69337 10.1235C6.76905 10.0812 6.83466 10.0229 6.88567 9.9528L10.0857 5.5528V5.5536Z"
                              fill="#16A34A"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 ">
                          <svg
                            width="11"
                            height="12"
                            viewBox="0 0 11 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.5 1.53125C4.31481 1.53125 3.17817 2.00206 2.34012 2.84012C1.50206 3.67817 1.03125 4.81481 1.03125 6C1.03125 6.58684 1.14684 7.16794 1.37141 7.71012C1.59599 8.25229 1.92515 8.74492 2.34012 9.15988C2.75508 9.57485 3.24771 9.90401 3.78988 10.1286C4.33206 10.3532 4.91316 10.4688 5.5 10.4688C6.08684 10.4688 6.66794 10.3532 7.21012 10.1286C7.75229 9.90401 8.24492 9.57485 8.65988 9.15988C9.07485 8.74492 9.40401 8.25229 9.62859 7.71012C9.85316 7.16794 9.96875 6.58684 9.96875 6C9.96875 4.81481 9.49794 3.67817 8.65988 2.84012C7.82183 2.00206 6.68519 1.53125 5.5 1.53125ZM1.76559 2.26559C2.75602 1.27517 4.09933 0.71875 5.5 0.71875C6.90068 0.71875 8.24398 1.27517 9.23441 2.26559C10.2248 3.25602 10.7812 4.59933 10.7812 6C10.7812 6.69354 10.6446 7.3803 10.3792 8.02105C10.1138 8.6618 9.72482 9.244 9.23441 9.73441C8.744 10.2248 8.1618 10.6138 7.52105 10.8792C6.8803 11.1446 6.19354 11.2812 5.5 11.2812C4.80646 11.2812 4.1197 11.1446 3.47895 10.8792C2.8382 10.6138 2.256 10.2248 1.76559 9.73441C1.27518 9.244 0.886169 8.6618 0.620761 8.02105C0.355354 7.3803 0.21875 6.69354 0.21875 6C0.21875 4.59933 0.775166 3.25602 1.76559 2.26559ZM3.99399 4.49399C4.15264 4.33534 4.40986 4.33534 4.56851 4.49399L5.5 5.42548L6.43149 4.49399C6.59014 4.33534 6.84736 4.33534 7.00601 4.49399C7.16466 4.65264 7.16466 4.90986 7.00601 5.06851L6.07452 6L7.00601 6.93149C7.16466 7.09014 7.16466 7.34736 7.00601 7.50601C6.84736 7.66466 6.59014 7.66466 6.43149 7.50601L5.5 6.57452L4.56851 7.50601C4.40986 7.66466 4.15264 7.66466 3.99399 7.50601C3.83534 7.34736 3.83534 7.09014 3.99399 6.93149L4.92548 6L3.99399 5.06851C3.83534 4.90986 3.83534 4.65264 3.99399 4.49399Z"
                              fill="#EF4444"
                            />
                          </svg>
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#EF4444" }}
                        >
                          Unverified
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Phone Verification Status */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 tracking-wide mb-1">
                    Phone Number
                  </span>
                  <div
                    className={`flex items-center gap-2 space-x-1 px-2 py-1.5 rounded border ${
                      detailedUser.phone_verified
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-500"
                    }`}
                  >
                    {detailedUser.phone_verified ? (
                      <>
                        <div className="w-4 h-4">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.94151 14.0585C3.84908 11.962 2.23992 9.43372 1.22658 6.65044C0.669076 5.12874 1.17988 3.45721 2.32601 2.31107L3.0353 1.60276C3.22598 1.41168 3.45248 1.2601 3.70182 1.15667C3.95117 1.05324 4.21846 1 4.4884 1C4.75834 1 5.02564 1.05324 5.27498 1.15667C5.52432 1.2601 5.75082 1.41168 5.94151 1.60276L7.60234 3.26359C7.79341 3.45427 7.945 3.68077 8.04842 3.93011C8.15185 4.17946 8.20509 4.44675 8.20509 4.71669C8.20509 4.98664 8.15185 5.25393 8.04842 5.50327C7.945 5.75262 7.79341 5.97911 7.60234 6.1698L7.1937 6.57844C7.03013 6.74197 6.90038 6.93613 6.81185 7.14981C6.72333 7.3635 6.67777 7.59253 6.67777 7.82382C6.67777 8.05512 6.72333 8.28415 6.81185 8.49783C6.90038 8.71152 7.03013 8.90567 7.1937 9.0692L10.9298 12.8063C11.0934 12.9699 11.2875 13.0996 11.5012 13.1882C11.7149 13.2767 11.9439 13.3222 12.1752 13.3222C12.4065 13.3222 12.6355 13.2767 12.8492 13.1882C13.0629 13.0996 13.2571 12.9699 13.4206 12.8063L13.8302 12.3977C14.0209 12.2066 14.2474 12.055 14.4967 11.9516C14.7461 11.8482 15.0134 11.7949 15.2833 11.7949C15.5533 11.7949 15.8205 11.8482 16.0699 11.9516C16.3192 12.055 16.5457 12.2066 16.7364 12.3977L18.3972 14.0585C18.5883 14.2492 18.7399 14.4757 18.8433 14.725C18.9468 14.9744 19 15.2417 19 15.5116C19 15.7816 18.9468 16.0489 18.8433 16.2982C18.7399 16.5475 18.5883 16.774 18.3972 16.9647L17.6889 17.673C16.5428 18.8201 14.8713 19.3309 13.3496 18.7734C10.5663 17.7601 8.03799 16.1509 5.94151 14.0585Z"
                              stroke="#444444"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 ">
                          <svg
                            width="11"
                            height="12"
                            viewBox="0 0 11 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.5 1.53125C4.31481 1.53125 3.17817 2.00206 2.34012 2.84012C1.50206 3.67817 1.03125 4.81481 1.03125 6C1.03125 6.58684 1.14684 7.16794 1.37141 7.71012C1.59599 8.25229 1.92515 8.74492 2.34012 9.15988C2.75508 9.57485 3.24771 9.90401 3.78988 10.1286C4.33206 10.3532 4.91316 10.4688 5.5 10.4688C6.08684 10.4688 6.66794 10.3532 7.21012 10.1286C7.75229 9.90401 8.24492 9.57485 8.65988 9.15988C9.07485 8.74492 9.40401 8.25229 9.62859 7.71012C9.85316 7.16794 9.96875 6.58684 9.96875 6C9.96875 4.81481 9.49794 3.67817 8.65988 2.84012C7.82183 2.00206 6.68519 1.53125 5.5 1.53125ZM1.76559 2.26559C2.75602 1.27517 4.09933 0.71875 5.5 0.71875C6.90068 0.71875 8.24398 1.27517 9.23441 2.26559C10.2248 3.25602 10.7812 4.59933 10.7812 6C10.7812 6.69354 10.6446 7.3803 10.3792 8.02105C10.1138 8.6618 9.72482 9.244 9.23441 9.73441C8.744 10.2248 8.1618 10.6138 7.52105 10.8792C6.8803 11.1446 6.19354 11.2812 5.5 11.2812C4.80646 11.2812 4.1197 11.1446 3.47895 10.8792C2.8382 10.6138 2.256 10.2248 1.76559 9.73441C1.27518 9.244 0.886169 8.6618 0.620761 8.02105C0.355354 7.3803 0.21875 6.69354 0.21875 6C0.21875 4.59933 0.775166 3.25602 1.76559 2.26559ZM3.99399 4.49399C4.15264 4.33534 4.40986 4.33534 4.56851 4.49399L5.5 5.42548L6.43149 4.49399C6.59014 4.33534 6.84736 4.33534 7.00601 4.49399C7.16466 4.65264 7.16466 4.90986 7.00601 5.06851L6.07452 6L7.00601 6.93149C7.16466 7.09014 7.16466 7.34736 7.00601 7.50601C6.84736 7.66466 6.59014 7.66466 6.43149 7.50601L5.5 6.57452L4.56851 7.50601C4.40986 7.66466 4.15264 7.66466 3.99399 7.50601C3.83534 7.34736 3.83534 7.09014 3.99399 6.93149L4.92548 6L3.99399 5.06851C3.83534 4.90986 3.83534 4.65264 3.99399 4.49399Z"
                              fill="#EF4444"
                            />
                          </svg>
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#EF4444" }}
                        >
                          Unverified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="space-y-4  border border-gray-200 p-4 rounded-b-lg border-t-0">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Registered Date
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(detailedUser.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Total Loan
                </p>
                <div className="flex items-center gap-1">
                  <img src={NairaIcon} alt="naira icon" />
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(detailedUser.total_loan_taken)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Credit Score
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {detailedUser.credit_score}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Loan Due Date
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {" "}
                  {new Date(detailedUser.loan_due_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Outstanding Loan
                </p>
                <div className="flex items-center gap-1">
                  <img src={NairaIcon} alt="naira icon" />
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(detailedUser.outstanding_loan)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Amount Paid
                </p>
                <div className="flex items-center gap-1">
                  <img src={NairaIcon} alt="naira icon" />
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(detailedUser.amount_repaid)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowBlockModal(true)}
              style={{ background: "#B88E00" }}
              className="text-sm border-gray-100 w-32 bg-yellow-500 text-white py-2 px-2 rounded-full font-medium hover:bg-yellow-600 transition-colors"
            >
              Block User
            </button>
            <button className="text-sm w-32 border border-gray-100 text-dark py-2 px-2 rounded-full font-medium hover:bg-yellow-600 transition-colors">
              View Repayment
            </button>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="text-sm w-32 border border-gray-100 text-red-700 py-2 px-2 rounded-full font-medium hover:bg-red-200 transition-colors"
            >
              Deactivate User
            </button>
          </div>
        </div>
      </div>

      {/* Block User Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 py-8">
              Block User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to block this user?
            </p>
            <div className="flex space-x-3 pb-8">
              <button
                onClick={handleBlockUser}
                disabled={loading}
                style={{ background: "#B88E00" }}
                className="flex-1 text-white py-2 px-4 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Blocking..." : "Block User"}
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 bg-white text-black border border-gray-300 py-2 px-4 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate User Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 py-8">
              Deactivate User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate this user?
            </p>
            <div className="flex space-x-3 pb-8">
              <button
                onClick={handleDeactivateUser}
                disabled={loading}
                style={{ background: "#B88E00" }}
                className="flex-1 text-white py-2 px-4 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deactivating..." : "Deactivate User"}
              </button>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-white text-black border border-gray-300 py-2 px-4 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetailsModal;
