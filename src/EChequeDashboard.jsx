import React, { useEffect, useState } from "react";
import IssueChequeForm from "./IssueChequeForm";

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-800",
  Signed: "bg-blue-200 text-blue-800",
  Presented: "bg-green-200 text-green-800",
  Revoked: "bg-red-200 text-red-800",
  Outdated: "bg-gray-300 text-gray-700",
};

export default function EChequeDashboard() {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCheques = () => {
    setLoading(true);
    fetch("https://echeque-api-production.up.railway.app/echeques/all", {
      headers: {
        "x_api_key": "bank-abc-key",
      },
    })
      .then((res) => res.json())
      .then((data) => setCheques(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCheques();
  }, []);

  return (
    <div className="p-6 bg-slate-100 min-h-screen space-y-6">
      <IssueChequeForm onSuccess={fetchCheques} />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">❌ Failed to load cheques.</p>
      ) : cheques.length === 0 ? (
        <p className="text-center">No cheques available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {cheques.map((cheque) => {
            const status =
              new Date(cheque.expiry_date) < new Date() && cheque.status !== "Revoked"
                ? "Outdated"
                : cheque.status;

            return (
              <div
                key={cheque.id}
                className="bg-white border border-gray-400 shadow-lg rounded-xl px-6 py-4 font-serif relative"
                style={{
                  backgroundImage: "linear-gradient(to bottom right, #fdf6ee, #eee)",
                  backgroundSize: "cover",
                }}
              >
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>فرع</span>
                  <span className="italic">Cheque #{cheque.id.slice(0, 8)}</span>
                </div>

                <div className="flex justify-between mb-3">
                  <div className="text-sm">
                    <span className="font-bold">Pay To:</span> {cheque.receiver_account}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">Date:</span> {cheque.cheque_date}
                  </div>
                </div>

                <div className="text-lg font-bold mb-2">JD {cheque.amount}</div>

                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Sender:</span> {cheque.sender_account}
                </div>

                <div className="flex justify-between text-xs">
                  <span>Expiry: {cheque.expiry_date}</span>
                  <span className={`px-2 py-1 rounded-full ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>

                <div className="mt-6 border-t pt-2 text-right text-xs italic text-gray-500">
                  Signature ____________________
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
