import { BrowserRouter as Router, Routes, Route } from "react-router";
import MainMenu from "./pages/MainMenu/menu";
import NotFound from "./pages/OtherPage/NotFound";
import Maintenance from "./pages/OtherPage/Maintenance";
import FiveZeroZero from "./pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "./pages/OtherPage/FiveZeroThree";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import TwoStepVerification from "./pages/AuthPages/TwoStepVerification";
import Success from "./pages/OtherPage/Success";
import MenuLayout from "./layout/MenuLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import Landing from "./pages/LandingPage/Landing"
import UserManage from "./pages/UserManage/user-manage";
import Logs from "./pages/AuditLogs/Logs";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Pages with MenuLayout - Conditional UserDropdown and User Manage button */}
          <Route element={<MenuLayout />}>
            <Route path="/main-menu" element={<MainMenu />} />
            <Route path="/user-manage" element={<UserManage />} />
            <Route path="/logs" element={<Logs />} />
          </Route>

          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/two-step-verification"
            element={<TwoStepVerification />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/success" element={<Success />} />
          <Route path="/five-zero-zero" element={<FiveZeroZero />} />
          <Route path="/five-zero-three" element={<FiveZeroThree />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </Router>
    </>
  );
}
