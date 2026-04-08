import { Routes, Route } from "react-router-dom";
import Signup from "./pages/SignUp/Signup";
import Login from "./pages/Login/Login";
import Departments from "./pages/Departments/Departments";
import Assets from "./pages/Assets/Assets";
import ProtectedRoute from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/departments"
          element={
            <ProtectedRoute  allowedRoles={["admin", "staff"]}>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute  allowedRoles={["admin", "staff"]}>
              <Assets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
