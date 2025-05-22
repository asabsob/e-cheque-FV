import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

// Arabic number-to-words with fils
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
  if (fils > 0) result += " و " + toWords(fils) + " قرشاً";
  return result;
};

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-800",
  Signed: "bg-blue-200 text-blue-800",
  Presented: "bg-green-200 text-green-800",
  Revoked: "bg-red-200 text-red-800",
  Outdated: "bg-gray-300 text-gray-700",
};

export default function App() {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");

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

  const filteredCheques =
    filter === "All" ? cheques : cheques.filter((c) => c.status === filter);

  const downloadCheque = (chequeId) => {
    const node = document.getElementById(`cheque-${chequeId}`);
    html2canvas(node).then((canvas) => {
      const link = document.createElement("a");
      link.download = `cheque-${chequeId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen space-y-6">
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Signed", "Presented", "Revoked", "Outdated"].map((f) => (
          <button
            key={f}
            className={`px-3 py-1 rounded ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">❌ Failed to load cheques.</p>
      ) : filteredCheques.length === 0 ? (
        <p className="text-center">No cheques found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-1">
          {filteredCheques.map((cheque) => {
            const status =
              new Date(cheque.expiry_date) < new Date() && cheque.status !== "Revoked"
                ? "Outdated"
                : cheque.status;

            const statusClass = statusColors[status] || "";

            const jd = Math.floor(cheque.amount);
            const fils = Math.round((cheque.amount - jd) * 100);

            return (
              <div
                key={cheque.id}
                id={`cheque-${cheque.id}`}
                className="relative shadow-md border mx-auto"
                style={{
                  width: "790px",
                  height: "412px",
                  backgroundImage: 'url("/cheque-template.png")',
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  fontFamily: "monospace",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => downloadCheque(cheque.id)}
                  className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Download
                </button>

                <div className="absolute top-[25px] left-[600px] text-[14px] font-bold">
                  CHQ #: {cheque.id}
                </div>

                <div className="absolute top-[85px] left-[70px] text-[16px] font-bold">
                  {cheque.cheque_date}
                </div>

                <div className="absolute top-[140px] left-[310px] text-[18px] font-bold">
                  {cheque.receiver}
                </div>

                <div className="absolute top-[180px] right-[70px] w-[600px] text-[16px] font-bold italic text-right direction-rtl">
                  فقط {cheque.amount} ({numberToArabicWords(cheque.amount)})
                </div>
                <div className="absolute top-[205px] right-[70px] w-[600px] text-[16px] font-bold italic text-right direction-rtl">
                  لا غير
                </div>

                <div className="absolute top-[210px] left-[630px] text-[18px] font-bold">
                  {jd}
                </div>
                <div className="absolute top-[210px] left-[705px] text-[18px] font-bold">
                  {fils.toString().padStart(2, "0")}
                </div>

                <div className="absolute top-[330px] left-[180px] text-[14px] font-bold">
                  {cheque.sender}
                </div>

                <div className="absolute bottom-[20px] left-[80px] text-[18px] font-bold">
                  {cheque.id}
                </div>
                <div className="absolute bottom-[20px] left-[300px] text-[18px] font-bold">
                  {cheque.account_number}
                </div>

                <div className="absolute top-[270px] left-[640px]">
                  <QRCodeCanvas value={JSON.stringify(cheque)} size={70} />
                </div>

                <div className={`absolute top-[15px] left-[30px] px-2 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
