import { Routes, Route } from "react-router-dom";
import Signup from "./pages/SignUp/Signup";
import Login from "./pages/Login/Login";
import Departments from "./pages/Departments/Departments";
import Assets from "./pages/Assets/Assets";
import ProtectedRoute from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import Assignments from "./pages/Assignments/Assignments";
import AssetDetail from "./pages/Assets/AssetDetails";
import Maintenance from "./pages/Maintenance/Maintenance";
import AuditLogs from "./pages/AuditLogs/AuditLogs";
import Dashboard from "./pages/Dashboard/Dashboard";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/"
  element={
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route
          path="/departments"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Assets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AssetDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Maintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
