import { useEffect, useState } from "react";
import { getAllAccounts, verifyAccount } from "../../utils/socialStore";

function VerifySocialAccounts() {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {

    const data = getAllAccounts();

    let pending = [];

    Object.keys(data).forEach((email) => {

      data[email].forEach((acc) => {

        if (acc.status === "pending") {

          pending.push({
            ...acc,
            email
          });

        }

      });

    });

    setAccounts(pending);

  }, []);

  const verify = (email, id) => {

    verifyAccount(email, id);

    window.location.reload();

  };

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Verify Social Accounts
      </h1>

      {accounts.length === 0 ? (

        <div className="bg-white p-10 rounded-xl shadow text-gray-500">
          No pending verifications
        </div>

      ) : (

        <div className="grid gap-4">

          {accounts.map((acc) => (

            <div
              key={acc.id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
            >

              <div>

                <p className="font-semibold">
                  {acc.platform}
                </p>

                <p className="text-gray-500">
                  @{acc.handle}
                </p>

                <p className="text-sm text-gray-400">
                  User: {acc.email}
                </p>

              </div>

              <button
                onClick={() => verify(acc.email, acc.id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Verify
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default VerifySocialAccounts;