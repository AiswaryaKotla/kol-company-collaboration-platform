import CreateCampaign from "../pages/company/CreateCampaign";
import SocialAccounts from "../pages/kol/SocialAccounts";
import Register from "../pages/auth/Register";
import Messages from "../pages/common/Messages";
import CompanyWallet from "../pages/company/CompanyWallet";
import KolWallet from "../pages/kol/KolWallet";
import KolDashboard from "../pages/kol/KolDashboard";
import KolProfile from "../pages/kol/KolProfile";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import BrowseKols from "../pages/company/BrowseKols";
import CampaignManagement from "../pages/company/CampaignManagement";
import Negotiation from "../pages/common/Negotiation";
import ChatPage from "../pages/chat/ChatPage";
import Collaborations from "../pages/kol/Collaborations";
import NotFound from "../pages/NotFound";



/*  ADMIN PAGES */
import VerifySocialAccounts from "../pages/admin/VerifySocialAccounts";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>

      {/* 🌍 Public Routes */}
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/messages" element={<ChatPage />} />
      <Route path="*" element={<NotFound />} />



      {/*  KOL Routes */}
      <Route
        path="/kol"
        element={
          <ProtectedRoute role="kol">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<KolDashboard />} />
        <Route path="wallet" element={<KolWallet />} />
        <Route path="messages" element={<Messages />} />
        <Route path="social-accounts" element={<SocialAccounts />} />
        <Route path="profile" element={<KolProfile />} />
        <Route path="collaborations" element={<Collaborations />} />
        <Route path="negotiation" element={<Negotiation />} />
      </Route>



      {/*  ADMIN Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />

        {/*  NEW PAGE */}
        <Route
          path="verify-social"
          element={<VerifySocialAccounts />}
        />
      </Route>



      {/*  Company Routes */}
      <Route
        path="/company"
        element={
          <ProtectedRoute role="company">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="wallet" element={<CompanyWallet />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="create-campaign" element={<CreateCampaign />} />
        <Route path="kols" element={<BrowseKols />} />
        <Route path="campaigns" element={<CampaignManagement />} />
        <Route path="negotiation" element={<Negotiation />} />
      </Route>



      {/* 404 */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}

export default AppRoutes;