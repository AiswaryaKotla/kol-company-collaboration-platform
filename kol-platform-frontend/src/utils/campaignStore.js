const KEY = "campaigns";

/* Get all campaigns */
export const getCampaigns = () => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

/* Add campaign */
export const addCampaign = (campaign) => {
  const campaigns = getCampaigns();
  campaigns.push(campaign);
  localStorage.setItem(KEY, JSON.stringify(campaigns));
};

/* Get campaign by id */
export const getCampaignById = (id) => {
  const campaigns = getCampaigns();
  return campaigns.find((c) => c.id === id);
};

/* Get campaigns by company */
export const getCompanyCampaigns = (email) => {
  const campaigns = getCampaigns();
  return campaigns.filter((c) => c.companyEmail === email);
};