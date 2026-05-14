import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  // ===== LOGIN =====

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // ===== APP =====

  const [saldo, setSaldo] = useState(0);

  const [movimientos, setMovimientos] = useState([]);

  const [pagina, setPagina] = useState(1);

  const movimientosPorPagina = 5;

  const [form, setForm] = useState({
    descripcion: "",
    monto: "",
    tipo: "gasto",
    categoria: "",
    fecha: ""
  });

  const [totalPaginas, setTotalPaginas] = useState(1);

  const [fechaDesde, setFechaDesde] = useState("");

  const [fechaHasta, setFechaHasta] = useState("");

  const [ingresosPeriodo, setIngresosPeriodo] = useState(0);

  const [gastosPeriodo, setGastosPeriodo] = useState(0);

  const [saldoPeriodo, setSaldoPeriodo] = useState(0);

  // ===== CARGAR DATOS =====

  const cargarDatos = async () => {

    try {

      const saldoRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/saldo/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSaldo(saldoRes.data.saldo);

      const movRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/movimientos?page=${pagina}&limit=5&fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMovimientos(movRes.data.items);

      setTotalPaginas(
        Math.ceil(
          movRes.data.total / 5
        )
      );

      setIngresosPeriodo(
        movRes.data.ingresos
      );

      setGastosPeriodo(
        movRes.data.gastos
      );

      setSaldoPeriodo(
        movRes.data.saldo
      );

      setTotalPaginas(
        Math.ceil(
          movRes.data.total / 5
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    if (token) {
      cargarDatos();
    }

  }, [token, pagina, fechaDesde, fechaHasta]);

  // ===== LOGIN =====

  const handleLoginChange = (e) => {

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        loginData
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      setToken(response.data.access_token);

    } catch (error) {

      alert("Login incorrecto");

      console.error(error);
    }
  };

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);
  };

  // ===== MOVIMIENTOS =====

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const agregarMovimiento = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/movimientos`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setForm({
        descripcion: "",
        monto: "",
        tipo: "gasto",
        categoria: "",
        fecha: ""
      });

      cargarDatos();

    } catch (error) {
      console.error(error);
    }
  };

  // ===== LOGIN SCREEN =====

  if (!token) {

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold mb-2">
              Control de Gastos
            </h1>

            <p className="text-gray-500">
              Ingresá a tu cuenta
            </p>

          </div>

          <form
            onSubmit={login}
            className="flex flex-col gap-4"
          >

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="border p-4 rounded-xl"
            />

            <button
              type="submit"
              className="bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition"
            >
              Ingresar
            </button>

          </form>

        </div>

      </div>
    );
  }

  // ===== DASHBOARD =====

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-4xl font-bold">
              Control de Gastos
            </h1>

            <p className="text-gray-500">
              Dashboard financiero
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

        {/* CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-2xl shadow p-5">

            <p className="text-gray-500">
              Saldo Total
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ${saldo}
            </h2>

          </div>

          <div className="bg-green-100 rounded-2xl shadow p-5">

            <p className="text-green-700">
              Ingresos
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ${ingresosPeriodo}
            </h2>

          </div>

          <div className="bg-red-100 rounded-2xl shadow p-5">

            <p className="text-red-700">
              Gastos
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ${gastosPeriodo}
            </h2>

          </div>

          <div className="bg-blue-100 rounded-2xl shadow p-5">

            <p className="text-blue-700">
              Saldo Período
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ${saldoPeriodo}
            </h2>

          </div>

        </div>

        {/* FORM */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Nuevo Movimiento
          </h2>

          <form
            onSubmit={agregarMovimiento}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="monto"
              placeholder="Monto"
              value={form.monto}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>

            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={form.categoria}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="bg-black text-white rounded-lg p-3 hover:bg-gray-800"
            >
              Agregar Movimiento
            </button>

          </form>

        </div>

        {/* FILTROS */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Filtros
          </h2>

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="date"
              value={fechaDesde}
              onChange={(e) =>
                setFechaDesde(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              value={fechaHasta}
              onChange={(e) =>
                setFechaHasta(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

          </div>

        </div>

        {/* TABLA */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Movimientos
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Descripción
                </th>

                <th className="p-4 text-left">
                  Monto
                </th>

                <th className="p-4 text-left">
                  Tipo
                </th>

                <th className="p-4 text-left">
                  Categoría
                </th>

                <th className="p-4 text-left">
                  Fecha
                </th>

              </tr>

            </thead>

            <tbody>

              {movimientos.map((mov) => (

                <tr
                  key={mov.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {mov.descripcion}
                  </td>

                  <td className="p-4">
                    ${mov.monto}
                  </td>

                  <td className="p-4">

                    <span className={
                      mov.tipo === "ingreso"
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }>
                      {mov.tipo}
                    </span>

                  </td>

                  <td className="p-4">
                    {mov.categoria}
                  </td>

                  <td className="p-4">
                    {mov.fecha}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* PAGINACION */}

          <div className="flex justify-between items-center p-6">

            <button
              onClick={() =>
                setPagina(pagina - 1)
              }
              disabled={pagina === 1}
              className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="font-bold">
              Página {pagina} de {totalPaginas || 1}
            </span>

            <button
              onClick={() =>
                setPagina(pagina + 1)
              }
              disabled={pagina === totalPaginas}
              className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;