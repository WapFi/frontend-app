// import { useState, useEffect, useRef } from "react";
// import {
//   getNotifications,
//   markAsRead,
//   markAllAsRead,
//   deleteNotification,
// } from "../../../api/apiData";
// import LoadingSpinner from "../../LoadingSpinner";

// // Helper function now uses static strings
// function formatTimeAgo(isoString) {
//   if (!isoString) {
//     return "N/A";
//   }

//   const date = new Date(isoString);
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);

//   let interval = seconds / 31536000; // years
//   if (interval >= 1) {
//     const count = Math.floor(interval);
//     return `${count} year${count > 1 ? "s" : ""} ago`;
//   }
//   interval = seconds / 2592000; // months
//   if (interval >= 1) {
//     const count = Math.floor(interval);
//     return `${count} month${count > 1 ? "s" : ""} ago`;
//   }
//   interval = seconds / 86400; // days
//   if (interval >= 1) {
//     const count = Math.floor(interval);
//     return `${count} day${count > 1 ? "s" : ""} ago`;
//   }
//   interval = seconds / 3600; // hours
//   if (interval >= 1) {
//     const count = Math.floor(interval);
//     return `${count} hour${count > 1 ? "s" : ""} ago`;
//   }
//   interval = seconds / 60; // minutes
//   if (interval >= 1) {
//     const count = Math.floor(interval);
//     return `${count} minute${count > 1 ? "s" : ""} ago`;
//   }
//   const count = Math.floor(seconds);
//   return `${count} second${count > 1 ? "s" : ""} ago`;
// }

// export default function AdminNotificationsDropdown({ onNotificationAction }) {
//   const [notificationsList, setNotificationsList] = useState([]);
//   const [listLoading, setListLoading] = useState(true);
//   const [listError, setListError] = useState(null);

//   const [isProcessingAction, setIsProcessingAction] = useState(false);
//   const [isClearingAll, setIsClearingAll] = useState(false);
//   const [actionError, setActionError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const messageTimeoutRef = useRef(null);

//   const displayFeedbackMessage = (type, message) => {
//     if (messageTimeoutRef.current) {
//       clearTimeout(messageTimeoutRef.current);
//     }

//     if (type === "success") {
//       setSuccessMessage(message);
//       setActionError(null);
//     } else if (type === "error") {
//       setActionError(message);
//       setSuccessMessage(null);
//     } else {
//       setSuccessMessage(null);
//       setActionError(null);
//     }

//     if (message) {
//       messageTimeoutRef.current = setTimeout(() => {
//         setSuccessMessage(null);
//         setActionError(null);
//       }, 5000);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (messageTimeoutRef.current) {
//         clearTimeout(messageTimeoutRef.current);
//       }
//     };
//   }, []);

//   const fetchNotificationsList = async () => {
//     setListLoading(true);
//     setListError(null);
//     try {
//       const axiosResponse = await getNotifications();
//       const responseData = axiosResponse.data;

//       if (responseData && responseData.status) {
//         setNotificationsList(responseData.data?.notifications || []);
//       } else {
//         console.error("Failed to fetch notifications list:", responseData);
//         const errorMsg =
//           responseData?.data?.message || "Failed to load notifications.";
//         setListError(errorMsg);
//         setNotificationsList([]);
//         displayFeedbackMessage("error", errorMsg);
//       }
//     } catch (err) {
//       console.error("Error fetching notifications list:", err);
//       const errorMsg =
//         err.response?.data?.message || "Failed to connect to the server.";
//       setListError(errorMsg);
//       setNotificationsList([]);
//       displayFeedbackMessage("error", errorMsg);
//     } finally {
//       setListLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotificationsList();
//   }, []);

//   const handleMarkAsRead = async (notificationId) => {
//     setIsProcessingAction(true);
//     displayFeedbackMessage(null, null);
//     try {
//       const axiosResponse = await markAsRead(notificationId);
//       const responseData = axiosResponse.data;

