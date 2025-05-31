import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import numberToArabicWords from "./utils/numberToArabicWords";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PreviewChequePage() {
  const { chequeId } = useParams();
  const navigate = useNavigate();

  const chequeData = JSON.parse(localStorage.getItem(`cheque-${chequeId}`));
  const signatureData = localStorage.getItem(`signature-${chequeId}`);

  const formatDateLTR = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleEmail = () => {
    const chequeURL = window.location.href;
    const subject = `شيك إلكتروني رقم ${chequeId}`;
    const body = `💳 شيك بقيمة ${chequeData.amount} دينار لـ ${chequeData.receiver}.\nرابط الشيك: ${chequeURL}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleSMS = () => {
    const chequeURL = window.location.href;
    const message = `💳 شيك بقيمة ${chequeData.amount} دينار لـ ${chequeData.receiver}. رابط: ${chequeURL}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const handlePrint = () => {
    const printContents = document.getElementById(`cheque-${chequeId}`).outerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>طباعة الشيك</title>
      <style>body { direction: rtl; font-family: Tajawal, sans-serif; }</style>
      </head><body>${printContents}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleDownloadPDF = () => {
    const chequeElement = document.getElementById(`cheque-${chequeId}`);
    html2canvas(chequeElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "px", [790, 412]);
      pdf.addImage(imgData, "PNG", 0, 0, 790, 412);
      pdf.save(`cheque-${chequeId}.pdf`);
    });
  };

  if (!chequeData) {
    return <p className="text-center mt-10">❌ لا يوجد بيانات لهذا الشيك.</p>;
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-100 font-sans">
      <h2 className="text-xl font-bold text-center mb-6">📄 معاينة الشيك #{chequeId}</h2>

      {/* ✅ أزرار المشاركة والطباعة */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button onClick={handleEmail} className="bg-indigo-600 text-white px-4 py-2 rounded">📧 إرسال بالبريد</button>
        <button onClick={handleSMS} className="bg-green-600 text-white px-4 py-2 rounded">📱 إرسال SMS</button>
        <button onClick={handlePrint} className="bg-gray-700 text-white px-4 py-2 rounded">🖨️ طباعة</button>
        <button onClick={handleDownloadPDF} className="bg-purple-700 text-white px-4 py-2 rounded">📥 تحميل PDF</button>
        <button onClick={() => navigate(`/sign/${chequeId}`)} className="bg-yellow-600 text-white px-4 py-2 rounded">✍️ توقيع الشيك</button>
      </div>

      {/* ✅ معاينة الشيك */}
      <div
        id={`cheque-${chequeId}`}
        style={{
          width: "790px",
          height: "412px",
          backgroundImage: 'url("/cheque-template.png")',
          backgroundSize: "cover",
          position: "relative",
          direction: "rtl",
          fontFamily: "Tajawal, sans-serif",
          margin: "0 auto",
        }}
      >
        <div style={{ position: "absolute", top: "25px", left: "600px" }}>
          CHQ #: {chequeId}
        </div>

        <div style={{ position: "absolute", top: "85px", left: "70px", direction: "ltr" }}>
          {formatDateLTR(chequeData.cheque_date)}
        </div>

        <div style={{ position: "absolute", bottom: "120px", left: "100px", fontSize: "14px" }}>
           {chequeData.sender}
        </div>

        <div style={{ position: "absolute", top: "140px", left: "310px" }}>
          {chequeData.receiver}
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
          فقط ({numberToArabicWords(chequeData.amount)})
        </div>

        <div style={{ position: "absolute", top: "215px", right: "300px" }}>
          لا غير
        </div>

        <div style={{ position: "absolute", top: "210px", left: "630px" }}>
          {Math.floor(chequeData.amount).toLocaleString()}
        </div>
        <div style={{ position: "absolute", top: "210px", left: "725px" }}>
          {(Math.round((chequeData.amount - Math.floor(chequeData.amount)) * 100))
            .toString()
            .padStart(2, "0")}
        </div>

        <div style={{ position: "absolute", bottom: "20px", left: "80px" }}>
          {chequeId}
        </div>
        <div style={{ position: "absolute", bottom: "20px", left: "300px" }}>
          {chequeData.account_number}
        </div>

        <div style={{ position: "absolute", top: "270px", left: "640px" }}>
          <QRCodeCanvas value={JSON.stringify(chequeData)} size={70} />
        </div>

        {/* التوقيع */}
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
  );
}
