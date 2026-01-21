import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/layout/auth/login";
import Signup from "./components/layout/auth/signup";
import Dashboard from "./components/layout/dashboard/dashboard";
import HomePage from "./components/layout/library/home-page";
import SearchPage from "./components/layout/library/search-books";
import PrivateRoute from "./routing/private-route";
import { BookDetailPage } from "./components/layout/library/book";

function App() {
  return (
    <div className="m-auto">
      <Routes>
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/library/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
