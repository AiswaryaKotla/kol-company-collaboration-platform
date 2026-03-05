const STORAGE_KEY = "invites";

//  get all invites
export const getAllInvites = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

//  save all invites
const saveInvites = (invites) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
};

//  add invite
export const addInvite = (invite) => {
  const invites = getAllInvites();

  const newInvite = {
    ...invite,
    createdAt: new Date().toISOString(),
  };

  invites.push(newInvite);
  saveInvites(invites);
};

//  get invites for specific KOL
export const getInvitesForKol = (kolEmail) => {
  const invites = getAllInvites();

  return invites.filter(
    (i) =>
      i.kolEmail?.toLowerCase().trim() ===
      kolEmail?.toLowerCase().trim()
  );
};

//  update invite status
export const updateInviteStatus = (inviteId, status) => {
  const invites = getAllInvites();

  const updated = invites.map((i) =>
    i.id === inviteId ? { ...i, status } : i
  );

  saveInvites(updated);
};

export const getInviteById = (id) => {
  const invites = JSON.parse(localStorage.getItem("invites") || "[]");
  return invites.find((i) => i.id === id);
};