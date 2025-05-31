import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ أضف useParams هنا
import SignatureCanvas from "react-signature-canvas";

export default function SignChequeForm() {
  const { chequeId } = useParams(); // ✅ قراءة معرف الشيك من الرابط
  const sigPad = useRef();
  const navigate = useNavigate();

  const clearSignature = () => {
    sigPad.current.clear();
  };

  const saveSignature = () => {
    if (sigPad.current.isEmpty()) {
      alert("يرجى توقيع الشيك قبل الحفظ.");
      return;
    }

    const signatureData = sigPad.current.getCanvas().toDataURL("image/png");
    localStorage.setItem(`signature-${chequeId}`, signatureData);
    navigate(`/preview/${chequeId}`);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <p className="text-gray-700 mb-2 text-center">✍️ الرجاء توقيع الشيك في المساحة أدناه:</p>

      <SignatureCanvas
  ref={sigPad}
  penColor="black"
  canvasProps={{
    width: 400,
    height: 150,
    className: "border-4 border-dashed border-gray-400 rounded-md w-full", // 🔲 Dashed frame
  }}
/>


      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={clearSignature}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          🧹 مسح
        </button>
        <button
          onClick={saveSignature}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ✅ حفظ التوقيع
        </button>
      </div>
    </div>
  );
}
