import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/commonpages/Home";
import FarmerHome from "./pages/Farmer/farmerhome";
import OperatorHome from "./pages/Procurement_Operator/operatorhome";
import OperatorLogin from "./pages/Procurement_Operator/operatorlogin";
import Login from "./pages/commonpages/login";
import Dashboard from "./pages/Farmer/Dashboard";
import SlotBooking from "./pages/Farmer/SlotBooking";
import QueueStatus from "./pages/Farmer/QueueStatus";
import Registration from "./pages/commonpages/registration";
import Registrationsucess from "./pages/Farmer/registrationsucess";
import Landingpage from "./pages/Farmer/landingpage";
import FarmerDash from "./pages/Farmer/Dashboard";
import OperatorDashboard from "./pages/Procurement_Operator/dashboard";
import OperatorRegistration from "./pages/Procurement_Operator/operatorregistration";
import FarmerNotifications from "./pages/Farmer/notification";
import PaymentStatus from "./pages/Farmer/paymentstatus";
import SlotApprove from "./pages/Procurement_Operator/slotapprove";
import QueueManage from "./pages/Procurement_Operator/queuemanage";
import WeighingQualityBroadcast from "./pages/Procurement_Operator/weighing";
import PaymentPushDbtSync from "./pages/Procurement_Operator/paymentstatusupdate";
import FarmerUpdateProfile from "./pages/commonpages/farmerupdateprofile";
import OperatorUpdateProfile from "./pages/commonpages/operatorupdateprofile";
import OperatorHeaderWithSlotModal from "./pages/Procurement_Operator/createslot";
import RequireOperator from "./components/RequireOperator";
import Chatbot from "./pages/commonpages/Chatbot"
function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Container: renders alerts for all child pages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route path="/farmerhome" element={<FarmerHome />} />
        <Route path="/operatorLogin" element={<OperatorLogin />} />
        <Route path="/operator-login" element={<OperatorLogin />} />
        <Route
          path="/operatorregistration"
          element={<OperatorRegistration />}
        />
        <Route path="/track-live-queue" element={<QueueStatus />} />
        <Route path="/live-queue" element={<QueueStatus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/landingpage" element={<Landingpage />} />
        <Route path="/farmerdashboard" element={<FarmerDash />} />
        <Route element={<RequireOperator />}>
          <Route path="/operatorhome" element={<OperatorHome />} />
          <Route path="/operatordashboard" element={<OperatorDashboard />} />
          <Route path="/slot-approve" element={<SlotApprove />} />
          <Route path="/queue-manage" element={<QueueManage />} />
          <Route
            path="/weighing-details"
            element={<WeighingQualityBroadcast />}
          />
          <Route path="/payment-give" element={<PaymentPushDbtSync />} />
          <Route
            path="/operator-update-profile"
            element={<OperatorUpdateProfile />}
          />
          <Route
            path="/operator/create-slot"
            element={<OperatorHeaderWithSlotModal />}
          />
        </Route>
        <Route path="/registrationsucess" element={<Registrationsucess />} />
        <Route path="/farmer-notification" element={<FarmerNotifications />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slot-booking" element={<SlotBooking />} />
        <Route path="/queue" element={<QueueStatus />} />
        <Route
          path="/farmer-update-profile"
          element={<FarmerUpdateProfile />}
        />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
