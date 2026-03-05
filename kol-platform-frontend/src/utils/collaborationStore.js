import { updateWallet, addTransaction, getWallet } from "./walletStore";

const KEY = "kol_collaborations";

/* ===============================
   GET ALL COLLABORATIONS
================================ */
export function getCollaborations() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

/* ===============================
   ADD COLLABORATION
   (called when company accepts proposal)
================================ */
export function addCollaboration(collab) {
  const all = getCollaborations();

  const agreedAmount = Number(collab.agreedAmount || 0);

  const companyWallet = getWallet(collab.companyEmail);

  if (companyWallet.available < agreedAmount) {
    alert("Insufficient funds in company wallet.");
    return;
  }

  const newCollab = {
    id: collab.id || Date.now(),
    inviteId: collab.inviteId,
    campaignId: collab.campaignId,
    kolEmail: collab.kolEmail,
    companyEmail: collab.companyEmail,

    status: "active",
    escrowStatus: "funded",
    deliverableStatus: "pending",
    agreedAmount,

    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  /* MOVE COMPANY MONEY INTO ESCROW */
  updateWallet(collab.companyEmail, (wallet) => ({
    ...wallet,
    available: wallet.available - agreedAmount,
    pending: wallet.pending + agreedAmount,
  }));

  addTransaction(collab.companyEmail, {
    type: "escrow_funded",
    amount: -agreedAmount,
    date: new Date().toLocaleDateString(),
  });

  localStorage.setItem(KEY, JSON.stringify([newCollab, ...all]));
}

/* ===============================
   GET KOL COLLABORATIONS
================================ */
export function getKOLCollaborations(kolEmail) {
  return getCollaborations().filter(
    (c) => c.kolEmail === kolEmail
  );
}

/* ===============================
   GET COMPANY COLLABORATIONS
================================ */
export function getCompanyCollaborations(companyEmail) {
  return getCollaborations().filter(
    (c) => c.companyEmail === companyEmail
  );
}

/* ===============================
   UPDATE COLLAB STATUS
================================ */
export function updateCollaborationStatus(id, status) {
  const updated = getCollaborations().map((c) =>
    c.id === id
      ? { ...c, status, updatedAt: Date.now() }
      : c
  );

  localStorage.setItem(KEY, JSON.stringify(updated));
}

/* ===============================
   SUBMIT DELIVERABLE (KOL)
================================ */
export function submitDeliverable(id) {
  const updated = getCollaborations().map((c) =>
    c.id === id
      ? {
          ...c,
          deliverableStatus: "submitted",
          updatedAt: Date.now(),
        }
      : c
  );

  localStorage.setItem(KEY, JSON.stringify(updated));
}

/* ===============================
   APPROVE DELIVERABLE (COMPANY)
   RELEASE ESCROW
================================ */
export function approveDeliverable(id) {
  const all = getCollaborations();

  const updated = all.map((c) => {
    if (c.id !== id) return c;

    const amount = Number(c.agreedAmount || 0);

    /* COMPANY WALLET UPDATE */
    updateWallet(c.companyEmail, (wallet) => ({
      ...wallet,
      pending: wallet.pending - amount,
      total: wallet.total + amount,
    }));

    addTransaction(c.companyEmail, {
      type: "escrow_released",
      amount: -amount,
      date: new Date().toLocaleDateString(),
    });

    /* CREDIT KOL WALLET */
    updateWallet(c.kolEmail, (wallet) => ({
      ...wallet,
      available: wallet.available + amount,
      total: wallet.total + amount,
    }));

    addTransaction(c.kolEmail, {
      type: "payment_received",
      amount: amount,
      date: new Date().toLocaleDateString(),
    });

    return {
      ...c,
      deliverableStatus: "approved",
      escrowStatus: "released",
      status: "completed",
      updatedAt: Date.now(),
    };
  });

  localStorage.setItem(KEY, JSON.stringify(updated));
}