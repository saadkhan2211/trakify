import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;
