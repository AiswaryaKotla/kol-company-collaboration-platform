import useRealtime from "../../hooks/useRealtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addInvite } from "../../utils/inviteStore";
import {
  getProposalsForCampaign,
  updateProposalStatus,
} from "../../utils/proposalStore";
import {
  addCollaboration,
  approveDeliverable,
  getCompanyCollaborations,
} from "../../utils/collaborationStore";
import {
  getCompanyCampaigns,
  getCampaignById,
} from "../../utils/campaignStore";
import { useAuth } from "../../store/AuthContext";

function CampaignManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [, forceRefresh] = useState(false);

  useRealtime(() => {
    forceRefresh((p) => !p);
  });

  /* ==============================
     LOAD CAMPAIGNS
  ============================== */

  const allCampaigns = getCompanyCampaigns(user?.email) || [];

  const filtered = allCampaigns.filter(
    (c) => c.status === tab
  );

  /* ==============================
     INVITE KOL
  ============================== */

  const handleInvite = (campaignId) => {
    const kolEmail = prompt("Enter KOL email to invite:");

    if (!kolEmail) return;

    addInvite({
      id: Date.now(),
      campaignId,
      companyEmail: user?.email,
      kolEmail,
      status: "pending",
    });

    alert("Invitation sent ");
  };

  /* ==============================
     ACCEPT / REJECT PROPOSAL
  ============================== */

  const handleProposalDecision = (proposal, status) => {

  // update proposal status using inviteId
  updateProposalStatus(proposal.inviteId, status);

  // if accepted create collaboration
  if (status === "accepted") {

    const campaign = getCampaignById(proposal.campaignId);

    const amount =
      proposal.amount ||
      campaign?.budgetMax ||
      campaign?.budgetMin ||
      0;

    addCollaboration({
      id: Date.now(),
      inviteId: proposal.inviteId,
      campaignId: proposal.campaignId,
      kolEmail: proposal.kolEmail,
      companyEmail: user?.email,
      agreedAmount: amount,
      status: "active",
      deliverableStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    alert("Deal accepted. Collaboration created.");
  }

  // remove proposal from UI immediately
  forceRefresh((p) => !p);
};

  const badgeColor = (status) => {
    if (status === "active")
      return "bg-green-100 text-green-700";
    if (status === "draft")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Campaign Management
        </h1>
        <p className="text-gray-500">
          Manage and track your campaigns
        </p>
      </div>

      {/* Tabs */}

      <div className="flex gap-3">
        {["active", "draft", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500">
          No campaigns found
        </div>
      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {filtered.map((campaign) => {

            const proposals =
              getProposalsForCampaign(campaign.id) || [];

            const collaborations =
              getCompanyCollaborations(user?.email)
                .filter(
                  (c) =>
                    c.campaignId === campaign.id &&
                    c.status === "active"
                );

            return (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow p-6 space-y-4"
              >

                {/* Campaign Header */}

                <div>
                  <h3 className="text-lg font-semibold">
                    {campaign.title}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${badgeColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </div>

                {/* Campaign Details */}

                <div className="text-sm text-gray-600 space-y-1">

                  <p><b>Description:</b> {campaign.description}</p>
                  <p><b>Deliverables:</b> {campaign.deliverables}</p>
                  <p><b>Budget:</b> ${campaign.budgetMin} - ${campaign.budgetMax}</p>
                  <p><b>Deadline:</b> {campaign.deadline}</p>
                  <p><b>Audience:</b> {campaign.audience}</p>
                  <p><b>Platform:</b> {campaign.platform}</p>
                  <p><b>Country:</b> {campaign.country}</p>

                </div>

                {/* PROPOSALS */}

                <div>

                  <h4 className="font-semibold text-sm mb-2">
                    Incoming Proposals ({proposals.length})
                  </h4>

                  {proposals.map((p) => (
                    <div
                      key={p.inviteId}
                      className="border rounded-lg p-3 text-sm mb-2"
                    >

                      <div className="flex justify-between">

                        <div>
                          <p className="font-medium">@{p.kolEmail}</p>
                          <p className="text-gray-500">
                            Offer: ${p.amount || "—"}
                          </p>
                        </div>

                        {p.status !== "accepted" && (
                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                handleProposalDecision(p, "accepted")
                              }
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                            >
                              Accept
                            </button>

                            <button
                              onClick={() =>
                                handleProposalDecision(p, "rejected")
                              }
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                            >
                              Reject
                            </button>

                            <button
                              onClick={() =>
                                navigate(
                                  `/company/negotiation?inviteId=${p.inviteId}`
                                )
                              }
                              className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
                            >
                              Negotiate
                            </button>

                          </div>
                        )}

                      </div>

                    </div>
                  ))}

                </div>

                {/* ACTIVE COLLABS */}

                {collaborations.length > 0 && (

                  <div>

                    <h4 className="font-semibold text-sm mb-2">
                      Active Collaborations
                    </h4>

                    {collaborations.map((c) => (

                      <div
                        key={c.id}
                        className="border rounded-lg p-3 flex justify-between items-center text-sm"
                      >

                        <div>
                          <p>@{c.kolEmail}</p>
                          <p className="text-gray-500">
                            ${c.agreedAmount}
                          </p>
                        </div>

                        {c.deliverableStatus === "submitted" && (

                          <button
                            onClick={() => {
                              approveDeliverable(c.id);
                              alert("Payment released ");
                              forceRefresh((p) => !p);
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Release Payment
                          </button>

                        )}

                      </div>

                    ))}

                  </div>

                )}

                {/* Invite Button */}

                <button
                  onClick={() =>
                    handleInvite(campaign.id)
                  }
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm"
                >
                  Invite KOL
                </button>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CampaignManagement;