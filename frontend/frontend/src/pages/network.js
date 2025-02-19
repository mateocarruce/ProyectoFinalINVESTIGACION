import { useState } from "react";
import { solveNetwork } from "../services/networkService";

export default function NetworkPage() {
  const [graph, setGraph] = useState([]);
  const [solution, setSolution] = useState(null);
  const [edgeData, setEdgeData] = useState({ from: "", to: "", weight: "" });

  const addEdge = () => {
    if (!edgeData.from || !edgeData.to || !edgeData.weight) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    setGraph((prevGraph) => [...prevGraph, [edgeData.from, edgeData.to, parseInt(edgeData.weight)]]);
    setEdgeData({ from: "", to: "", weight: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos al backend:", graph); // ✅ Depuración
    const data = { graph };

    const result = await solveNetwork(data);
    setSolution(result);
  };


  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Optimización en Redes</h1>

      {/* Entrada de Nodos y Aristas */}
      <div className="bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">➕ Agregar Arista</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Nodo origen"
            className="border p-2 rounded w-1/3"
            value={edgeData.from}
            onChange={(e) => setEdgeData({ ...edgeData, from: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nodo destino"
            className="border p-2 rounded w-1/3"
            value={edgeData.to}
            onChange={(e) => setEdgeData({ ...edgeData, to: e.target.value })}
          />
          <input
            type="number"
            placeholder="Peso"
            className="border p-2 rounded w-1/3"
            value={edgeData.weight}
            onChange={(e) => setEdgeData({ ...edgeData, weight: e.target.value })}
          />
        </div>
        <button className="bg-blue-600 text-white p-2 rounded w-full mt-2" onClick={addEdge}>
          ➕ Agregar Arista
        </button>
      </div>

      {/* Lista de aristas ingresadas */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">📌 Aristas Ingresadas</h2>
        <ul className="bg-gray-200 p-2 rounded mt-2">
          {graph.map(([u, v, w], index) => (
            <li key={index} className="text-gray-700">
              🔹 {u} → {v} | Peso: {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Botón Resolver */}
      <button onClick={handleSubmit} className="bg-green-600 text-white p-2 rounded w-full mt-4">
        🚀 Resolver
      </button>

      {/* Resultados */}
      {solution && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-xl font-bold text-green-700">✅ Solución</h2>
          {solution.shortest_path && (
            <div>
              <h3 className="font-semibold">🔹 Ruta más corta</h3>
              <p>🔹 Peso total: {solution.shortest_path.total_weight}</p>
              <p>🔹 Camino: {solution.shortest_path.node_order.join(" → ")}</p>
              <p>🔹 Inicio: {solution.shortest_path.start_node}</p>
              <p>🔹 Fin: {solution.shortest_path.end_node}</p>
              <img src={`data:image/png;base64,${solution.shortest_path.graph_image}`} alt="Ruta más corta" />
            </div>
          )}

          {solution.longest_path && (
            <div>
              <h3 className="font-semibold">🔹 Ruta más larga</h3>
              <p>🔹 Peso total: {solution.longest_path.total_weight}</p>
              <p>🔹 Camino: {solution.longest_path.node_order.join(" → ")}</p>
              <p>🔹 Inicio: {solution.longest_path.start_node}</p>
              <p>🔹 Fin: {solution.longest_path.end_node}</p>
              <img src={`data:image/png;base64,${solution.longest_path.graph_image}`} alt="Ruta más larga" />
            </div>
          )}

          {solution.mst && (
            <div>
              <h3 className="font-semibold">🔹 Árbol de Expansión Mínima</h3>
              <p>🔹 Peso total: {solution.mst.total_weight}</p>
              <img src={`data:image/png;base64,${solution.mst.graph_image}`} alt="Árbol de Expansión Mínima" />
            </div>
          )}

          {solution.max_flow && (
            <div>
              <h3 className="font-semibold">🔹 Flujo Máximo</h3>
              <p>🔹 Flujo total: {solution.max_flow.max_flow}</p>
              <p>🔹 Nodo de inicio: {solution.max_flow.start_node}</p>
              <p>🔹 Nodo final: {solution.max_flow.end_node}</p>
              <img src={`data:image/png;base64,${solution.max_flow.graph_image}`} alt="Flujo Máximo" />
            </div>
          )}

          {solution.min_cost_flow && (
            <div>
              <h3 className="font-semibold">🔹 Flujo de Costo Mínimo</h3>
              <img
                src={`data:image/png;base64,${solution.min_cost_flow.graph_image}`}
                alt="Flujo de Costo Mínimo"
                className="mt-2 rounded"
              />
              <p className="text-gray-700 mt-2">🔹 <strong>Costo total:</strong> {solution.min_cost_flow.total_cost}</p>
              <h4 className="font-semibold mt-2">Detalles del Flujo</h4>
              <pre className="bg-gray-200 p-2 rounded">{JSON.stringify(solution.min_cost_flow.flow_distribution, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}