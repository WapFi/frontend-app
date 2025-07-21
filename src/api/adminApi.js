import axios from './axios';

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('/admins/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User Management
export const getUsers = async (params = {}) => {
  try {
    const response = await axios.get('/admins/users', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`/admins/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await axios.patch(`/admins/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Loan Applications
export const getLoanApplications = async (params = {}) => {
  try {
    const response = await axios.get('/admins/loans/applications', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLoanApplicationStatus = async (loanId, status) => {
  try {
    const response = await axios.patch(`/admins/loans/${loanId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Loan Repayments
export const getRepayments = async (params = {}) => {
  try {
    const response = await axios.get('/admins/repayments', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRepayment = async (repaymentData) => {
  try {
    const response = await axios.post('/admins/repayments', repaymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Analytics
export const getAnalyticsData = async (params = {}) => {
  try {
    const response = await axios.get('/admins/analytics', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verifications
export const getVerifications = async (params = {}) => {
  try {
    const response = await axios.get('/admins/verifications', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const processIdentityVerification = async (userId, action, identityType, reason = '') => {
  try {
    const response = await axios.patch(`/admins/verifications/${userId}`, {
      action,
      identity_type: identityType,
      reason
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Management
export const getAdmins = async (params = {}) => {
  try {
    const response = await axios.get('/admins/admins', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const addAdmin = async (adminData) => {
  try {
    const response = await axios.post('/admins/create', adminData);
    return response.data;
  } catch (error) {
    throw error;
  }
};