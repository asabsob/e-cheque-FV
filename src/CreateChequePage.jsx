// CreateChequePage.jsx
import React, { useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

// Arabic number-to-words conversion
const numberToArabicWords = (amount) => {
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

  const segmentToWords = (num) => {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    let words = [];

    if (h > 0) words.push(hundreds[h]);

    if (rem > 0) {
      if (rem < 10) words.push(ones[rem]);
      else if (rem < 20) words.push(teens[rem - 10]);
      else {
        const t = Math.floor(rem / 10);
        const u = rem % 10;
        if (u > 0) words.push(ones[u] + " و " + tens[t]);
        else words.push(tens[t]);
      }
    }
    return words.join(" و ");
  };

  const getUnitName = (n, singular, dual, plural) => {
    if (n === 0) return "";
    if (n === 1) return singular;
    if (n === 2) return dual;
    if (n >= 3 && n <= 10) return plural;
    return plural;
  };

  const jd = Math.floor(amount);
  const fils = Math.round((amount - jd) * 100);

  const millions = Math.floor(jd / 1_000_000);
  const thousands = Math.floor((jd % 1_000_000) / 1000);
  const rest = jd % 1000;

  let resultParts = [];

  if (millions > 0) {
    const words = segmentToWords(millions);
    if (words) resultParts.push(words + " " + getUnitName(millions, "مليون", "مليونان", "ملايين"));
  }

  if (thousands > 0) {
    const words = segmentToWords(thousands);
    if (words) resultParts.push(words + " " + getUnitName(thousands, "ألف", "ألفان", "آلاف"));
  }

  if (rest > 0) {
    resultParts.push(segmentToWords(rest));
  }

  let result = resultParts.join(" و ") + " دينار";
  if (fils > 0) {
    result += " و " + segmentToWords(fils) + " قرشاً";
  }
  return result;
};

const formatNumberWithCommas = (num) => num.toLocaleString("en-US");

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

export default function CreateChequePage() {
  const [cheque, setCheque] = useState(null);
  const navigate = useNavigate();

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
          <div className="flex space-x-4 mb-4">
            <button onClick={downloadCheque} className="bg-green-600 text-white px-4 py-2 rounded">
              Download Cheque
            </button>
            <button onClick={() => navigate(`/sign/${cheque.id}`)} className="bg-yellow-500 text-white px-4 py-2 rounded">
              Sign This Cheque
            </button>
          </div>

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
            <div style={{ position: "absolute", top: "25px", left: "600px", fontWeight: "bold", fontSize: "16px" }}>
              CHQ #: {cheque.id}
            </div>

            <div style={{ position: "absolute", top: "85px", left: "70px", fontWeight: "bold", fontSize: "16px" }}>
              {cheque.cheque_date}
            </div>

            <div style={{ position: "absolute", top: "140px", left: "310px", fontWeight: "bold", fontSize: "18px" }}>
              {cheque.receiver}
            </div>

            <div style={{
              position: "absolute",
              top: "180px",
              right: "295px",
              fontSize: "16px",
              fontWeight: "bold",
              fontStyle: "italic",
              direction: "rtl",
              width: "450px",
              textAlign: "right",
              lineHeight: "33px",
              fontFamily: "Tajawal, 'Amiri', 'Segoe UI', 'Helvetica Neue', sans-serif",
            }}>
              فقط ({numberToArabicWords(cheque.amount)})
            </div>

            <div style={{
              position: "absolute",
              top: "220px",
              right: "690px",
              fontSize: "14px",
              fontWeight: "bold",
              fontStyle: "italic",
              direction: "rtl",
              width: "700px",
              textAlign: "right",
            }}>
              لا غير
            </div>

            <div style={{
              position: "absolute",
              top: "210px",
              left: "580px",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {formatNumberWithCommas(Math.floor(cheque.amount))}
            </div>

            <div style={{
              position: "absolute",
              top: "210px",
              left: "730px",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {(Math.round((cheque.amount - Math.floor(cheque.amount)) * 100)).toString().padStart(2, "0")}
            </div>

            <div style={{ position: "absolute", top: "265px", left: "50px", fontSize: "14px", fontWeight: "bold" }}>
              {cheque.sender}
            </div>

            <div style={{ position: "absolute", top: "350px", left: "180px", fontSize: "14px", fontWeight: "bold" }}>
              {/* Signature */}
            </div>

            <div style={{ position: "absolute", bottom: "20px", left: "80px", fontSize: "18px", fontWeight: "bold" }}>
              {cheque.id}
            </div>

            <div style={{ position: "absolute", bottom: "20px", left: "300px", fontSize: "18px", fontWeight: "bold" }}>
              {cheque.account_number}
            </div>

            <div style={{ position: "absolute", top: "270px", left: "640px" }}>
              <QRCodeCanvas value={JSON.stringify(cheque)} size={70} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
