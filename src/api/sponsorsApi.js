import axios from "./axios";

export const getSponsors = async (params = {}) => {
  const response = await axios.get("/funds/sponsors", { params });
  return response.data;
};

export const createSponsor = async (sponsorData) => {
  const response = await axios.post("/funds/sponsors", sponsorData);
  return response.data;
};

export const updateSponsor = async (sponsorId, sponsorData) => {
  const response = await axios.patch(`/funds/sponsors/${sponsorId}`, sponsorData);
  return response.data;
};