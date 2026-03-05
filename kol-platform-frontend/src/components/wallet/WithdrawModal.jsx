import { useState } from "react";

function WithdrawModal({ isOpen, onClose, balance }) {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleWithdraw = () => {
    if (!amount || Number(amount) <= 0) return alert("Enter valid amount");
    if (Number(amount) > balance) return alert("Insufficient balance");

    alert("Withdrawal requested ");
    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Withdraw Funds</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleWithdraw}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawModal;