import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { ActivityFeed } from "./components/ActivityFeed";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";

const toastStyle = {
  style: {
    background: "#27272a",
    color: "#f4f4f5",
    border: "1px solid #3f3f46",
    fontSize: "13px",
    borderRadius: "10px",
  },
  success: { iconTheme: { primary: "#34d399", secondary: "#27272a" } },
  error: { iconTheme: { primary: "#f87171", secondary: "#27272a" } },
};

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return (
    <>
      <Toaster position="top-right" toastOptions={toastStyle} />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <ActivityFeed />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/attendance" element={<Attendance />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
