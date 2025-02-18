import { useState } from "react";
import { solveNetwork } from "../services/networkService";

export default function NetworkPage() {
  const [formData, setFormData] = useState({ graph: "", start_node: "" });
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = {
        graph: JSON.parse(formData.graph),
        start_node: parseInt(formData.start_node),
      };

      const result = await solveNetwork(parsedData);
      setSolution(result);
      setError(null);
    } catch (err) {
      setError("Formato inválido. Asegúrate de usar corchetes [] correctamente.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Optimización en Redes</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mt-2">Matriz del Grafo (graph):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.graph}
          onChange={(e) => setFormData({ ...formData, graph: e.target.value })}
          placeholder='Ej: [[0, 10, 20], [10, 0, 5], [20, 5, 0]]' required
        />

        <label className="block mt-2">Nodo de Inicio:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={formData.start_node}
          onChange={(e) => setFormData({ ...formData, start_node: e.target.value })}
          placeholder="Ej: 0" required
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
