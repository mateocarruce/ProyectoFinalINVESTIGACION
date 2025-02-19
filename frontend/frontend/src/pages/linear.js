import { useState } from "react";
import { solveLinear } from "../services/linearService";

export default function LinearPage() {
  const [formData, setFormData] = useState({ c: "", A_ub: "", b_ub: "" });
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir inputs a arrays JSON válidos
      const parsedData = {
        c: JSON.parse(formData.c),
        A_ub: JSON.parse(formData.A_ub),
        b_ub: JSON.parse(formData.b_ub),
      };

      const result = await solveLinear(parsedData);
      setSolution(result);
      setError(null);
    } catch (err) {
      setError("Formato de entrada inválido. Usa corchetes [] correctamente.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Programación Lineal</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mt-2">Coeficientes de la función objetivo (c):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.c}
          onChange={(e) => setFormData({ ...formData, c: e.target.value })}
          placeholder='Ej: [-5, -4]' required
        />

        <label className="block mt-2">Restricciones (A_ub):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.A_ub}
          onChange={(e) => setFormData({ ...formData, A_ub: e.target.value })}
          placeholder='Ej: [[1, 1], [2, 1]]' required
        />

        <label className="block mt-2">Valores de restricciones (b_ub):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.b_ub}
          onChange={(e) => setFormData({ ...formData, b_ub: e.target.value })}
          placeholder='Ej: [5, 8]' required
        />

        <button type="submit" className="bg-blue-600 text-white p-2 mt-4">
          Resolver
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {solution && (
        <div className="mt-4 p-4 bg-gray-100">
          <h2 className="text-xl font-bold">Solución</h2>
          <pre>{JSON.stringify(solution, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
