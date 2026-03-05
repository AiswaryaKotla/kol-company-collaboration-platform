import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { getWallet, updateWallet } from "../../utils/walletStore";

const STATUS_STYLES = {
  escrow_funded: "bg-yellow-100 text-yellow-700",
  escrow_released: "bg-blue-100 text-blue-700",
  payment_received: "bg-green-100 text-green-700",
  add_funds: "bg-green-100 text-green-700",
};

const formatMoney = (val) =>
  `${val < 0 ? "-" : ""}$${Math.abs(val).toLocaleString()}`;

export default function CompanyWallet() {
  const { user } = useAuth();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  //  Load wallet from real store
  useEffect(() => {
    if (!user) return;

    const data = getWallet(user.email);
    setWallet(data);
    setLoading(false);
  }, [user]);

  //  Filter transactions
  const filteredTx = useMemo(() => {
    if (!wallet) return [];
    return wallet.transactions.filter((t) =>
      filterDate ? new Date(t.createdAt).toISOString().split("T")[0] === filterDate : true
    );
  }, [wallet, filterDate]);

  const paginatedTx = filteredTx.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredTx.length / PAGE_SIZE);

  if (loading)
    return <div className="p-10 text-center">Loading wallet...</div>;

  if (!wallet)
    return (
      <div className="p-10 text-center text-gray-500">
        No wallet found
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Company Wallet</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card title="Available Balance" value={wallet.available} />
        <Card title="Total Spent" value={wallet.total} />
        <Card title="Funds in Escrow" value={wallet.pending} />
        <Card title="Transactions" value={wallet.transactions.length} />

        <button
          onClick={() => setShowAddFunds(true)}
          className="md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
        >
          + Add Funds
        </button>
      </div>

      {/* Filters */}
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

      {/* Transaction Table */}
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
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTx.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        STATUS_STYLES[tx.type] || "bg-gray-100"
                      }`}
                    >
                      {tx.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {formatMoney(tx.amount || 0)}
                  </td>
                  <td className="p-4">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {showAddFunds && (
        <AddFundsModal
          email={user.email}
          onClose={() => {
            setWallet(getWallet(user.email));
            setShowAddFunds(false);
          }}
        />
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">
        ${value.toLocaleString()}
      </p>
    </div>
  );
}

function AddFundsModal({ email, onClose }) {
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;

    updateWallet(email, (wallet) => ({
      ...wallet,
      available: wallet.available + value,
      transactions: [
        {
          id: Date.now(),
          type: "add_funds",
          amount: value,
          createdAt: Date.now(),
        },
        ...wallet.transactions,
      ],
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
        <h3 className="text-lg font-semibold">Add Funds</h3>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}