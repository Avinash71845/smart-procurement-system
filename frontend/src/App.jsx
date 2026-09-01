import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/commonpages/Home";
import FarmerHome from "./pages/Farmer/farmerhome";
import OperatorHome from "./pages/Procurement_Operator/operatorhome";
import OperatorLogin from "./pages/Procurement_Operator/operatorlogin";
import Login from "./pages/commonpages/login"
import Dashboard from "./pages/Farmer/Dashboard";
import SlotBooking from "./pages/Farmer/SlotBooking";
import QueueStatus from "./pages/Farmer/QueueStatus";
import Registration from "./pages/commonpages/registration"
import Registrationsucess from "./pages/Farmer/registrationsucess"
import Landingpage from "./pages/Farmer/landingpage";
import FarmerDash from "./pages/Farmer/Dashboard"
import OperatorDashboard from "./pages/Procurement_Operator/dashboard";
import OperatorRegistration from "./pages/Procurement_Operator/operatorregistration";
import FarmerNotifications from "./pages/Farmer/notification";
import PaymentStatus from "./pages/Farmer/paymentstatus";
import SlotApprove from "./pages/Procurement_Operator/slotapprove";
import QueueManage from "./pages/Procurement_Operator/queuemanage";
import WeighingQualityBroadcast from "./pages/Procurement_Operator/weighing";
import PaymentPushDbtSync from "./pages/Procurement_Operator/paymentstatusupdate";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/home" element={<Home />} />
        <Route path="/farmerhome" element={<FarmerHome />} />
        <Route path="/operatorhome" element={<OperatorHome />} />
         <Route path="/operatorLogin" element={<OperatorLogin />} />
        <Route path="/operatorregistration" element={<OperatorRegistration />} />
       <Route path="/track-live-queue" element={<QueueStatus/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registration/>} />
         <Route path="/landingpage" element={<Landingpage />} />
        <Route path="/farmerdashboard" element={<FarmerDash/>} />
        <Route path="/operatordashboard" element={<OperatorDashboard />} />
         <Route path="/registrationsucess" element={<Registrationsucess />} />
          <Route path="/farmer-notification" element={<FarmerNotifications />} />
          <Route path="/payment-status" element={<PaymentStatus/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slot-approve" element={<SlotApprove />} />
        <Route path="/queue-manage" element={<QueueManage />} />
        <Route path="/weighing-details" element={<WeighingQualityBroadcast />} />
        <Route path="/payment-give" element={<PaymentPushDbtSync />} />
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