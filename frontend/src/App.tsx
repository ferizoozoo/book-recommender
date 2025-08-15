import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/layout/auth/login";
import Signup from "./components/layout/auth/signup";
import Dashboard from "./components/layout/dashboard/dashboard";

function App() {
  return (
    <div className="m-auto">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
