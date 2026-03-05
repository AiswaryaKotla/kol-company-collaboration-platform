const KEY = "wallets";

/* ===============================
   GET WALLET
================================ */
export const getWallet = (email) => {
  const wallets = JSON.parse(localStorage.getItem(KEY) || "{}");

  if (!wallets[email]) {
    wallets[email] = {
      available: 0,
      pending: 0,
      total: 0,
      transactions: [],
    };

    localStorage.setItem(KEY, JSON.stringify(wallets));
  }

  return wallets[email];
};

/* ===============================
   UPDATE WALLET
================================ */
export const updateWallet = (email, updater) => {
  const wallets = JSON.parse(localStorage.getItem(KEY) || "{}");

  const current = wallets[email] || {
    available: 0,
    pending: 0,
    total: 0,
    transactions: [],
  };

  wallets[email] = updater(current);

  localStorage.setItem(KEY, JSON.stringify(wallets));
};

/* ===============================
   ADD TRANSACTION
================================ */
export const addTransaction = (email, tx) => {
  updateWallet(email, (wallet) => ({
    ...wallet,
    transactions: [
      {
        id: Date.now(),
        ...tx,
        createdAt: Date.now(),
      },
      ...wallet.transactions,
    ],
  }));
};

/* ===============================
   KOL WITHDRAW
================================ */
export const withdrawFunds = (email, amount) => {

  updateWallet(email, (wallet) => {

    if (wallet.available < amount) {
      alert("Insufficient balance");
      return wallet;
    }

    const updated = {
      ...wallet,
      available: wallet.available - amount,
    };

    updated.transactions.unshift({
      id: Date.now(),
      type: "withdrawal",
      amount: -amount,
      date: new Date().toLocaleDateString(),
    });

    return updated;
  });
};

/* ===============================
   COMPANY ESCROW FUND
================================ */
export const fundEscrow = (companyEmail, amount) => {

  updateWallet(companyEmail, (wallet) => {

    const updated = {
      ...wallet,
      available: wallet.available - amount,
      pending: wallet.pending + amount,
    };

    updated.transactions.unshift({
      id: Date.now(),
      type: "escrow funded",
      amount: -amount,
      date: new Date().toLocaleDateString(),
    });

    return updated;
  });
};

/* ===============================
   RELEASE PAYMENT
================================ */
export const releaseEscrow = (companyEmail, kolEmail, amount) => {

  /* COMPANY SIDE */
  updateWallet(companyEmail, (wallet) => {

    const updated = {
      ...wallet,
      pending: wallet.pending - amount,
      total: wallet.total + amount,
    };

    updated.transactions.unshift({
      id: Date.now(),
      type: "escrow released",
      amount: -amount,
      date: new Date().toLocaleDateString(),
    });

    return updated;
  });

  /* KOL SIDE */
  updateWallet(kolEmail, (wallet) => {

    const updated = {
      ...wallet,
      available: wallet.available + amount,
      total: wallet.total + amount,
    };

    updated.transactions.unshift({
      id: Date.now(),
      type: "payment received",
      amount: amount,
      date: new Date().toLocaleDateString(),
    });

    return updated;
  });
};