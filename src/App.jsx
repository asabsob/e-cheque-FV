import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateChequePage from "./CreateChequePage";
import SignChequePage from "./SignChequePage"; // make sure this file exists
import IssueChequeForm from './IssueChequeForm'; // ✅ المسار الصحيح

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateChequePage />} />
        <Route path="/sign/:id" element={<SignChequePage />} />
      </Routes>
    </Router>
  );
}
