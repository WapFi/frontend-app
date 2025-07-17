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

// fetch dashboard info
export const fetchDashboardData = async () => {
  const response = await axios.get("/users/dashboard");
  // console.log(response);
  return response.data;
};

// fetch repayments history
export const fetchRepayments = async () => {
  const response = await axios.get("/loans/repayments/history");
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
  return response.data;
};

// update loan details pending confirmation
export const updatePendingLoanDetails = async (loanFormData, loanID) => {
  const response = await axios.patch(`/loans/${loanID}/update`, loanFormData);
  return response.data;
}

// confirm loan application
export const confirmLoanApplication = async (loan_id, password) => {
  const response = await axios.post("/loans/confirm", {
    loan_id: loan_id,
    password: password,
  });
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
  const response = await axios.post("/auth/logout");
  return response;
};
