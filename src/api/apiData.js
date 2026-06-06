
import axios from "./axios";

// fetch user info
export const fetchUserMe = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

// fetch dashboard info
export const fetchDashboardData = async () => {
  const response = await axios.get("/users/dashboard");
  return response.data;
};

// fetch repayments history
export const fetchRepayments = async () => {
  const response = await axios.get("/loans/repayments/history");
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
};

// confirm loan application
export const confirmLoanApplication = async (loan_id, password) => {
  const response = await axios.post("/loans/confirm", {
    loan_id: loan_id,
    password: password,
  });
  return response;
};


export const updatePreferences = async (
  type, // 'sms' or 'email' (can be null if only language is updated)
  state, // true/false (can be null if only language is updated)
  currentEmailState, // Current state of email preference
  currentSmsState, // Current state of SMS preference
  newLanguageCode // The new language code (e.g., 'ENG', 'HAU')
) => {
  const preferencesPayload = {
    notification: {
      email: currentEmailState, // Always send current email state
      sms: currentSmsState, // Always send current SMS state
    },
  };

  // If a specific notification type is being updated, override its value
  if (type === "sms" && state !== null) {
    // Check state !== null in case 'false' is passed explicitly
    preferencesPayload.notification.sms = state;
  } else if (type === "email" && state !== null) {
    preferencesPayload.notification.email = state;
  }

  // Add language to the payload if it's provided
  if (newLanguageCode) {
    preferencesPayload.language = newLanguageCode;
  }

  try {
    const response = await axios.patch("/users/update-preferences", {
      preferences: preferencesPayload,
    });

    return response;
  } catch (error) {
    return response;
  }
};


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