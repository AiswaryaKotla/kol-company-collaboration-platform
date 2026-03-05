const KEY = "deliverables";

const read = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const write = (data) => localStorage.setItem(KEY, JSON.stringify(data));

// ============================
// KOL submits deliverable
// ============================
export function submitDeliverable(payload) {
  const data = read();

  const existingIndex = data.findIndex(
    (d) => d.inviteId === payload.inviteId
  );

  const record = {
    ...payload,
    id: Date.now(),
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    data[existingIndex] = record;
  } else {
    data.push(record);
  }

  write(data);
}

// ============================
// Company views deliverables
// ============================
export function getDeliverablesByCampaign(campaignId) {
  return read().filter((d) => d.campaignId === campaignId);
}

// ============================
// Update status
// ============================
export function updateDeliverableStatus(id, status) {
  const data = read().map((d) =>
    d.id === id ? { ...d, status } : d
  );
  write(data);
}