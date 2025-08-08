import { createContext, useContext, useState, useEffect } from "react";
import { getUnreadCount } from "../api/apiData";

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingUnreadCount, setLoadingUnreadCount] = useState(true);
  const [errorUnreadCount, setErrorUnreadCount] = useState(null);

  // Function to fetch the unread count
  const fetchUnreadCount = async () => {
    setLoadingUnreadCount(true);
    setErrorUnreadCount(null);
    try {
      const response = await getUnreadCount();
      if (response.status) {
        // console.log(response.status, response)
        // console.log("count: ", response.data?.data?.unread_count);
        setUnreadCount(response.data?.data?.unread_count);
      } else {
        setErrorUnreadCount(response.data?.message);
        // console.log(response.data?.message);
        setUnreadCount(0);
      }
      return response;
    } catch (err) {
      setErrorUnreadCount(err.response?.data?.message);
    //   console.log("err: ", err)
      setUnreadCount(0);
    } finally {
      setLoadingUnreadCount(false);
    }
  };

  // Fetch count on component mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const refreshNotificationsCount = async () => {
    return await fetchUnreadCount();
  };

  const value = {
    unreadCount,
    loadingUnreadCount,
    errorUnreadCount,
    refreshNotificationsCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  return context;
};
