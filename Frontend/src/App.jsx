import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/commonpages/Home";
import Login from "./pages/Farmer/Login";
import Dashboard from "./pages/Farmer/Dashboard";
import SlotBooking from "./pages/Farmer/SlotBooking";
import QueueStatus from "./pages/Farmer/QueueStatus";
import Registration from "./pages/Farmer/registration"
import Registrationsucess from "./pages/Farmer/registrationsucess"
import Landingpage from "./pages/Farmer/landingpage";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
         <Route path="/landingpage" element={<Landingpage />} />
        <Route path="/register" element={<Registration />} />
         <Route path="/registrationsucess" element={<Registrationsucess />} />
       

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/slot-booking"
          element={<SlotBooking />}
        />

        <Route
          path="/queue"
          element={<QueueStatus />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;