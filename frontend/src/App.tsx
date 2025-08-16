import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/layout/auth/login";
import Signup from "./components/layout/auth/signup";
import Dashboard from "./components/layout/dashboard/dashboard";
import HomePage from "./components/layout/library/home-page";
import SearchPage from "./components/layout/library/search-books";

function App() {
  return (
    <div className="m-auto">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library/search" element={<SearchPage />} />
        <Route path="/library/landing" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
