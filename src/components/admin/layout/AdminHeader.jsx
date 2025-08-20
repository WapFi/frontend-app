
import { useEffect, useState, useRef } from "react";
import emailIcon from "../../../assets/email icon.svg";
import { use_UserData } from "../../../context/UserContext";
import { fetchUserMe } from "../../../api/apiData";
import PageLoader from "../../PageLoader";
import { useNotifications } from "../../../context/NotificationContext";
import AdminNotificationsDropdown from "./AdminNotificationsDropdown";

function AdminHeader({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { userData, setUserData } = use_UserData();
  const { unreadCount, refreshNotificationsCount } = useNotifications();
  const notificationsRef = useRef(null);

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetchUserMe();
      if (response && response.status === true) {
        setUserData(response.data);
      }
    };
    getUserData();
  }, [setUserData]);

  useEffect(() => {
    // This useEffect handles the fetch for unread notifications count
    if (!showNotifications) {
      refreshNotificationsCount();
    }
  }, [showNotifications]);

  useEffect(() => {
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!userData || unreadCount === null || unreadCount === undefined) {
    return <PageLoader />;
  }

  const nameParts = userData.full_name?.split(" ");
  const initials = nameParts
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : "";

  return (
    <header className="" style={{ backgroundColor: "#F7F7F6" }}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right side - notifications and profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 relative cursor-pointer"
              >
                <svg
                  className="w-8 h-8 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>

                {/* Notification dot with unread count */}
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <AdminNotificationsDropdown
                  onNotificationAction={refreshNotificationsCount}
                />
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {initials}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-5">
                  <div className="p-4">
                    <div className="flex flex-col items-center space-x-3 border border-[rgba(0,0,0,0.08)] rounded-[8px] py-5 gap-2">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {initials}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-900 text-center">
                          {userData.full_name}
                        </p>
                        <div className="flex gap-2 items-center">
                          <img
                            src={emailIcon}
                            alt="email icon"
                            className="w-[15px] h-[12px] md:w-[20px] md:h-[16px]"
                          />
                          <span className="text-xs text-gray-500">
                            {userData.identifier}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
