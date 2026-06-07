import axios from "./axios";

export const applyForLoan = async (loanFormData) => {
  const response = await axios.post("/loans/apply", loanFormData);
  return response;
};

export const updatePendingLoanDetails = async (loanFormData, loanID) => {
  const response = await axios.patch(`/loans/${loanID}/update`, loanFormData);
  return response;
};

export const confirmLoanApplication = async (loan_id, password) => {
  const response = await axios.post("/loans/confirm", {
    loan_id,
    password,
  });
  return response;
};

export const fetchLoans = async (page = 1, limit = 10, filters = {}) => {
  const { query, startDate, endDate, status } = filters;
  let queryString = `page=${page}&limit=${limit}`;

  if (query) {
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

  if (status) {
    queryString += `&status=${status}`;
  }

  const response = await axios.get(`/loans/history?${queryString}`);
  return response.data;
};

export const getLoanDetails = async (loanID) => {
  const response = await axios.get(`/loans/${loanID}`);
  return response;
};

export const getBorrowingLimit = async () => {
  const response = await axios.get("/loans/borrowing-limit");
  return response.data;
};