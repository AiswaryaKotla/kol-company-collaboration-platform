import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import {
  getProposalByInvite,
  upsertProposal,
  addProposal,
} from "../../utils/proposalStore";
import {
  updateInviteStatus,
  getInviteById,
} from "../../utils/inviteStore";
import { addCollaboration } from "../../utils/collaborationStore";
import { useSearchParams, useNavigate } from "react-router-dom";

function Negotiation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const inviteId = Number(params.get("inviteId"));

  const [offer, setOffer] = useState("");
  const [proposal, setProposal] = useState(null);
  const [searchParams] = useSearchParams();
  const invite = getInviteById(inviteId);


  /* ==============================
     LOAD EXISTING PROPOSAL
  ============================== */
  useEffect(() => {
    if (!inviteId) return;

    const existing = getProposalByInvite(inviteId);
    if (existing) {
      setProposal(existing);
    }
  }, [inviteId]);

  /* ==============================
     SEND / UPDATE OFFER
  ============================== */
  const handleSendOffer = () => {
  if (!offer) return;

  const proposal = {
    id: Date.now(),
    inviteId: inviteId,
    campaignId: invite?.campaignId,
    kolEmail: user.email,
    amount: Number(offer),
    status: "pending",
  };

  addProposal(proposal);

  alert("Offer sent to company ");
  setOffer("");
};

  /* ==============================
     ACCEPT FINAL OFFER
  ============================== */
  const handleAccept = () => {
    if (!proposal) return;

    const updated = {
      ...proposal,
      status: "accepted",
    };

    //  Update proposal
    upsertProposal(updated);

    //  Get invite (CRITICAL FIX)
    const invite = getInviteById(proposal.inviteId);

    if (!invite) {
      alert("Invite not found ❌");
      return;
    }

    //  Update invite status
    updateInviteStatus(invite.id, "accepted");

    //  Create collaboration using invite data
    addCollaboration({
      id: Date.now(),
      inviteId: invite.id,
      campaignId: invite.campaignId,
      kolEmail: invite.kolEmail,
      companyEmail: invite.companyEmail,
      agreedAmount: proposal.amount,
      status: "active",
      deliverableStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    setProposal(updated);

    alert("Negotiation accepted. Collaboration created!");

    // Redirect properly
    if (user.role === "kol") {
      navigate("/kol/collaborations");
    } else {
      navigate("/company/campaigns");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Negotiation</h1>

      {/* PROPOSAL CARD */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        {proposal ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">
                Current Offer
              </span>
              <span className="font-bold text-lg">
                ${proposal.amount}
              </span>
            </div>

            <div className="text-sm text-gray-500">
              Status:{" "}
              <span className="font-medium capitalize">
                {proposal.status}
              </span>
            </div>

            {proposal.status !== "accepted" && (
              <button
                onClick={handleAccept}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Accept Final Offer
              </button>
            )}
          </>
        ) : (
          <div className="text-gray-500">
            No proposal yet. Start negotiation.
          </div>
        )}
      </div>

      {/* SEND OFFER */}
      {proposal?.status !== "accepted" && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="font-semibold">Send Offer</h3>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter amount"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="flex-1 border rounded-lg p-3"
            />

            <button
              onClick={handleSendOffer}
              className="bg-blue-600 text-white px-5 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Negotiation;