//       if (responseData && responseData.status) {
//         await fetchNotificationsList();
//         if (onNotificationAction) {
//           onNotificationAction();
//         }
//         displayFeedbackMessage(
//           "success",
//           responseData.data?.message || "Notification marked as read."
//         );
//       } else {
//         console.error("Failed to mark as read:", responseData);
//         displayFeedbackMessage(
//           "error",
//           responseData.data?.message || "Failed to mark notification as read."
//         );
//       }
//     } catch (err) {
//       console.error("Error marking as read:", err);
//       displayFeedbackMessage(
//         "error",
//         err.response?.data?.message || "Failed to mark notification as read."
//       );
//     } finally {
//       setIsProcessingAction(false);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     setIsProcessingAction(true);
//     displayFeedbackMessage(null, null);
//     try {
//       const axiosResponse = await markAllAsRead();
//       const responseData = axiosResponse.data;

//       if (responseData && responseData.status) {
//         await fetchNotificationsList();
//         if (onNotificationAction) {
//           onNotificationAction();
//         }
//         displayFeedbackMessage(
//           "success",
//           responseData.data?.message || "All notifications marked as read."
//         );
//       } else {
//         displayFeedbackMessage(
//           "error",
//           responseData?.data?.message || "Failed to mark all as read."
//         );
//       }
//     } catch (err) {
//       console.error("Error marking all as read:", err);
//       displayFeedbackMessage(
//         "error",
//         err.response?.data?.message || "Failed to mark all as read."
//       );
//     } finally {
//       setIsProcessingAction(false);
//     }
//   };

//   const handleDeleteNotification = async (notificationId) => {
//     setIsProcessingAction(true);
//     displayFeedbackMessage(null, null);
//     try {
//       const axiosResponse = await deleteNotification(notificationId);
//       const responseData = axiosResponse.data;

//       if (responseData && responseData.status) {
//         await fetchNotificationsList();
//         if (onNotificationAction) {
//           onNotificationAction();
//         }
//         displayFeedbackMessage(
//           "success",
//           responseData.data?.message || "Notification deleted successfully."
//         );
//       } else {
//         console.error("Failed to delete notification:", responseData);
//         displayFeedbackMessage(
//           "error",
//           responseData?.data?.message || "Failed to delete notification."
//         );
//       }
//     } catch (err) {
//       console.error("Error deleting notification:", err);
//       displayFeedbackMessage(
//         "error",
//         err.response?.data?.message || "Failed to delete notification."
//       );
//     } finally {
//       setIsProcessingAction(false);
//     }
//   };

//   const handleClearAll = async () => {
//     if (notificationsList.length === 0) return;

//     setIsClearingAll(true);
//     displayFeedbackMessage(null, null);

//     const deletePromises = notificationsList.map((notif) =>
//       deleteNotification(notif._id)
//         .then((axiosResponse) => {
//           if (!axiosResponse.data || !axiosResponse.data.status) {
//             console.error(
//               `Failed to delete notification ${notif._id}:`,
//               axiosResponse.data
//             );
//             return {
//               id: notif._id,
//               status: "failed",
//               error: axiosResponse.data?.message,
//             };
//           }
//           return { id: notif._id, status: "fulfilled" };
//         })
//         .catch((err) => {
//           console.error(`Error deleting notification ${notif._id}:`, err);
//           return {
//             id: notif._id,
//             status: "rejected",
//             error: err.response?.data?.message || err.message,
//           };
//         })
//     );

//     await Promise.allSettled(deletePromises);

//     setTimeout(() => {
//       fetchNotificationsList();
//       if (onNotificationAction) {
//         onNotificationAction();
//       }
//     }, 500);

//     displayFeedbackMessage("success", "All notifications cleared.");
//     setIsClearingAll(false);
//   };

//   const unreadCountInDropdown = notificationsList.filter(
//     (notif) => !notif.is_read
//   ).length;

