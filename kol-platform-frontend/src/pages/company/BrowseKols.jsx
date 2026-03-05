import { useEffect, useState } from "react";
import { addInvite } from "../../utils/inviteStore";
import { useAuth } from "../../store/AuthContext";

const MOCK_KOLS = [
  {
    id: 1,
    name: "Aiswarya Lifestyle",
    platform: "Instagram",
    country: "India",
    followers: 74434,
    engagement: 4.7,
    category: "Fashion",
    rating: 4.8,
    price: 250,
  },
  {
    id: 2,
    name: "Tech With Rahul",
    platform: "YouTube",
    country: "India",
    followers: 120000,
    engagement: 6.1,
    category: "Tech",
    rating: 4.6,
    price: 400,
  },
  {
    id: 3,
    name: "FitLife Coach",
    platform: "Instagram",
    country: "USA",
    followers: 98000,
    engagement: 5.3,
    category: "Fitness",
    rating: 4.9,
    price: 320,
  },
];

function BrowseKols() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [country, setCountry] = useState("");
  const [filtered, setFiltered] = useState(MOCK_KOLS);
  const [page, setPage] = useState(1);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // filtering logic
  useEffect(() => {
    let data = [...MOCK_KOLS];

    if (debouncedSearch) {
      data = data.filter((k) =>
        k.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (platform) {
      data = data.filter((k) => k.platform === platform);
    }

    if (country) {
      data = data.filter((k) => k.country === country);
    }

    setFiltered(data);
    setPage(1);
  }, [debouncedSearch, platform, country]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ==============================
     SEND PROPOSAL
  ============================== */

  const sendProposal = (kol) => {
    const campaignId = prompt("Enter Campaign ID to invite this KOL:");

    if (!campaignId) return;

    addInvite({
      id: Date.now(),
      campaignId: Number(campaignId),
      companyEmail: user?.email,
      kolEmail: kol.name,
      status: "pending",
    });

    alert("Proposal sent successfully ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Browse KOLs</h1>
        <p className="text-gray-500">
          Discover influencers for your campaigns
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-4 grid md:grid-cols-4 gap-4">
        <input
          placeholder="Search influencer..."
          className="border rounded-lg p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg p-2"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">All Platforms</option>
          <option>Instagram</option>
          <option>YouTube</option>
          <option>TikTok</option>
          <option>X</option>
        </select>

        <select
          className="border rounded-lg p-2"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          <option>India</option>
          <option>USA</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setPlatform("");
            setCountry("");
          }}
          className="bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500">
          No influencers found
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {paginated.map((kol) => (
            <div
              key={kol.id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{kol.name}</h3>
                  <p className="text-sm text-gray-500">
                    {kol.platform} • {kol.country}
                  </p>
                </div>

                <span className="text-yellow-500 font-semibold">
                   {kol.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="font-semibold">
                    {kol.followers.toLocaleString()}
                  </p>
                  <p className="text-gray-500">Followers</p>
                </div>

                <div>
                  <p className="font-semibold">{kol.engagement}%</p>
                  <p className="text-gray-500">Engagement</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">
                  ${kol.price}
                </span>

                <button
                  onClick={() => sendProposal(kol)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Send Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseKols;