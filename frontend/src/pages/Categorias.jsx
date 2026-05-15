import { useEffect, useState } from "react";
import axios from "axios";

function Categorias() {

  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "gasto"
  });

  const API = "https://gastos-backend-j5au.onrender.com";

  const cargarCategorias = async () => {

    try {

      const res = await axios.get(
        `${API}/categorias`
      );

      setCategorias(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const crearCategoria = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `${API}/categorias`,
        form
      );

      setForm({
        nombre: "",
        tipo: "gasto"
      });

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
          onSubmit={crearCategoria}
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
            Agregar
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

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Categorias;