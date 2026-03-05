import { useMemo, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import {
  getInvitesForKol,
  updateInviteStatus,
} from "../../utils/inviteStore";
import { getCampaignById } from "../../utils/campaignStore";
import { useNavigate } from "react-router-dom";
import { addCollaboration } from "../../utils/collaborationStore";

function Invitations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, forceRefresh] = useState(false);

  //  memoized invites
  const invites = useMemo(() => {
    return getInvitesForKol(user?.email) || [];
  }, [user]);

  //  PRODUCTION ACCEPT / REJECT HANDLER
  const handleDecision = (invite, status) => {
    //  update invite status
    updateInviteStatus(invite.id, status);

    //  if accepted → create collaboration
    if (status === "accepted") {
      const campaign = getCampaignById(invite.campaignId);

      addCollaboration({
        id: Date.now(),
        kolEmail: user?.email,
        companyEmail: invite.companyEmail,
        campaignId: invite.campaignId,
        campaignTitle: campaign?.title || "Campaign",
        budget: campaign?.budget || 0,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }

    //  refresh UI
    forceRefresh((p) => !p);
  };

  const statusColor = (status) => {
    if (status === "accepted")
      return "bg-green-100 text-green-700";
    if (status === "rejected")
      return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Campaign Invitations
        </h1>
        <p className="text-gray-500 text-sm">
          Review and respond to brand invitations
        </p>
      </div>

      {/* Empty state */}
      {invites.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow">
          <p className="text-gray-500">
            No invitations yet 
          </p>
        </div>
      )}

      {/* Invite list */}
      <div className="space-y-4">
        {invites.map((invite) => {
          const campaign = getCampaignById(
            invite.campaignId
          );

          return (
            <div
              key={invite.id}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                {/* LEFT */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {campaign?.title || "Campaign"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Brand:{" "}
                    <span className="font-medium">
                      {campaign?.brand || "—"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    Budget:{" "}
                    <span className="font-medium">
                      ${campaign?.budget || "—"}
                    </span>
                  </p>

                  <p className="text-xs text-gray-400">
                    From: {invite.companyEmail}
                  </p>
                </div>

                {/* RIGHT */}
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(
                    invite.status
                  )}`}
                >
                  {invite.status}
                </span>
              </div>

              {/* ACTIONS */}
              {invite.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleDecision(invite, "accepted")
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleDecision(invite, "rejected")
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/negotiation?inviteId=${invite.id}`
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Negotiate
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Invitations;