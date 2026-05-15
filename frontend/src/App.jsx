import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Sidebar from "./components/Sidebar";

function App() {

  const token = localStorage.getItem("token");

  // ===== SIN LOGIN =====

  if (!token) {
    return <Dashboard />;
  }

  // ===== CON LOGIN =====

  return (

    <BrowserRouter>

      <div className="flex">

        <Sidebar />

        <div className="flex-1">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/categorias"
              element={<Categorias />}
            />

            <Route
              path="*"
              element={<Navigate to="/" />}
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;