//   return (
//     <div className="absolute -right-1 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
//         <div className="flex gap-2 text-xs">
//           {unreadCountInDropdown > 0 && (
//             <button
//               className="text-[#B88E00] font-medium"
//               onClick={handleMarkAllAsRead}
//               disabled={isProcessingAction || isClearingAll}
//             >
//               {isProcessingAction
//                 ? "Marking all as read..."
//                 : "Mark all as read"}
//             </button>
//           )}
//           {notificationsList.length > 0 && (
//             <button
//               className="text-[#EF4444] font-medium"
//               onClick={handleClearAll}
//               disabled={isProcessingAction || isClearingAll}
//             >
//               {isClearingAll ? "Clearing..." : "Clear"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Display Success or Error Messages */}
//       {successMessage && (
//         <div className="p-4 text-green-500 text-sm">{successMessage}</div>
//       )}
//       {actionError && (
//         <div className="p-4 text-red-600 text-sm">{actionError}</div>
//       )}

//       {listLoading && (
//         <div className="p-4 flex justify-center items-center h-20">
//           <LoadingSpinner />
//         </div>
//       )}

//       {!listLoading && listError && (
//         <div className="p-4 text-red-600 text-sm">{listError}</div>
//       )}

//       {!listLoading && notificationsList.length === 0 && !listError ? (
//         <div className="p-4 text-gray-500 text-sm">No notifications yet.</div>
//       ) : (
//         <div className="max-h-64 overflow-y-auto">
//           {notificationsList.map((notif) => (
//             <div
//               key={notif._id}
//               className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-start ${
//                 notif.is_read ? "" : "bg-gray-50 border-l-2 border-l-[#B88E00]"
//               }`}
//             >
//               {/* <div
//                 className="flex-grow pr-4"
//                 onClick={() => {
//                   if (!notif.is_read) {
//                     handleMarkAsRead(notif._id);
//                   }
//                 }}
//               >
//                 <p
//                   className={`text-sm ${
//                     notif.is_read
//                       ? "text-gray-900"
//                       : "font-semibold text-gray-900"
//                   }`}
//                 >
//                   {notif.message}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {formatTimeAgo(notif.createdAt || notif.created_at)}
//                 </p>
//               </div> */}
//               <div className="text-sm">
//                 {!notif.is_read && (
//                   <button
//                     className="text-[#B88E00] cursor-pointer font-medium py-3"
//                     onClick={() => handleMarkAsRead(notif._id)}
//                     disabled={isProcessingAction || isClearingAll}
//                   >
//                     {t("notifications.markAsRead")}
//                   </button>
//                 )}
//                 <p
//                   className={`text-[#222] ${
//                     notif.is_read ? "font-normal" : "font-medium"
//                   }`}
//                 >
//                   {notif.message}
//                 </p>
//                 <p className="text-[#777] mt-2">
//                   {formatTimeAgo(notif.createdAt || notif.created_at)}
//                 </p>
//               </div>
//               <button
//                 className="p-1 rounded-full text-gray-400 hover:bg-gray-200"
//                 onClick={() => handleDeleteNotification(notif._id)}
//                 aria-label="Clear notification"
//                 disabled={isProcessingAction || isClearingAll}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useEffect, useRef } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../../api/apiData";
import LoadingSpinner from "../../LoadingSpinner";

// Helper function now uses static strings
function formatTimeAgo(isoString) {
  if (!isoString) {
    return "N/A";
  }

  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000; // years
  if (interval >= 1) {
    const count = Math.floor(interval);
    return `${count} year${count > 1 ? "s" : ""} ago`;
  }
  interval = seconds / 2592000; // months
  if (interval >= 1) {
    const count = Math.floor(interval);
    return `${count} month${count > 1 ? "s" : ""} ago`;
  }
  interval = seconds / 86400; // days
  if (interval >= 1) {
    const count = Math.floor(interval);
    return `${count} day${count > 1 ? "s" : ""} ago`;
  }
  interval = seconds / 3600; // hours
  if (interval >= 1) {
    const count = Math.floor(interval);
    return `${count} hour${count > 1 ? "s" : ""} ago`;
  }
  interval = seconds / 60; // minutes
  if (interval >= 1) {
    const count = Math.floor(interval);
    return `${count} minute${count > 1 ? "s" : ""} ago`;
  }
  const count = Math.floor(seconds);
  return `${count} second${count > 1 ? "s" : ""} ago`;
}

