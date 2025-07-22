import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SettingsWrapper() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isIdentityVerification = location.pathname.endsWith(
    "/settings/identity-verification"
  );
  const isChangePassword =
    location.pathname.endsWith("/settings/change-password") ||
    location.pathname.endsWith("/settings/forgot-password") ||
    location.pathname.endsWith("/settings/verify-phone-email") ||
    location.pathname.endsWith("/settings/reset-password");

  const isNotifications = location.pathname.endsWith("/settings/notifications");
  const isSupport = location.pathname.endsWith("/settings/support");
  const isForgotPassword = location.pathname.endsWith(
    "/settings/forgot-password"
  );
  const isVerifyPhoneEmail = location.pathname.endsWith(
    "/settings/verify-phone-email"
  );

  const isResetPassword = location.pathname.endsWith(
    "/settings/reset-password"
  );

  const isSettingItem =
    isIdentityVerification ||
    isChangePassword ||
    isNotifications ||
    isSupport ||
    isForgotPassword ||
    isVerifyPhoneEmail ||
    isResetPassword;

  return (
    <div className="lg:w-[95%] lg:mx-auto">
      <p
        className={`${
          isSettingItem ? "hidden" : "block"
        } text-[#222] font-raleway font-semibold text-[24px] mb-6 pl-2.5 lg:pl-0 lg:text-[32px] lg:block lg:mt-5`}
      >
        {t("settings.title")}
      </p>

      <div className="px-6 lg:flex lg:justify-between lg:gap-6 lg:px-1">
        <div
          className={`flex flex-col gap-5 pl-1 lg:w-[20%] ${
            isIdentityVerification ||
            isChangePassword ||
            isNotifications ||
            isSupport
              ? "hidden lg:flex"
              : "flex"
          }`}
        >
          <button
            onClick={() => navigate("/settings/identity-verification")}
            className={`flex items-center gap-2.5 px-2 py-1 rounded-lg cursor-pointer ${
              isIdentityVerification
                ? "bg-white text-[#439182]"
                : "text-[#404040]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M6.33333 9.69625L8.11111 11.5064L11.6667 7.88606M16.6604 4.2515C16.4784 4.26089 16.2953 4.26564 16.1111 4.26564C13.3791 4.26564 10.8871 3.21986 8.99991 1.5C7.11281 3.21979 4.62079 4.26553 1.88889 4.26553C1.70468 4.26553 1.52158 4.26078 1.33967 4.25139C1.11796 5.12355 1 6.03823 1 6.98097C1 12.0418 4.3994 16.2942 9 17.5C13.6006 16.2942 17 12.0418 17 6.98097C17 6.03827 16.882 5.12362 16.6604 4.2515Z"
                stroke={isIdentityVerification ? "#439182" : "#A3A3A3"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={`md:text-[16px] font-medium`}>
              {t("settings.identity")}
            </span>
          </button>

          <button
            onClick={() => navigate("/settings/change-password")}
            className={`flex items-center gap-2.5 px-2 py-1 rounded-lg cursor-pointer ${
              isChangePassword ? "bg-white text-[#439182]" : "text-[#404040]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M11.6667 5.05556C12.6485 5.05556 13.4444 5.85149 13.4444 6.83333M17 6.83333C17 9.77884 14.6122 12.1667 11.6667 12.1667C11.1278 12.1667 10.6077 12.0868 10.1174 11.9381L8.11111 13.9444H6.33333V15.7222H4.55556V17.5H1.88889C1.39797 17.5 1 17.102 1 16.6111V14.3126C1 14.0769 1.09365 13.8508 1.26035 13.6841L6.56184 8.38258C6.41324 7.89236 6.33333 7.37215 6.33333 6.83333C6.33333 3.88781 8.72116 1.5 11.6667 1.5C14.6122 1.5 17 3.88781 17 6.83333Z"
                stroke={isChangePassword ? "#439182" : "#A3A3A3"}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="md:text-[16px] font-medium">
              {t("settings.changePassword")}
            </span>
          </button>

          <button
            onClick={() => navigate("/settings/notifications")}
            className={`flex items-center gap-2.5 px-2 py-1 rounded-lg cursor-pointer ${
              isNotifications ? "bg-white text-[#439182]" : "text-[#404040]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
            >
              <path
                d="M12 15.5H17L15.5951 14.0951C15.2141 13.7141 15 13.1973 15 12.6585V9.5C15 6.88757 13.3304 4.66509 11 3.84142V3.5C11 2.39543 10.1046 1.5 9 1.5C7.8954 1.5 7 2.39543 7 3.5V3.84142C4.66962 4.66509 3 6.88757 3 9.5V12.6585C3 13.1973 2.78595 13.7141 2.40493 14.0951L1 15.5H6M12 15.5V16.5C12 18.1569 10.6569 19.5 9 19.5C7.3431 19.5 6 18.1569 6 16.5V15.5M12 15.5H6"
                stroke={isNotifications ? "#439182" : "#A3A3A3"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="md:text-[16px] font-medium">
              {t("settings.notifications")}
            </span>
          </button>

          <button
            onClick={() => navigate("/settings/support")}
            className={`flex items-center gap-2.5 px-2 py-1 rounded-lg cursor-pointer ${
              isSupport ? "bg-white text-[#439182]" : "text-[#404040]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
            >
              <path
                d="M5.50725 0.5C4.04663 0.5 2.64584 1.08023 1.61304 2.11304C0.580226 3.14584 0 4.54663 0 6.00725C0 6.29937 0.116045 6.57953 0.322607 6.78609C0.529169 6.99265 0.809327 7.1087 1.10145 7.1087C1.39357 7.1087 1.67373 6.99265 1.88029 6.78609C2.08685 6.57953 2.2029 6.29937 2.2029 6.00725C2.2029 4.18104 3.68104 2.7029 5.50725 2.7029C7.33345 2.7029 8.81159 4.18104 8.81159 6.00725C8.81159 6.90603 8.59241 7.43252 8.32916 7.80151C8.04058 8.20354 7.64075 8.50423 7.08672 8.88643L6.95896 8.97235C6.46661 9.30939 5.83217 9.74226 5.34093 10.3459C4.76046 11.0596 4.4058 11.9617 4.4058 13.1667V13.7174C4.4058 14.0095 4.52184 14.2897 4.7284 14.4962C4.93497 14.7028 5.21512 14.8188 5.50725 14.8188C5.79937 14.8188 6.07953 14.7028 6.28609 14.4962C6.49265 14.2897 6.6087 14.0095 6.6087 13.7174V13.1667C6.6087 12.4441 6.80475 12.0388 7.04927 11.7359C7.33235 11.39 7.71345 11.1279 8.27629 10.7413L8.33467 10.7005C8.88099 10.326 9.58261 9.83478 10.119 9.08359C10.6841 8.29936 11.0145 7.31026 11.0145 6.00725C11.0145 4.54663 10.4343 3.14584 9.40146 2.11304C8.36865 1.08023 6.96786 0.5 5.50725 0.5ZM5.50725 19.5C5.8724 19.5 6.2226 19.3549 6.4808 19.0967C6.739 18.8385 6.88406 18.4883 6.88406 18.1232C6.88406 17.758 6.739 17.4078 6.4808 17.1496C6.2226 16.8914 5.8724 16.7464 5.50725 16.7464C5.14209 16.7464 4.7919 16.8914 4.53369 17.1496C4.27549 17.4078 4.13043 17.758 4.13043 18.1232C4.13043 18.4883 4.27549 18.8385 4.53369 19.0967C4.7919 19.3549 5.14209 19.5 5.50725 19.5Z"
                fill={isSupport ? "#439182" : "#A3A3A3"}
              />
            </svg>
            <span className="md:text-[16px] font-medium">
              {" "}
              {t("settings.support")}
            </span>
          </button>
        </div>

        <div
          className={`w-full ${
            isIdentityVerification ||
            isChangePassword ||
            isNotifications ||
            isSupport
              ? "flex"
              : "hidden"
          } lg:flex lg:w-[80%] lg:px-7 lg:pb-20`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
