// SignChequePage.jsx
import { useParams } from "react-router-dom";
import SignChequeForm from "./SignChequeForm";

export default function SignChequePage() {
  const { id } = useParams();
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Sign Cheque #{id}</h1>
      <SignChequeForm chequeId={id} />
    </div>
  );
}
