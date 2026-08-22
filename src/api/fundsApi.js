import axios from "./axios";

export const getFunds = async (params = {}) => {
  const response = await axios.get("/funds", { params });
  return response.data;
};

export const getFundDetails = async (fundId) => {
  const response = await axios.get(`/funds/${fundId}`);
  return response.data;
};

export const createFund = async (fundData) => {
  const response = await axios.post("/funds", fundData);
  return response.data;
};

export const updateFund = async (fundId, fundData) => {
  const response = await axios.patch(`/funds/${fundId}`, fundData);
  return response.data;
};

export const recordContribution = async (fundId, contributionData) => {
  const response = await axios.post(
    `/funds/${fundId}/contributions`,
    contributionData,
  );
  return response.data;
};

export const getContributions = async (params = {}) => {
  const response = await axios.get("/funds/contributions", { params });
  return response.data;
};

export const getSettlementQueue = async (params = {}) => {
  const response = await axios.get("/funds/settlements/queue", { params });
  return response.data;
};

export const recordSettlement = async (settlementData) => {
  const response = await axios.post("/funds/settlements", settlementData);
  return response.data;
};

export const getSettlements = async (params = {}) => {
  const response = await axios.get("/funds/settlements", { params });
  return response.data;
};
