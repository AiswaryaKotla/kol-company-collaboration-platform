import { getAllAccounts, verifyAccount } from "../../utils/socialStore";
import { useState, useEffect } from "react";

function VerifyAccounts() {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const data = getAllAccounts();

    let list = [];

    Object.keys(data).forEach((email) => {

      data[email].forEach((acc) => {

        if (acc.status === "pending") {
          list.push({
            ...acc,
            email
          });
        }

      });

    });

    setAccounts(list);

  }, []);

  const verify = (email, id) => {

    verifyAccount(email, id);

    window.location.reload();

  };

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Verify Social Accounts
      </h1>

      {accounts.length === 0 ? (
        <p>No pending verifications</p>
      ) : (

        accounts.map((acc) => (

          <div key={acc.id} className="bg-white p-4 rounded shadow mb-3">

            <p>{acc.platform}</p>
            <p>@{acc.handle}</p>
            <p>User: {acc.email}</p>

            <button
              onClick={() => verify(acc.email, acc.id)}
              className="bg-green-600 text-white px-3 py-2 rounded mt-2"
            >
              Verify
            </button>

          </div>

        ))

      )}

    </div>

  );

}

export default VerifyAccounts;