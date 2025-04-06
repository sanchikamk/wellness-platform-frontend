import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ClientLanding from "./pages/client/ClientLanding";
import CounselorLanding from "./pages/counselor/CounselorLanding";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { ToastProvider } from "./context/ToastContext";
import { PlatformProvider } from "./context/PlatformContext";
import BookAppointment from "./pages/client/BookAppointment";
import Appointments from "./pages/client/ViewAppointments";
import Layout from "./components/Layout"; 

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <PlatformProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<AuthPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Client Routes */}
                <Route
                  element={
                    <Layout>
                      <RoleBasedRoute allowedRoles={["client"]} />
                    </Layout>
                  }
                >
                  <Route path="/client" element={<ClientLanding />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/appointments/book/:id" element={<BookAppointment />} />
                  {/* Add more client routes here */}
                </Route>

                {/* Counselor Routes */}
                <Route
                  element={
                    <Layout>
                      <RoleBasedRoute allowedRoles={["counselor"]} />
                    </Layout>
                  }
                >
                  <Route path="/counselor" element={<CounselorLanding />} />
                  {/* Add more counselor routes here */}
                </Route>
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </PlatformProvider>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
