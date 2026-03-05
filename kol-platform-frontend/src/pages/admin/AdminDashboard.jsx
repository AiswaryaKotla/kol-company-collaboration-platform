import { useEffect, useState } from "react";
import { getAllSocialAccounts } from "../../utils/socialStore";

function AdminDashboard() {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    setAccounts(getAllSocialAccounts());
  }, []);

  const totalAccounts = accounts.length;

  const pending = accounts.filter(
    (a) => a.status === "pending"
  ).length;

  const verified = accounts.filter(
    (a) => a.status === "verified"
  ).length;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <StatCard
          title="Total Social Accounts"
          value={totalAccounts}
        />

        <StatCard
          title="Pending Verification"
          value={pending}
        />

        <StatCard
          title="Verified Accounts"
          value={verified}
        />

      </div>


      {/* Quick Actions */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-3">
          Moderation
        </h2>

        <p className="text-gray-500 mb-4">
          Review social accounts waiting for verification.
        </p>

        <a
          href="/admin/verify-social"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Review Accounts
        </a>

      </div>

    </div>
  );
}


/* Small reusable card */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold">
        {value}
      </h2>

    </div>
  );
}

export default AdminDashboard;