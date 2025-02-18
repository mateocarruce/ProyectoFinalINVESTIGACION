import { useState } from "react";
import { solveTransport } from "../services/transportService";

export default function TransportPage() {
  const [formData, setFormData] = useState({ supply: "", demand: "" });
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = {
        supply: JSON.parse(formData.supply),
        demand: JSON.parse(formData.demand),
      };

      const result = await solveTransport(parsedData);
      setSolution(result);
      setError(null);
    } catch (err) {
      setError("Formato inválido. Asegúrate de usar corchetes [] correctamente.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Problema de Transporte</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mt-2">Suministro (supply):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.supply}
          onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
          placeholder='Ej: [20, 30, 25]' required
        />

        <label className="block mt-2">Demanda (demand):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.demand}
          onChange={(e) => setFormData({ ...formData, demand: e.target.value })}
          placeholder='Ej: [10, 10, 15, 20]' required
        />

        <button type="submit" className="bg-green-600 text-white p-2 mt-4">
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
