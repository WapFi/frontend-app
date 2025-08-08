import PageLoader from "../PageLoader";
import { useState, useEffect, useRef } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../api/apiData";
import { useTranslation } from "react-i18next";
// import LoadingSpinner from "../LoadingSpinner";

function formatTimeAgo(isoString, t) {
  if (!isoString) {
    return t("notifications.timeAgo.na");
  }

  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000; // years
  if (interval >= 1) {
    const count = Math.floor(interval);
    return t("notifications.timeAgo.year", { count });
  }
  interval = seconds / 2592000; // months
  if (interval >= 1) {
    const count = Math.floor(interval);
    return t("notifications.timeAgo.month", { count });
  }
  interval = seconds / 86400; // days
  if (interval >= 1) {
    const count = Math.floor(interval);
    return t("notifications.timeAgo.day", { count });
  }
  interval = seconds / 3600; // hours
  if (interval >= 1) {
    const count = Math.floor(interval);
    return t("notifications.timeAgo.hour", { count });
  }
  interval = seconds / 60; // minutes
  if (interval >= 1) {
    const count = Math.floor(interval);
    return t("notifications.timeAgo.minute", { count });
  }
  const count = Math.floor(seconds);
  return t("notifications.timeAgo.second", { count });
}

export default function ProfileNotifications({
  onClose,
  onNotificationAction,
}) {
  const { t } = useTranslation();

  const [notificationsList, setNotificationsList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false); // New state variable
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const messageTimeoutRef = useRef(null);

  const displayFeedbackMessage = (type, message) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    if (type === "success") {
      setSuccessMessage(message);
      setActionError(null);
    } else if (type === "error") {
      setActionError(message);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(null);
      setActionError(null);
    }

    if (message) {
      messageTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
        setActionError(null);
      }, 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const fetchNotificationsList = async () => {
    setListLoading(true);
    setListError(null);
    try {
      const axiosResponse = await getNotifications();
      const responseData = axiosResponse.data;

      if (responseData && responseData.status) {
        setNotificationsList(responseData.data?.notifications || []);
      } else {
        console.error("Failed to fetch notifications list:", responseData);
        const errorMsg =
          responseData?.data?.message || t("notifications.failedToLoad");
        setListError(errorMsg);
        setNotificationsList([]);
        displayFeedbackMessage("error", errorMsg);
      }
    } catch (err) {
      console.error("Error fetching notifications list:", err);
      const errorMsg =
        err.response?.data?.message || t("notifications.failedToConnect");
      setListError(errorMsg);
      setNotificationsList([]);
      displayFeedbackMessage("error", errorMsg);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsList();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    setIsProcessingAction(true);
    displayFeedbackMessage(null, null);
    try {
      const axiosResponse = await markAsRead(notificationId);
      const responseData = axiosResponse.data;

      if (responseData && responseData.status) {
        await fetchNotificationsList();
        if (onNotificationAction) {
          onNotificationAction();
        }
        displayFeedbackMessage(
          "success",
          responseData.data?.message || t("notifications.markAsReadSuccess")
        );
      } else {
        console.error("Failed to mark as read:", responseData);
        displayFeedbackMessage(
          "error",
          responseData.data?.message || t("notifications.failedToMarkAsRead")
        );
      }
    } catch (err) {
      console.error("Error marking as read:", err);
      displayFeedbackMessage(
        "error",
        err.response?.data?.message || t("notifications.failedToMarkAsRead")
      );
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllAsRead(true); // Use the new state variable
    displayFeedbackMessage(null, null);
    try {
      const axiosResponse = await markAllAsRead();
      const responseData = axiosResponse.data;

      if (responseData && responseData.status) {
        await fetchNotificationsList();
        if (onNotificationAction) {
          onNotificationAction();
        }
        displayFeedbackMessage(
          "success",
          responseData.data?.message || t("notifications.markAllAsReadSuccess")
        );
      } else {
        displayFeedbackMessage(
          "error",
          responseData?.data?.message ||
            t("notifications.failedToMarkAllAsRead")
        );
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
      displayFeedbackMessage(
        "error",
        err.response?.data?.message || t("notifications.failedToMarkAllAsRead")
      );
    } finally {
      setIsMarkingAllAsRead(false); // Reset the new state variable
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    setIsProcessingAction(true);
    displayFeedbackMessage(null, null);
    try {
      const axiosResponse = await deleteNotification(notificationId);
      const responseData = axiosResponse.data;

      if (responseData && responseData.status) {
        await fetchNotificationsList();
        if (onNotificationAction) {
          onNotificationAction();
        }
        displayFeedbackMessage(
          "success",
          responseData.data?.message ||
            t("notifications.deleteNotificationSuccess")
        );
      } else {
        console.error("Failed to delete notification:", responseData);
        displayFeedbackMessage(
          "error",
          responseData?.data?.message ||
            t("notifications.failedToDeleteNotification")
        );
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      displayFeedbackMessage(
        "error",
        err.response?.data?.message ||
          t("notifications.failedToDeleteNotification")
      );
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleClearAll = async () => {
    if (notificationsList.length === 0) return;

    setIsClearingAll(true);
    displayFeedbackMessage(null, null);

    const deletePromises = notificationsList.map((notif) =>
      deleteNotification(notif._id)
        .then((axiosResponse) => {
          if (!axiosResponse.data || !axiosResponse.data.status) {
            console.error(
              `Failed to delete notification ${notif._id}:`,
              axiosResponse.data
            );
            return {
              id: notif._id,
              status: "failed",
              error: axiosResponse.data?.message,
            };
          }
          return { id: notif._id, status: "fulfilled" };
        })
        .catch((err) => {
          console.error(`Error deleting notification ${notif._id}:`, err);
          return {
            id: notif._id,
            status: "rejected",
            error: err.response?.data?.message || err.message,
          };
        })
    );

    const results = await Promise.allSettled(deletePromises);

    const failedDeletions = results.filter(
      (result) =>
        result.status === "rejected" ||
        (result.status === "fulfilled" && result.value.status === "failed")
    );
    if (failedDeletions.length > 0) {
      displayFeedbackMessage(
        "error",
        t("notifications.failedToClear", { count: failedDeletions.length })
      );
    } else {
      displayFeedbackMessage("success", t("notifications.clearAllSuccess"));
    }

    await fetchNotificationsList();
    if (onNotificationAction) {
      onNotificationAction();
    }
    setIsClearingAll(false);
  };

  const unreadCountInModal = notificationsList.filter(
    (notif) => !notif.is_read
  ).length;

  if (listLoading) {
    return (
      <div className="fixed inset-0 bg-[#f8f8f8] bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6 relative flex justify-center items-center min-h-[200px]">
          <PageLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f8f8f8] bg-opacity-50 flex justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-auto md:w-[70%] md:my-6 lg:my-0 relative h-fit max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden 
  [-ms-overflow-style:none] 
  [scrollbar-width:none] pb-30"
      >
        <div className="p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center">
            <p className="font-raleway text-[20px] text-[#171717] font-semibold">
              {t("notifications.title")}
            </p>
            <button className="relative flex items-center justify-center w-9 h-9 bg-[#fff] rounded-full -top-2.5 -left-0.5">
              {!listLoading &&
                !isProcessingAction &&
                !isClearingAll &&
                unreadCountInModal > 0 && (
                  <span className="border border-[rgba(229,62,62,0.30)] bg-[rgba(229,62,62,0.08)] text-[#E53E3E] text-xs w-5 h-5 flex items-center justify-center rounded-[6px] font-semibold">
                    {unreadCountInModal}
                  </span>
                )}
            </button>
          </div>
          <button
            className="flex items-center justify-center w-7 h-7 cursor-pointer"
            onClick={onClose}
            aria-label={t("notifications.close")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"
                fill="#999999"
              />
            </svg>
          </button>
        </div>

        {/* Action Buttons: Mark all as read & Clear */}
        <div className="flex gap-2 text-[14px] p-6 pt-4 pb-3">
          {unreadCountInModal > 0 && (
            <button
              className="text-[#439182] cursor-pointer font-medium"
              onClick={handleMarkAllAsRead}
              disabled={
                isProcessingAction || isMarkingAllAsRead || isClearingAll
              }
            >
              {isMarkingAllAsRead
                ? t("notifications.markingAllAsRead")
                : t("notifications.markAllAsRead")}
            </button>
          )}
          {notificationsList.length > 0 && (
            <button
              className="text-[#EF4444] cursor-pointer font-medium"
              onClick={handleClearAll}
              disabled={
                isProcessingAction || isMarkingAllAsRead || isClearingAll
              }
            >
              {isClearingAll
                ? t("notifications.clearingAll")
                : t("notifications.clear")}
            </button>
          )}
        </div>

        {/* Display Error or Success Messages */}
        {actionError && (
          <div className="p-6 pt-0 text-red-600">{actionError}</div>
        )}
        {successMessage && (
          <div className="p-6 pt-0 text-green-500">{successMessage}</div>
        )}
        {listError && !actionError && !successMessage && (
          <div className="p-6 pt-0 text-red-600">{listError}</div>
        )}

        {/* Notifications List */}
        {notificationsList.length === 0 && !listError && !listLoading ? (
          <div className="p-6 text-gray-500">
            {t("notifications.noNotifications")}
          </div>
        ) : (
          <div>
            {notificationsList.map((notif) => (
              <div
                key={notif._id}
                className={`flex justify-between items-start border border-[#E5E5E5] border-r-0 border-l-2 p-6 pt-4 pb-4 ${
                  notif.is_read ? "border-l-gray-300" : "border-l-[#2D6157]"
                }`}
              >
                <div className="w-[80%] text-[14px]">
                  {!notif.is_read && (
                    <button
                      className="text-[#439182] cursor-pointer font-medium py-3"
                      onClick={() => handleMarkAsRead(notif._id)}
                      disabled={
                        isProcessingAction ||
                        isMarkingAllAsRead ||
                        isClearingAll
                      }
                    >
                      {isProcessingAction && !isMarkingAllAsRead
                        ? "Marking as read..."
                        : t("notifications.markAsRead")}
                    </button>
                  )}
                  <p
                    className={`text-[#222] ${
                      notif.is_read ? "font-normal" : "font-medium"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-[#777] mt-2">
                    {formatTimeAgo(notif.createdAt || notif.created_at, t)}
                  </p>
                </div>
                {/* Dismiss (Delete) individual notification */}
                <button
                  className="flex items-center justify-end w-7 h-7 mt-1"
                  aria-label={t("notifications.clear")}
                  onClick={() => handleDeleteNotification(notif._id)}
                  disabled={
                    isProcessingAction || isMarkingAllAsRead || isClearingAll
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"
                      fill="#999999"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
