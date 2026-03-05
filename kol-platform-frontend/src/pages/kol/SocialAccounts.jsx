import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import {
  addSocialAccount,
  getSocialAccounts,
  requestVerification
} from "../../utils/socialStore";

import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const PLATFORM_ICONS = {
  Instagram: <FaInstagram className="text-pink-500 text-2xl" />,
  YouTube: <FaYoutube className="text-red-500 text-2xl" />,
  TikTok: <FaTiktok className="text-black text-2xl" />,
  X: <FaXTwitter className="text-black text-2xl" />,
};

function SocialAccounts() {

  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [platform, setPlatform] = useState("Instagram");
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [likes, setLikes] = useState("");
  const [views, setViews] = useState("");

  useEffect(() => {
    if (!user) return;
    setAccounts(getSocialAccounts(user.email));
  }, [user]);

  const refresh = () => {
    setAccounts(getSocialAccounts(user.email));
  };

  const addAccount = () => {

    if (!handle) return alert("Enter handle");

    addSocialAccount(user.email, {
      platform,
      handle,
      followers,
      engagement,
      likes,
      views
    });

    refresh();

    setShowModal(false);

    setHandle("");
    setFollowers("");
    setEngagement("");
    setLikes("");
    setViews("");
  };

  const verify = (id) => {
    requestVerification(user.email, id);
    refresh();
  };

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Social Accounts
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Social Account
        </button>

      </div>

      {/* ACCOUNT CARDS */}

      {accounts.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow text-gray-500">
          No social accounts connected
        </div>
      ) : (

        <div className="grid md:grid-cols-3 gap-6">

          {accounts.map((acc) => (

            <div key={acc.id} className="bg-white p-5 rounded-xl shadow">

              <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                  {PLATFORM_ICONS[acc.platform]}

                  <div>

                    <p className="font-semibold">
                      {acc.platform}
                    </p>

                    <p className="text-gray-500 text-sm">
                      @{acc.handle}
                    </p>

                  </div>

                </div>

                {acc.status === "verified" && (
                  <span className="text-green-600 text-sm font-semibold">
                     Verified
                  </span>
                )}

                {acc.status === "pending" && (
                  <span className="text-yellow-600 text-sm font-semibold">
                    Pending
                  </span>
                )}

              </div>

              <div className="grid grid-cols-2 mt-4 text-sm gap-y-3">

                <div>
                  <p className="font-semibold">
                    {acc.followers}
                  </p>
                  <p className="text-gray-500">
                    Followers
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    {acc.engagement}%
                  </p>
                  <p className="text-gray-500">
                    Engagement
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    {acc.likes}
                  </p>
                  <p className="text-gray-500">
                    Avg Likes
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    {acc.views}
                  </p>
                  <p className="text-gray-500">
                    Avg Views
                  </p>
                </div>

              </div>

              {acc.status === "not_verified" && (

                <button
                  onClick={() => verify(acc.id)}
                  className="mt-4 bg-blue-600 text-white px-3 py-2 rounded w-full"
                >
                  Verify Account
                </button>

              )}

            </div>

          ))}

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-96 space-y-4">

            <h2 className="text-lg font-semibold">
              Add Social Account
            </h2>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option>Instagram</option>
              <option>YouTube</option>
              <option>TikTok</option>
              <option>X</option>
            </select>

            <input
              placeholder="Handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Followers"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Engagement %"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Avg Likes"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Avg Views"
              value={views}
              onChange={(e) => setViews(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-3">

              <button
                onClick={addAccount}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Add Account
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default SocialAccounts;