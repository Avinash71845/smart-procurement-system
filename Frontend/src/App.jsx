
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import SlotBooking from "./pages/SlotBooking";
import QueueStatus from "./pages/QueueStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slot-booking" element={<SlotBooking />} />
        <Route path="/queue" element={<QueueStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
