import React, { useState } from "react";

export default function IssueChequeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    sender_account: "",
    receiver_account: "",
    amount: "",
    cheque_date: "",
    expiry_date: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://echeque-api-production.up.railway.app/echeques/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x_api_key": "bank-abc-key",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        // Reset form
        setFormData({
          sender_account: "",
          receiver_account: "",
          amount: "",
          cheque_date: "",
          expiry_date: "",
        });
        onSuccess(); // Reload cheques
      } else {
        alert("❌ Failed to issue cheque. Please check your input.");
      }

    } catch (err) {
      console.error("Error during API call:", err);
      alert("❌ Network error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-300 p-6 rounded-xl shadow max-w-4xl mx-auto space-y-6"
    >
      <h2 className="text-xl font-bold text-center text-blue-700">🧾 Issue New Cheque</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sender Account</label>
          <input
            type="text"
            name="sender_account"
            value={formData.sender_account}
            onChange={handleChange}
            required
            placeholder="e.g. 123456789"
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Receiver Account</label>
          <input
            type="text"
            name="receiver_account"
            value={formData.receiver_account}
            onChange={handleChange}
            required
            placeholder="e.g. 987654321"
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (JOD)</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="e.g. 250.00"
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
          <input
            type="date"
            name="cheque_date"
            value={formData.cheque_date}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Issuing..." : "Issue Cheque"}
        </button>
      </div>
    </form>
  );
}
