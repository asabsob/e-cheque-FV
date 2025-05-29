import { useState } from "react";

export default function IssueChequeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    sender_account: "",
    receiver_account: "",
    confirm_receiver_account: "",
    amount: "",
    confirm_amount: "",
    cheque_date: "",
    expiry_date: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [receiverLocked, setReceiverLocked] = useState(false);
  const [amountLocked, setAmountLocked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "receiver_account" && value.trim().length > 0) {
      setReceiverLocked(true);
    }

    if (name === "amount" && value.trim().length > 0) {
      setAmountLocked(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.receiver_account !== formData.confirm_receiver_account) {
      setError("❌ اسم المستفيد غير متطابق.");
      return;
    }

    if (formData.amount !== formData.confirm_amount) {
      setError("❌ المبلغ غير متطابق.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://echeque-api.vercel.app/echeques/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_account: formData.sender_account,
          receiver_account: formData.receiver_account,
          amount: parseFloat(formData.amount),
          cheque_date: formData.cheque_date,
          expiry_date: formData.expiry_date,
        }),
      });

      if (!res.ok) throw new Error("فشل في إصدار الشيك");
      const data = await res.json();
      onSuccess(data);
    } catch (err) {
      setError("حدث خطأ أثناء إصدار الشيك");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
        🧾 إصدار شيك جديد
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <label className="font-medium text-gray-700">رقم حساب المُصدر</label>
        <input
          name="sender_account"
          placeholder="رقم حساب المُصدر"
          onChange={handleChange}
          required
          className="input"
        />

        {!receiverLocked && (
          <input
            name="receiver_account"
            placeholder="اسم المستفيد"
            onChange={handleChange}
            required
            className="input"
          />
        )}

        <input
          name="confirm_receiver_account"
          placeholder="تأكيد اسم المستفيد"
          onChange={handleChange}
          required
          className="input"
        />

        {!amountLocked && (
          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="المبلغ (دينار)"
            onChange={handleChange}
            required
            className="input"
          />
        )}

        <input
          type="number"
          step="0.01"
          name="confirm_amount"
          placeholder="تأكيد المبلغ"
          onChange={handleChange}
          required
          className="input"
        />

        <label className="font-medium text-gray-700">تاريخ الشيك</label>
        <input
          type="date"
          name="cheque_date"
          onChange={handleChange}
          required
          className="input"
        />

        <label className="font-medium text-gray-700">تاريخ الانتهاء</label>
        <input
          type="date"
          name="expiry_date"
          onChange={handleChange}
          required
          className="input"
        />
      </div>

      {error && (
        <div className="text-red-600 text-center font-semibold mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn w-full text-lg"
      >
        {submitting ? "⏳ يتم الإرسال..." : "✅ إصدار الشيك"}
      </button>
    </form>
  );
}
