import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

// Utility to convert numbers to Arabic words (supports JD + fils)
const numberToArabicWords = (amount) => {
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
  const thousands = ["", "ألف", "ألفان", "ثلاثة آلاف", "أربعة آلاف", "خمسة آلاف", "ستة آلاف", "سبعة آلاف", "ثمانية آلاف", "تسعة آلاف"];

  const toWords = (num) => {
    num = Math.floor(num);
    if (num === 0) return "";
    let word = "";
    const t = Math.floor(num / 1000);
    const h = Math.floor((num % 1000) / 100);
    const rem = num % 100;

    if (t > 0) word += thousands[t] + " ";
    if (h > 0) word += hundreds[h] + " ";
    if (rem > 0) {
      if (rem < 10) word += ones[rem];
      else if (rem < 20) word += teens[rem - 10];
      else word += ones[rem % 10] + " و" + tens[Math.floor(rem / 10)];
    }

    return word.trim();
  };

  const jd = Math.floor(amount);
  const fils = Math.round((amount - jd) * 100);

  let result = toWords(jd) + " دينار";
  if (fils > 0) {
    result += " و " + toWords(fils) + " قرشاً";
  }
  return result;
};

function IssueChequeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    sender: "",
    receiver: "",
    amount: "",
    cheque_date: "",
    account_number: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const chequeData = {
      ...formData,
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      amount: parseFloat(formData.amount),
    };
    onSuccess(chequeData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-4 rounded shadow max-w-md">
      <input name="sender" onChange={handleChange} placeholder="Sender" className="border p-2 w-full" required />
      <input name="receiver" onChange={handleChange} placeholder="Receiver" className="border p-2 w-full" required />
      <input name="amount" type="number" step="0.01" onChange={handleChange} placeholder="Amount" className="border p-2 w-full" required />
      <input name="cheque_date" type="date" onChange={handleChange} className="border p-2 w-full" required />
      <input name="account_number" onChange={handleChange} placeholder="Account Number" className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Issue Cheque</button>
    </form>
  );
}

export default function App() {
  const [cheque, setCheque] = useState(null);

  const downloadCheque = () => {
    const node = document.getElementById(`cheque-${cheque.id}`);
    html2canvas(node).then((canvas) => {
      const link = document.createElement("a");
      link.download = `cheque-${cheque.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 font-sans">
      <IssueChequeForm onSuccess={setCheque} />

      {cheque && (
        <>
          <button onClick={downloadCheque} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
            Download Cheque
          </button>

          <div
            id={`cheque-${cheque.id}`}
            style={{
              width: "790px",
              height: "412px",
              backgroundImage: 'url("/cheque-template.png")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "relative",
              fontFamily: "monospace",
            }}
          >
            {/* CHQ Number */}
            <div style={{ position: "absolute", top: "25px", left: "600px", fontWeight: "bold", fontSize: "16px" }}>
              CHQ #: {cheque.id}
            </div>

            {/* Date */}
            <div style={{ position: "absolute", top: "85px", left: "70px", fontWeight: "bold", fontSize: "16px" }}>
              {cheque.cheque_date}
            </div>

            {/* Receiver */}
            <div style={{ position: "absolute", top: "140px", left: "310px", fontWeight: "bold", fontSize: "18px" }}>
              {cheque.receiver}
            </div>

            {/* Amount in words - Line 1 */}
            <div style={{
              position: "absolute",
              top: "180px",
              right: "300px",
              fontSize: "16px",
              fontWeight: "bold",
              fontStyle: "italic",
              direction: "rtl",
              width: "600px",
              textAlign: "right",
            }}>
              فقط  ({numberToArabicWords(cheque.amount)})
            </div>

            {/* Amount in words - Line 2 */}
            <div style={{
              position: "absolute",
              top: "215px",
              right: "300px",
              fontSize: "14px",
              fontWeight: "bold",
              fontStyle: "italic",
              direction: "rtl",
              width: "600px",
              textAlign: "right",
            }}>
              لا غير
            </div>

            {/* JD */}
            <div style={{
              position: "absolute",
              top: "210px",
              left: "630px",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {Math.floor(cheque.amount)}
            </div>

            {/* Fils */}
            <div style={{
              position: "absolute",
              top: "210px",
              left: "725px",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {(Math.round((cheque.amount - Math.floor(cheque.amount)) * 100)).toString().padStart(2, "0")}
            </div>

            {/* Signature space */}
            <div style={{ position: "absolute", top: "330px", left: "180px", fontSize: "14px", fontWeight: "bold" }}>
              {/* Signature */}
            </div>

            {/* Bottom left: Cheque ID */}
            <div style={{ position: "absolute", bottom: "20px", left: "80px", fontSize: "18px", fontWeight: "bold" }}>
              {cheque.id}
            </div>

            {/* Bottom center: Account number */}
            <div style={{ position: "absolute", bottom: "20px", left: "300px", fontSize: "18px", fontWeight: "bold" }}>
              {cheque.account_number}
            </div>

            {/* QR Code */}
            <div style={{ position: "absolute", top: "270px", left: "640px" }}>
              <QRCodeCanvas value={JSON.stringify(cheque)} size={70} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
