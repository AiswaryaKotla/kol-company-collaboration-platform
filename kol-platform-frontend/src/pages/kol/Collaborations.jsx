import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import {
  getInvitesForKol,
  updateInviteStatus,
} from "../../utils/inviteStore";
import {
  getKOLCollaborations,
  addCollaboration,
  submitDeliverable,
} from "../../utils/collaborationStore";
import { getCampaignById } from "../../utils/campaignStore";
import { useNavigate } from "react-router-dom";

export default function Collaborations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("incoming");
  const [invites, setInvites] = useState([]);
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user]);

  const refreshData = () => {
    setInvites(getInvitesForKol(user.email));
    setCollabs(getKOLCollaborations(user.email));
  };

  /* ==========================
     ACCEPT INVITE
  ========================== */

  const handleAccept = (invite) => {
    updateInviteStatus(invite.id, "accepted");

    const campaign = getCampaignById(invite.campaignId);

    addCollaboration({
      id: Date.now(),
      campaignId: invite.campaignId,
      kolEmail: user.email,
      companyEmail: invite.companyEmail,
      agreedAmount:
        campaign?.budgetMax ||
        campaign?.budgetMin ||
        0,
      status: "active",
      deliverableStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    refreshData();
  };

  const handleReject = (invite) => {
    updateInviteStatus(invite.id, "rejected");
    refreshData();
  };

  /* ==========================
     SUBMIT DELIVERABLE
  ========================== */

  const handleSubmitDeliverable = (collabId) => {
    submitDeliverable(collabId);
    alert("Deliverable submitted ");
    refreshData();
  };

  const incoming = invites.filter((i) => i.status === "pending");
  const rejected = invites.filter((i) => i.status === "rejected");
  const active = collabs.filter((c) => c.status === "active");
  const completed = collabs.filter((c) => c.status === "completed");

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <h1 className="text-2xl font-semibold">
        Campaign Invitations
      </h1>

      {/* Tabs */}

      <div className="flex gap-3">
        {["incoming", "active", "completed", "rejected"].map((t) => (
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

      {/* ================= INCOMING ================= */}

      {tab === "incoming" &&
        incoming.map((invite) => {
          const campaign = getCampaignById(invite.campaignId);

          return (
            <div
              key={invite.id}
              className="bg-white rounded-2xl shadow p-6"
            >

              <h2 className="text-lg font-semibold">
                {campaign?.title || "Campaign"}
              </h2>

              {/* Campaign Details */}

              <div className="text-sm text-gray-600 space-y-1 mt-2">

                <p>
                  <span className="font-medium">Brand:</span>{" "}
                  {campaign?.brand || campaign?.title}
                </p>

                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {campaign?.description}
                </p>

                <p>
                  <span className="font-medium">Deliverables:</span>{" "}
                  {campaign?.deliverables}
                </p>

                <p>
                  <span className="font-medium">Budget:</span>{" "}
                  ${campaign?.budgetMin} - ${campaign?.budgetMax}
                </p>

                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {campaign?.deadline}
                </p>

                <p>
                  <span className="font-medium">Audience:</span>{" "}
                  {campaign?.audience}
                </p>

                <p>
                  <span className="font-medium">Platform:</span>{" "}
                  {campaign?.platform}
                </p>

                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {campaign?.country}
                </p>

              </div>

              {/* Buttons */}

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => handleAccept(invite)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(invite)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/kol/negotiation?inviteId=${invite.id}`
                    )
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Negotiate
                </button>

              </div>

            </div>
          );
        })}

      {/* ================= ACTIVE ================= */}

      {tab === "active" &&
        active.map((collab) => {
          const campaign = getCampaignById(collab.campaignId);

          return (
            <div
              key={collab.id}
              className="bg-white rounded-2xl shadow p-6"
            >

              <h2 className="text-lg font-semibold">
                {campaign?.title}
              </h2>

              <p className="text-gray-500">
                Brand: {campaign?.brand || campaign?.title}
              </p>

              <p className="mt-2 font-medium">
                Agreed Amount: ${collab.agreedAmount}
              </p>

              <div className="mt-4">

                {collab.deliverableStatus === "pending" && (
                  <button
                    onClick={() =>
                      handleSubmitDeliverable(collab.id)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Submit Deliverable
                  </button>
                )}

                {collab.deliverableStatus === "submitted" && (
                  <span className="inline-block px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
                    Submitted – Waiting for Approval
                  </span>
                )}

                {collab.deliverableStatus === "approved" && (
                  <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                    Completed
                  </span>
                )}

              </div>

            </div>
          );
        })}

      {/* ================= COMPLETED ================= */}

      {tab === "completed" &&
        completed.map((collab) => {
          const campaign = getCampaignById(collab.campaignId);

          return (
            <div
              key={collab.id}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h2 className="text-lg font-semibold">
                {campaign?.title}
              </h2>

              <p className="mt-2 font-medium">
                Earned: ${collab.agreedAmount}
              </p>

              <span className="inline-block mt-3 px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full">
                Completed
              </span>
            </div>
          );
        })}

      {/* ================= REJECTED ================= */}

      {tab === "rejected" &&
        rejected.map((invite) => {
          const campaign = getCampaignById(invite.campaignId);

          return (
            <div
              key={invite.id}
              className="bg-white rounded-2xl shadow p-6"
            >

              <h2 className="text-lg font-semibold">
                {campaign?.title}
              </h2>

              <p className="text-gray-500">
                Brand: {campaign?.brand}
              </p>

              <span className="inline-block mt-3 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full">
                Rejected
              </span>

            </div>
          );
        })}

    </div>
  );
}