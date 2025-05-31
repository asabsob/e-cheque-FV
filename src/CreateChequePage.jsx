// Updated CreateChequePage.jsx with sender name visible and share via SMS/email

import React, { useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import numberToArabicWords from "./utils/numberToArabicWords";

export default function CreateChequePage() {
  const [cheque, setCheque] = useState(null);
  const [step, setStep] = useState(1);
  const [receiverEntered, setReceiverEntered] = useState(false);
  const [amountEntered, setAmountEntered] = useState(false);

  const [formData, setFormData] = useState({
    sender: "",
    receiver: "",
    confirm_receiver: "",
    amount: "",
    confirm_amount: "",
    cheque_date: "",
    account_number: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "receiver" && value.trim().length >= 2) {
      setReceiverEntered(true);
    }
    if (name === "amount" && parseFloat(value) >= 0.01) {
      setAmountEntered(true);
    }
  };

  const confirmStep = (e) => {
    e.preventDefault();
    if (formData.receiver !== formData.confirm_receiver) {
      alert("❌ اسم المستفيد غير متطابق.");
      return;
    }
    if (formData.amount !== formData.confirm_amount) {
      alert("❌ المبلغ غير متطابق.");
      return;
    }
    setStep(2);
  };

  const issueCheque = (e) => {
    e.preventDefault();
    const chequeData = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      sender: formData.sender,
      receiver: formData.receiver,
      amount: parseFloat(formData.amount),
      cheque_date: formData.cheque_date,
      account_number: formData.account_number,
    };
    setCheque(chequeData);
    localStorage.setItem(`cheque-${chequeData.id}`, JSON.stringify(chequeData));
  };

  const downloadCheque = () => {
    const node = document.getElementById(`cheque-${cheque.id}`);
    html2canvas(node).then((canvas) => {
      const link = document.createElement("a");
      link.download = `cheque-${cheque.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const shareCheque = () => {
    const chequeUrl = `${window.location.origin}/preview/${cheque.id}`;
    const message = `شيك جديد من ${cheque.sender} للمستفيد ${cheque.receiver} بمبلغ ${cheque.amount} د.أ\nرابط الشيك: ${chequeUrl}`;

    if (navigator.share) {
      navigator.share({
        title: "مشاركة الشيك",
        text: message,
        url: chequeUrl,
      }).catch(console.error);
    } else {
      alert("يرجى نسخ الرابط يدويًا:\n" + message);
    }
  };

  const signatureData = cheque ? localStorage.getItem(`signature-${cheque.id}`) : null;

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-100 font-sans">
      {!cheque && (
        <form
          onSubmit={step === 1 ? confirmStep : issueCheque}
          className="mb-8 space-y-4 bg-white p-4 sm:p-6 rounded shadow max-w-xl mx-auto w-full"
        >
          <h2 className="text-xl font-bold text-center">🧾 إصدار شيك جديد</h2>

          {step === 1 && (
            <>
              {!receiverEntered && (
                <input
                  name="receiver"
                  placeholder="اسم المستفيد"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="input w-full"
                />
              )}
              <input
                name="confirm_receiver"
                placeholder="تأكيد اسم المستفيد"
                onChange={handleChange}
                required
                className="input w-full"
              />
              {!amountEntered && (
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="المبلغ (دينار)"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="input w-full"
                />
              )}
              <input
                type="number"
                step="0.01"
                name="confirm_amount"
                placeholder="تأكيد المبلغ"
                onChange={handleChange}
                required
                className="input w-full"
              />
              <button type="submit" className="btn w-full">
                تأكيد المعلومات
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                name="sender"
                placeholder="اسم المُصدر"
                onChange={handleChange}
                required
                className="input w-full"
              />
              <input
                type="date"
                name="cheque_date"
                onChange={handleChange}
                required
                className="input w-full"
              />
              <input
                name="account_number"
                placeholder="رقم الحساب"
                onChange={handleChange}
                required
                className="input w-full"
              />
              <button type="submit" className="btn w-full">
                ✅ إصدار الشيك
              </button>
            </>
          )}
        </form>
      )}

      {cheque && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center items-center">
            <button
              onClick={downloadCheque}
              className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              تحميل الشيك
            </button>
            <button
              onClick={() => navigate(`/sign/${cheque.id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              توقيع الشيك
            </button>
            <button
              onClick={() => navigate(`/preview/${cheque.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              📄 معاينة الشيك
            </button>
            <button
              onClick={shareCheque}
              className="bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              📤 مشاركة
            </button>
          </div>

          <div className="overflow-auto border rounded max-w-full">
            <div
              id={`cheque-${cheque.id}`}
              style={{
                width: "790px",
                height: "412px",
                backgroundImage: 'url("/cheque-template.png")',
                backgroundSize: "cover",
                position: "relative",
                direction: "rtl",
                fontFamily: "Tajawal, sans-serif",
              }}
            >
              <div style={{ position: "absolute", top: "25px", left: "600px" }}>
                CHQ #: {cheque.id}
              </div>
              <div style={{ position: "absolute", top: "85px", left: "70px", direction: "ltr" }}>
                {cheque.cheque_date.split("-").reverse().join("/")}
              </div>
              <div style={{ position: "absolute", top: "140px", left: "310px" }}>
                {cheque.receiver}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "180px",
                  right: "300px",
                  fontSize: "16px",
                  width: "600px",
                  textAlign: "right",
                }}
              >
                فقط ({numberToArabicWords(cheque.amount)})
              </div>
              <div style={{ position: "absolute", top: "215px", right: "300px" }}>
                لا غير
              </div>
              <div style={{ position: "absolute", top: "210px", left: "630px" }}>
                {Math.floor(cheque.amount).toLocaleString()}
              </div>
              <div style={{ position: "absolute", top: "210px", left: "725px" }}>
                {(Math.round((cheque.amount - Math.floor(cheque.amount)) * 100))
                  .toString()
                  .padStart(2, "0")}
              </div>
              <div style={{ position: "absolute", bottom: "20px", left: "80px" }}>
                {cheque.id}
              </div>
              <div style={{ position: "absolute", bottom: "20px", left: "300px" }}>
                {cheque.account_number}
              </div>
              <div style={{ position: "absolute", bottom: "120px", left: "100px" }}>
                {cheque.sender}
              </div>
              <div style={{ position: "absolute", top: "270px", left: "640px" }}>
                <QRCodeCanvas value={JSON.stringify(cheque)} size={70} />
              </div>

              {signatureData && (
                <img
                  src={signatureData}
                  alt="التوقيع"
                  style={{
                    position: "absolute",
                    bottom: "80px",
                    left: "150px",
                    width: "200px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
