import { useState } from "react";

export default function SignChequeForm({ chequeId }) {
  const [otp, setOtp] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("https://echeque-api.vercel.app/echeques/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x_api_key": "bank-abc-key", // Replace with real or environment-secured key
        },
        body: JSON.stringify({ cheque_id: chequeId, otp }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage(`✅ Cheque Signed Successfully. Status: ${result.status}`);
      } else {
        setStatusMessage(`❌ ${result.detail || "Failed to sign the cheque."}`);
      }
    } catch (error) {
      setStatusMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-xl shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign Cheque</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">OTP Code</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter the OTP"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Signing..." : "Sign Cheque"}
        </button>
      </form>
      {statusMessage && (
        <p className="mt-4 text-center text-sm font-medium">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
