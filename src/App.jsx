// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateChequePage from "./CreateChequePage";
import SignChequePage from "./SignChequePage";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

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
