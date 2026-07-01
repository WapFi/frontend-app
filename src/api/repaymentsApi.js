import axios from "./axios";

export const fetchRepayments = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  const { query, startDate, endDate, loanID } = filters;
  let queryString = `page=${page}&limit=${limit}`;

  if (query) {
    if (!isNaN(Number(query))) {
      queryString += `&loan_amount=${query}`;
    } else {
      queryString += `&loan_id=${query}`;
    }
  }

  if (loanID) {
    queryString += `&loan_id=${loanID}`;
  }

  if (startDate) {
    queryString += `&start_date=${startDate}`;
  }

  if (endDate) {
    queryString += `&end_date=${endDate}`;
  }

  const response = await axios.get(
    `/loans/repayments/history?${queryString}`
  );
  return response.data;
};

export const getRepayments = async (params = {}) => {
  try {
    const response = await axios.get("/admins/repayments", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRepayment = async (repaymentData) => {
  try {
    const response = await axios.post("/admins/repayments", repaymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};