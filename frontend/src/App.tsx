import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/layout/auth/login";
import Signup from "./components/layout/auth/signup";

function App() {
  return (
    <div className="m-auto">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
