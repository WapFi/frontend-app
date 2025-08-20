import axios from "./axios";

// fetch user info
export const fetchUserMe = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

// fetch dashboard data
export const fetchDashboardData = async () => {
  const response = await axios.get("/users/dashboard");
  // console.log(response);
  return response.data;
};

// fetch repayments history
// export const fetchRepayments = async () => {
//   const response = await axios.get("/loans/repayments/history");
//   console.log("Repayments: ", response.data);
//   return response.data;
// };


// // fetch repayments
// export const fetchRepayments = async (page = 1, limit = 10, filters = {}) => {
//   const { query, startDate, endDate } = filters;
//   let queryString = `page=${page}&limit=${limit}`;

//   if (query) {
//     // Check if the query is a number
//     if (!isNaN(Number(query))) {
//       // It's a number, so we assume it's a loan amount
//       queryString += `&loan_amount=${query}`;
//     } else {
//       // It's not a number, so we assume it's a loan ID
//       queryString += `&loan_id=${query}`;
//     }
//   }

//   if (startDate) {
//     queryString += `&start_date=${startDate}`;
//   }

//   if (endDate) {
//     queryString += `&end_date=${endDate}`;
//   }

//   const response = await axios.get(`/loans/repayments/history?${queryString}`);
//   console.log("Repayments: ", response.data);
//   return response.data;
// };

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
  console.log("Repayments: ", response.data);
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

// apply for a loan
export const applyForLoan = async (loanFormData) => {
  const response = await axios.post("/loans/apply", loanFormData);
  return response;
};

// update loan details pending confirmation
export const updatePendingLoanDetails = async (loanFormData, loanID) => {
  const response = await axios.patch(`/loans/${loanID}/update`, loanFormData);
  return response;
};

// confirm loan application
export const confirmLoanApplication = async (loan_id, password) => {
  const response = await axios.post("/loans/confirm", {
    loan_id: loan_id,
    password: password,
  });
  return response;
};

// // fetch loan history
// export const fetchLoans = async (page, limit) => {
//   const response = await axios.get(
//     `/loans/history?page=${page ? page : 1}&limit=${limit ? limit : 10}`
//   );
//   return response.data;
// };

// fetch loan history with filters
export const fetchLoans = async (page = 1, limit = 10, filters = {}) => {
  const { query, startDate, endDate } = filters;
  let queryString = `page=${page}&limit=${limit}`;

  if (query) {
    // If query is numeric, search by loan_amount; else treat as loan_id
    if (!isNaN(Number(query))) {
      queryString += `&loan_amount=${query}`;
    } else {
      queryString += `&loan_id=${query}`;
    }
  }

  if (startDate) {
    queryString += `&start_date=${startDate}`;
  }

  if (endDate) {
    queryString += `&end_date=${endDate}`;
  }

  const response = await axios.get(`/loans/history?${queryString}`);
  return response.data;
};


// update preferences
// export const updatePreferences = async (type, state) => {
//   if (type === "sms") {
//     const response = await axios.patch("/users/update-preferences", {
//       preferences: {
//         notification: {
//           sms: state,
//         },
//       },
//     });
//     return response;
//   } else if (type === "email") {
//     const response = await axios.patch("/users/update-preferences", {
//       preferences: {
//         notification: {
//           email: state,
//         },
//       },
//     });
//     return response;
//   }
// };

// export const updatePreferences = async (
//   type, // 'sms' or 'email' (can be null if only language is updated)
//   state, // true/false (can be null if only language is updated)
//   currentEmailState, // Current state of email preference
//   currentSmsState, // Current state of SMS preference
//   newLanguageCode // The new language code (e.g., 'ENG', 'HAU')
// ) => {
//   const preferencesPayload = {
//     notification: {
//       email: currentEmailState, // Always send current email state
//       sms: currentSmsState, // Always send current SMS state
//     },
//   };

//   // If a specific notification type is being updated, override its value
//   if (type === "sms" && state !== null) {
//     // Check state !== null in case 'false' is passed explicitly
//     preferencesPayload.notification.sms = state;
//   } else if (type === "email" && state !== null) {
//     preferencesPayload.notification.email = state;
//   }

//   // Add language to the payload if it's provided
//   if (newLanguageCode) {
//     preferencesPayload.language = newLanguageCode;
//   }

//   try {
//     const response = await axios.patch("/users/update-preferences", {
//       preferences: preferencesPayload,
//     });

//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

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

// record a payment
// export const recordPayment = async (dashboardData) => {
//   console.log(dashboardData);

//   const response = await axios.post("", {
//     loan_id: dashboardData.active_loan.loan_id,
//     repayment_method: dashboardData.active_loan.repayment_method,
//     plastic_weight_kg:
//       dashboardData.active_loan_repayment_method === "RECYCLABLES" ||
//       dashboardData.active_loan.repayment_method === "BOTH"
//         ? (40 / 100) * dashboardData.active_loan.loan_amount
//         : 0,
//     cash_amount:
//       dashboardData.active_loan.repayment_method === "CASH" ||
//       dashboardData.active_loan.repayment_method === "BOTH"
//         ? (40 / 100) * dashboardData.active_loan.loan_amount
//         : 0,
//     drop_off_location: "Lagos Collection Center",
//     receipt_number: "RCP001",
//   });
//   return response.data;
// };

// get loan by ID
export const getLoanDetails = async (loanID) => {
  const response = await axios.get(`/loans/${loanID}`);
  return response;
};

// get borrowing limit
export const getBorrowingLimit = async () => {
  const response = await axios.get("/loans/borrowing-limit");
  return response.data;
};

// log user out
export const logOut = async () => {
  const response = await axios.post("/auth/sign_out");
  return response;
};
