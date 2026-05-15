import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";

function App() {

  return (

    <BrowserRouter>

      <div className="min-h-screen flex">

        {/* SIDEBAR */}

        <div className="w-64 bg-black text-white p-6">

          <h1 className="text-2xl font-bold mb-10">
            Gastos App
          </h1>

          <nav className="flex flex-col gap-4">

            <Link to="/">
              Dashboard
            </Link>

            <Link to="/categorias">
              Categorías
            </Link>

          </nav>

        </div>

        {/* CONTENT */}

        <div className="flex-1 p-6 bg-gray-100">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/categorias"
              element={<Categorias />}
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;