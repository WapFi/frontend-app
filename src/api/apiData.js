import axios from "./axios";

// fetch user info
export const fetchUserMe = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

// fetch dashboard data
export const fetchDashboardData = async () => {
  const response = await axios.get("/users/dashboard");
  return response.data;
};


// fetch repayments
export const fetchRepayments = async (page = 1, limit = 10, filters = {}) => {
  const { query, startDate, endDate, loanID } = filters;
  let queryString = `page=${page}&limit=${limit}`;

  if (query) {
    // This is for general search functionality
    if (!isNaN(Number(query))) {
      queryString += `&loan_amount=${query}`;
    } else {
      queryString += `&loan_id=${query}`;
    }
  }

  // This block is for filtering by a specific loan ID, which is more explicit
  if (loanID) {
    queryString += `&loan_id=${loanID}`;
  }

  if (startDate) {
    queryString += `&start_date=${startDate}`;
  }

  if (endDate) {
    queryString += `&end_date=${endDate}`;
  }

  const response = await axios.get(`/loans/repayments/history?${queryString}`);
  return response.data;
};

// verify identiy, verifies BVN, NIN, Phone
export const verifyIdentity = async (identity, value) => {
  const response = await axios.patch("/users/verify-identity", {
    identity_type: identity,
    identity_value: value,
  });
  return response;
};

// update preferences (sms, email, language)
export const updatePreferences = async (
  emailState,
  smsState,
  newLanguageCode
) => {
  const preferencesPayload = {
    notification: {
      email: emailState,
      sms: smsState,
    },
  };

  if (newLanguageCode) {
    preferencesPayload.language = newLanguageCode;
  }

  try {
    const response = await axios.patch("/users/update-preferences", {
      preferences: preferencesPayload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// update attachments e.g, profile picture
export const updateAttachment = async (type, data) => {
  if (type === "PROFILE_PICTURE") {
    const response = axios.patch("/users/update-attachment", {
      attachment: data.fileData,
      attachment_type: type,
    });
    return response;
  }
  throw new Error("Unsupported attachment type.");
};

// delete attachments, e.g, profile picture
export const deleteAttachment = async (type) => {
  if (type === "PROFILE_PICTURE") {
    const response = axios.delete("/users/delete-attachment", {
      data: {
        attachment_type: type,
      },
    });
    return response;
  }
  throw new Error("Unsupported attachment type.");
};

// get notifications
export const getNotifications = async () => {
  const response = axios.get("/notifications?page=1&limit=10&unread_only=true");
  return response;
};

// get unread notifcations count
export const getUnreadCount = async () => {
  const response = axios.get("/notifications/unread-count");
  return response;
};

// mark single notification as read
export const markAsRead = async (notification_id) => {
  const response = axios.patch(`/notifications/${notification_id}/read`);
  return response;
};

// mark all notifications as read
export const markAllAsRead = async () => {
  const response = axios.patch(`/notifications/mark-all-read`);
  return response;
};

// delete a single notification
export const deleteNotification = async (notification_id) => {
  const response = axios.delete(`/notifications/${notification_id}`);
  return response;
};

// log user out
export const logOut = async () => {
  const response = await axios.post("/auth/sign_out");
  return response;
};