export default function AdminNotificationsDropdown({ onNotificationAction }) {
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
          responseData?.data?.message || "Failed to load notifications.";
        setListError(errorMsg);
        setNotificationsList([]);
        displayFeedbackMessage("error", errorMsg);
      }
    } catch (err) {
      console.error("Error fetching notifications list:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to connect to the server.";
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
          responseData.data?.message || "Notification marked as read."
        );
      } else {
        console.error("Failed to mark as read:", responseData);
        displayFeedbackMessage(
          "error",
          responseData.data?.message || "Failed to mark notification as read."
        );
      }
    } catch (err) {
      console.error("Error marking as read:", err);
      displayFeedbackMessage(
        "error",
        err.response?.data?.message || "Failed to mark notification as read."
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
          responseData.data?.message || "All notifications marked as read."
        );
      } else {
        displayFeedbackMessage(
          "error",
          responseData?.data?.message || "Failed to mark all as read."
        );
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
      displayFeedbackMessage(
        "error",
        err.response?.data?.message || "Failed to mark all as read."
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
          responseData.data?.message || "Notification deleted successfully."
        );
      } else {
        console.error("Failed to delete notification:", responseData);
        displayFeedbackMessage(
          "error",
          responseData?.data?.message || "Failed to delete notification."
        );
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      displayFeedbackMessage(
        "error",
        err.response?.data?.message || "Failed to delete notification."
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

    await Promise.allSettled(deletePromises);

    setTimeout(() => {
      fetchNotificationsList();
      if (onNotificationAction) {
        onNotificationAction();
      }
    }, 500);

    displayFeedbackMessage("success", "All notifications cleared.");
    setIsClearingAll(false);
  };

  const unreadCountInDropdown = notificationsList.filter(
    (notif) => !notif.is_read
  ).length;

  return (
    <div className="absolute -right-1 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        <div className="flex gap-2 text-xs">
          {unreadCountInDropdown > 0 && (
            <button
              className="text-[#B88E00] font-medium"
              onClick={handleMarkAllAsRead}
              disabled={isProcessingAction || isMarkingAllAsRead || isClearingAll}
            >
              {isMarkingAllAsRead ? "Marking all as read..." : "Mark all as read"}
            </button>
          )}
          {notificationsList.length > 0 && (
            <button
              className="text-[#EF4444] font-medium"
              onClick={handleClearAll}
              disabled={isProcessingAction || isMarkingAllAsRead || isClearingAll}
            >
              {isClearingAll ? "Clearing..." : "Clear"}
            </button>
          )}
        </div>
      </div>

      {/* Display Success or Error Messages */}
      {successMessage && (
        <div className="p-4 text-green-500 text-sm">{successMessage}</div>
      )}
      {actionError && (
        <div className="p-4 text-red-600 text-sm">{actionError}</div>
      )}

      {listLoading && (
        <div className="p-4 flex justify-center items-center h-20">
          <LoadingSpinner />
        </div>
      )}

      {!listLoading && listError && (
        <div className="p-4 text-red-600 text-sm">{listError}</div>
      )}

      {!listLoading && notificationsList.length === 0 && !listError ? (
        <div className="p-4 text-gray-500 text-sm">No notifications yet.</div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {notificationsList.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-start ${
                notif.is_read ? "" : "bg-gray-50 border-l-2 border-l-[#B88E00]"
              }`}
            >
              <div className="text-sm w-[80%]">
                {!notif.is_read && (
                  <button
                    className="text-[#B88E00] cursor-pointer font-medium py-3"
                    onClick={() => handleMarkAsRead(notif._id)}
                    disabled={isProcessingAction || isMarkingAllAsRead || isClearingAll}
                  >
                    {isProcessingAction ? "Marking as read..." : "Mark as read"}
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
                  {formatTimeAgo(notif.createdAt || notif.created_at)}
                </p>
              </div>
              <button
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200"
                onClick={() => handleDeleteNotification(notif._id)}
                aria-label="Clear notification"
                disabled={isProcessingAction || isMarkingAllAsRead || isClearingAll}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
          ))}
        </div>
      )}
    </div>
  );
}
