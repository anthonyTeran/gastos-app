import { useEffect, useState } from "react";
import axios from "axios";

function Categorias() {

  const API = "https://gastos-backend-j5au.onrender.com";

  const token = localStorage.getItem("token");

  const [categorias, setCategorias] = useState([]);

  const [pagina, setPagina] = useState(1);

  const [totalPaginas, setTotalPaginas] = useState(1);

  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "gasto"
  });

  const cargarCategorias = async () => {

    try {

      const res = await axios.get(
        `${API}/categorias?page=${pagina}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCategorias(res.data.items);

      setTotalPaginas(
        Math.ceil(res.data.total / 5)
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [pagina]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarCategoria = async (e) => {

    e.preventDefault();

    try {

      if (editando) {

        await axios.put(
          `${API}/categorias/${editando}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      } else {

        await axios.post(
          `${API}/categorias`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      setForm({
        nombre: "",
        tipo: "gasto"
      });

      setEditando(null);

      cargarCategorias();

    } catch (error) {
      console.error(error);
    }
  };

  const editarCategoria = (cat) => {

    setEditando(cat.id);

    setForm({
      nombre: cat.nombre,
      tipo: cat.tipo
    });
  };

  const eliminarCategoria = async (id) => {

    if (!confirm("¿Eliminar categoría?")) {
      return;
    }

    try {

      await axios.delete(
        `${API}/categorias/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarCategorias();

    } catch (error) {
      console.error(error);
    }
  };

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold mb-6">
        Categorías
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">

        <form
          onSubmit={guardarCategoria}
          className="flex gap-4"
        >

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border p-3 rounded-lg flex-1"
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="gasto">
              Gasto
            </option>

            <option value="ingreso">
              Ingreso
            </option>
          </select>

          <button
            type="submit"
            className="bg-black text-white px-5 rounded-lg"
          >
            {editando ? "Guardar" : "Agregar"}
          </button>

        </form>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Nombre
              </th>

              <th className="p-4 text-left">
                Tipo
              </th>

              <th className="p-4 text-left">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {categorias.map((cat) => (

              <tr
                key={cat.id}
                className="border-t"
              >

                <td className="p-4">
                  {cat.nombre}
                </td>

                <td className="p-4">
                  {cat.tipo}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() => editarCategoria(cat)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCategoria(cat.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="flex justify-between p-6">

          <button
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina === 1}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Anterior
          </button>

          <span>
            Página {pagina} de {totalPaginas || 1}
          </span>

          <button
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Siguiente
          </button>

        </div>

      </div>

    </div>
  );
}

export default Categorias;