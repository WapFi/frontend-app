// // src/api/mockApi.js
// export function fetchUserMe() {
//   return Promise.resolve({
//     data: {
//       _id: "6841a23a7623880633127358",
//       full_name: "Agbara Adebayo",
//       identifier: "caesar@dropjar.com",
//       role: "WAPFI_USER",
//       permissions: [
//         "submit_loan_application",
//         "edit_loan_application",
//         "delete_loan_application",
//         "view_loan_application",
//         "approve_loan_application",
//         "reject_loan_application"
//       ],
//       status: "ACTIVE",
//       created_at: "2025-06-05T13:57:14.389Z",
//       last_login: "2025-06-06T04:52:37.266Z"
//     },
//     status: true
//   });
// }

// export function fetchDashboardData() {
//   return Promise.resolve({
//     data: {
//       totalLoanTaken: 40000,
//       amountRepaid: 20000,
//       activeLoan: {
//         _id: "loan_id",
//         loan_amount: 20000,
//         amount_paid: 0,
//         outstanding_balance: 20000,
//         due_date: "2025-07-15T00:00:00.000Z",
//         time_left: {
//           days: 30,
//           hours: 5,
//           minutes: 10,
//           seconds: 15
//         },
//         repayment_method: "RECYCLABLES",
//         monthly_payment_plastic_kg: 100,
//         plastic_collected_kg: 0,
//         disbursement_account: "Opay 1234567890"
//       },
//       creditScore: {
//         current_score: 160,
//         tier: 1,
//         next_tier_threshold: 200,
//         progress_to_next_tier: 160
//       }
//     },
//     status: true
//   });
// }

// export function fetchRepayments() {
//   return Promise.resolve({
//     data: {
//       repayments: [
//         {
//           _id: "repayment1",
//           loan: {
//             _id: "loan1",
//             loan_amount: 20000,
//           },
//           repayment_method: "RECYCLABLES",
//           amount_paid: 10000,
//           plastic_weight_kg: 50,
//           status: "VERIFIED",
//           repayment_date: "2025-06-15T00:00:00.000Z",
//         },
//         {
//           _id: "repayment2",
//           loan: {
//             _id: "loan2",
//             loan_amount: 25000,
//           },
//           repayment_method: "RECYCLABLES",
//           amount_paid: 25000,
//           plastic_weight_kg: 70,
//           status: "PENDING",
//           repayment_date: "2025-06-20T00:00:00.000Z",
//         },
//       ],
//       totalRepayments: 2,
//       totalPages: 1,
//       currentPage: 1,
//     },
//     status: true,
//   });
// }

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

export const fetchRepayments = async (page, limit) => {
  const response = await axios.get(
    `/loans/repayments/history?page=${page ? page : 1}&limit=${
      limit ? limit : 10
    }`
  );
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

// fetch loan history
export const fetchLoans = async (page, limit) => {
  const response = await axios.get(
    `/loans/history?page=${page ? page : 1}&limit=${limit ? limit : 10}`
  );
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
