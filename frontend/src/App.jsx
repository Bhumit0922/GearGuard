import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import ManagerDashboard from "./pages/manager/Dashboard";
import TechnicianDashboard from "./pages/technician/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import CreateRequest from "@/pages/user/CreateRequest";

import Equipment from "@/pages/manager/Equipment";
import Teams from "@/pages/manager/Teams";
import Requests from "@/pages/manager/Requests";
import PreventiveCalendar from "./pages/manager/PreventiveCalendar";
import RequestDetails from "@/pages/shared/RequestDetails";

import ProtectedRoute from "@/auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ================= PROTECTED APP ================= */}
        <Route element={<AppLayout />}>
          {/* ---------- MANAGER ---------- */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/calendar"
            element={
              <ProtectedRoute allowedRoles={["manager", "technician"]}>
                <PreventiveCalendar />
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

          <Route
            path="/manager/teams"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Teams />
              </ProtectedRoute>
            }
          />

          {/* ---------- TECHNICIAN ---------- */}
          <Route
            path="/technician/dashboard"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TechnicianDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/technician/calendar"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <PreventiveCalendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/technician/requests"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <Requests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/technician/requests/:id"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <RequestDetails />
              </ProtectedRoute>
            }
          />

          {/* ---------- USER ---------- */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/requests"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Requests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/requests/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <RequestDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/user/requests/new"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CreateRequest />
            </ProtectedRoute>
          }
        />


        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
