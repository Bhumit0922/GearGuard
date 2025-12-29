import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import ManagerDashboard from "./pages/manager/Dashboard";
import TechnicianDashboard from "./pages/technician/Dashboard";
import UserDashboard from "./pages/user/Dashboard";

import Equipment from "@/pages/manager/Equipment";
import ProtectedRoute from "@/auth/ProtectedRoute";
import Requests from "@/pages/manager/Requests";
import RequestDetails from "@/pages/manager/RequestDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<AppLayout />}>
          {/* Manager */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/equipment"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Equipment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/requests"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Requests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/requests/:id"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <RequestDetails />
              </ProtectedRoute>
            }
          />

          {/* Technician */}
          <Route
            path="/technician/dashboard"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TechnicianDashboard />
              </ProtectedRoute>
            }
          />

          {/* User */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}


        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
