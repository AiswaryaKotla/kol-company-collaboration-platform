const KEY = "social_accounts";

/* GET ACCOUNTS FOR USER */
export const getSocialAccounts = (email) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  return data[email] || [];
};

/* ADD ACCOUNT */
export const addSocialAccount = (email, account) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");

  if (!data[email]) {
    data[email] = [];
  }

  data[email].push({
    id: Date.now(),
    platform: account.platform,
    handle: account.handle,
    followers: account.followers,
    engagement: account.engagement,
    likes: account.likes,
    views: account.views,
    status: "not_verified", // not_verified | pending | verified
  });

  localStorage.setItem(KEY, JSON.stringify(data));
};

/* REQUEST VERIFICATION */
export const requestVerification = (email, id) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");

  data[email] = data[email].map((acc) =>
    acc.id === id ? { ...acc, status: "pending" } : acc
  );

  localStorage.setItem(KEY, JSON.stringify(data));
};

/* ADMIN: GET ALL ACCOUNTS */
export const getAllAccounts = () => {
  return JSON.parse(localStorage.getItem(KEY) || "{}");
};

/* ADMIN VERIFY */
export const verifyAccount = (email, id) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");

  data[email] = data[email].map((acc) =>
    acc.id === id ? { ...acc, status: "verified" } : acc
  );

  localStorage.setItem(KEY, JSON.stringify(data));
};

/* ===============================
   ADMIN: GET ALL SOCIAL ACCOUNTS
================================ */

export function getAllSocialAccounts() {

  const data = JSON.parse(
    localStorage.getItem("kol_social_accounts") || "[]"
  );

  return data;

}