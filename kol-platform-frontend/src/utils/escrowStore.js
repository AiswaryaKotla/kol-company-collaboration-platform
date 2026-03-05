const KEY = "escrows";

/**
 * Get all escrows
 */
export const getEscrows = () => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

/**
 * Create escrow (company funds locked)
 */
export const createEscrow = (escrow) => {
  const escrows = getEscrows();

  escrows.push({
    ...escrow,
    status: "funded", // funded → released
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(KEY, JSON.stringify(escrows));
};

/**
 * Get escrow by collaboration
 */
export const getEscrowByCollabId = (collabId) => {
  return getEscrows().find(
    (e) => e.collaborationId === collabId
  );
};

/**
 * Release escrow to KOL
 */
export const releaseEscrow = (collabId) => {
  const escrows = getEscrows();

  const updated = escrows.map((e) =>
    e.collaborationId === collabId
      ? { ...e, status: "released" }
      : e
  );

  localStorage.setItem(KEY, JSON.stringify(updated));
};