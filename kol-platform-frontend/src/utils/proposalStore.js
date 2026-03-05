// src/utils/proposalStore.js

const KEY = "proposals";

/* ---------------- helpers ---------------- */

const read = () => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

const write = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

/* ---------------- UPSERT ---------------- */

export const upsertProposal = (proposal) => {
  const proposals = read();

  const index = proposals.findIndex(
    (p) => p.inviteId === proposal.inviteId
  );

  if (index >= 0) {
    proposals[index] = {
      ...proposals[index],
      ...proposal,
      updatedAt: Date.now(),
    };
  } else {
    proposals.push({
      ...proposal,
      createdAt: Date.now(),
    });
  }

  write(proposals);
};

/* ---------------- GET BY INVITE ---------------- */

export const getProposalByInvite = (inviteId) => {
  const proposals = read();
  return proposals.find((p) => p.inviteId === inviteId);
};

/* ---------------- GET BY CAMPAIGN ---------------- */

export const getProposalsForCampaign = (campaignId) => {
  const proposals = read();

  return proposals.filter(
    (p) => Number(p.campaignId) === Number(campaignId)
  );
};

/* ---------------- UPDATE STATUS ---------------- */

export const updateProposalStatus = (inviteId, status) => {
  const proposals = read();

  const updated = proposals.map((p) =>
    p.inviteId === inviteId ? { ...p, status } : p
  );

  write(updated);
};

/* ---------------- GET ALL ---------------- */

export const getProposals = () => {
  return read();
};

/* ---------------- ADD ---------------- */

export const addProposal = (proposal) => {
  const proposals = read();

  proposals.push({
    ...proposal,
    createdAt: Date.now(),
  });

  write(proposals);
};