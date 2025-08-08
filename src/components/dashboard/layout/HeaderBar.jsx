import NigerianFlag from "../../../assets/Nigerian Flag.svg";
import UKFlag from "../../../assets/UK Flag.svg";
import DateDisplay from "../DateDisplay";
import calendarIcon from "../../../assets/calendar icon.svg";
import bellIcon from "../../../assets/bell icon.svg";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

function HeaderBar({
  userData,
  onOpenUserProfile,
  onOpenUserNotifications,
  unreadNotificationCount,
  loadingUnreadCount,
  errorUnreadCount,
}) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const nameParts = userData.full_name?.split(" ");
  const initials = nameParts
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : "";

  return (
    <div className="text-[#222] flex justify-between items-center grow pt-8 md:px-3 lg:px-[28px]">
      <div className="flex items-center gap-2">
        <img
          src={calendarIcon}
          alt="calendar icon"
          className="w-[18px] h-[17.582px]"
        />
        <p className="text-[#2D6157] font-semibold flex gap-1 items-center">
          {" "}
          {t("header_bar.today")}, <DateDisplay />{" "}
        </p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setLanguage("en")}
        >
          <img src={UKFlag} alt="Flag of the UK" />
          <span
            className={`md:text-[16px]  ${
              language === "en" ? "text-[#2D6157]" : "text-[#222]"
            }`}
          >
            English
          </span>
        </div>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setLanguage("ha")}
        >
          <img src={NigerianFlag} alt="Flag of Nigeria" />
          <span
            className={`md:text-[16px]  ${
              language === "ha" ? "text-[#2D6157]" : "text-[#222]"
            }`}
          >
            Hausa
          </span>
        </div>

        <button
          className="rounded-full py-2 px-[8px] bg-[#fff] text-white text-center font-medium relative cursor-pointer"
          onClick={onOpenUserNotifications}
        >
          <img src={bellIcon} alt="notification bell" />
          {!loadingUnreadCount && !errorUnreadCount && (
            <span className="border-[rgba(229,62,62,0.30)] bg-[rgba(229,62,62,0.08)] absolute -top-1 -right-[3px] text-[#E53E3E] text-[12px] w-5 h-5 p-[1px] gap-[10px] flex items-center justify-center rounded-[6px] font-semibold">
              {unreadNotificationCount}
            </span>
          )}
          {/* {errorUnreadCount && (
          <span className="fixed top-1/2 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-400 bg-red-200 rounded-full transform translate-x-1/2 -translate-y-1/2">
             {errorUnreadCount}
          </span>
        )} */}
        </button>
        <button
          className={`rounded-full bg-[#171717] text-white text-center font-medium cursor-pointer w-9 h-9 ${
            userData.profile_picture ? "p-0" : "py-1 px-[7px]"
          }`}
          onClick={onOpenUserProfile}
        >
          {userData.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt={`${userData.full_name}'s avatar`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <p>{initials}</p>
          )}
        </button>
      </div>
    </div>
  );
}

export default HeaderBar;
