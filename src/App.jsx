import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateChequePage from "./CreateChequePage";
import SignChequeForm from "./SignChequeForm";
import PreviewChequePage from "./PreviewChequePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateChequePage />} />
        <Route path="/sign/:chequeId" element={<SignChequeForm />} />
        <Route path="/preview/:chequeId" element={<PreviewChequePage />} />
      </Routes>
    </Router>
  );
}
