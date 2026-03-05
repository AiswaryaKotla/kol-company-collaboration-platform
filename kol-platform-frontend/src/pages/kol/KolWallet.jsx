import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { getWallet, updateWallet, addTransaction } from "../../utils/walletStore";
import WalletSkeleton from "../../components/wallet/WalletSkeleton";
import WithdrawModal from "../../components/wallet/WithdrawModal";

function formatCurrency(num) {
  return `$${Number(num).toLocaleString()}`;
}

const STATUS_STYLES = {
  payment_received: "bg-green-100 text-green-700",
  escrow_funded: "bg-yellow-100 text-yellow-700",
  escrow_released: "bg-blue-100 text-blue-700",
  withdrawal: "bg-red-100 text-red-700",
  add_funds: "bg-green-100 text-green-700",
};

function KolWallet() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  /* =========================
     LOAD WALLET
  ========================= */

  const refreshWallet = () => {
    if (!user) return;
    const data = getWallet(user.email);
    setWallet(data);
  };

  useEffect(() => {
    if (!user) return;

    refreshWallet();
    setLoading(false);
  }, [user]);

  /* =========================
     WITHDRAW HANDLER
  ========================= */

  const handleWithdraw = (amount) => {
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    const currentWallet = getWallet(user.email);

    if (currentWallet.available < withdrawAmount) {
      alert("Insufficient balance");
      return;
    }

    updateWallet(user.email, (w) => ({
      ...w,
      available: w.available - withdrawAmount,
    }));

    addTransaction(user.email, {
      type: "withdrawal",
      amount: -withdrawAmount,
      createdAt: Date.now(),
    });

    refreshWallet();
  };

  /* =========================
     FILTER + PAGINATION
  ========================= */

  const filteredTx = useMemo(() => {
    if (!wallet) return [];

    return wallet.transactions.filter((t) =>
      filterDate
        ? new Date(t.createdAt).toISOString().split("T")[0] === filterDate
        : true
    );
  }, [wallet, filterDate]);

  const paginatedTx = filteredTx.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredTx.length / PAGE_SIZE);

  if (loading) return <WalletSkeleton />;

  if (!wallet)
    return (
      <div className="text-gray-500 p-10 text-center">
        No wallet data available
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wallet</h1>

      {/* SUMMARY CARDS */}

      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Available Balance" value={formatCurrency(wallet.available)} />
        <Card title="Pending Balance" value={formatCurrency(wallet.pending)} />
        <Card title="Total Earned" value={formatCurrency(wallet.total)} />

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">Withdraw Funds</p>

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">
              {formatCurrency(wallet.available)}
            </h3>

            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* FILTER */}

      <div className="flex gap-3 items-center">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2"
        />

        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="text-sm text-blue-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* TRANSACTIONS TABLE */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTx.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-400">
                  No transactions yet
                </td>
              </tr>
            ) : (
              paginatedTx.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        STATUS_STYLES[t.type] || "bg-gray-100"
                      }`}
                    >
                      {t.type.replace("_", " ")}
                    </span>
                  </td>

                  <td
                    className={`p-4 font-medium ${
                      t.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </td>

                  <td className="p-4">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* WITHDRAW MODAL */}

      <WithdrawModal
        isOpen={showWithdraw}
        onWithdraw={(amount) => {
          handleWithdraw(amount);
          setShowWithdraw(false);
        }}
        onClose={() => setShowWithdraw(false)}
        balance={wallet.available}
      />
    </div>
  );
}

/* SMALL CARD COMPONENT */

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

export default KolWallet;