import { useState } from "react";
import { solveTransport } from "../services/transportService";

export default function TransportPage() {
  const [numSuppliers, setNumSuppliers] = useState(3);
  const [numDemands, setNumDemands] = useState(4);
  const [supply, setSupply] = useState(new Array(numSuppliers).fill(0));
  const [demand, setDemand] = useState(new Array(numDemands).fill(0));
  const [costs, setCosts] = useState(
    Array.from({ length: numSuppliers }, () => new Array(numDemands).fill(0))
  );
  const [method, setMethod] = useState("northwest");
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 Actualizar número de suministros y reiniciar valores
  const handleNumSuppliersChange = (e) => {
    const newNum = Number(e.target.value);
    setNumSuppliers(newNum);
    setSupply(new Array(newNum).fill(0));
    setCosts(Array.from({ length: newNum }, () => new Array(numDemands).fill(0)));
  };

  // 🔹 Actualizar número de demandas y reiniciar valores
  const handleNumDemandsChange = (e) => {
    const newNum = Number(e.target.value);
    setNumDemands(newNum);
    setDemand(new Array(newNum).fill(0));
    setCosts((prevCosts) =>
      prevCosts.map((row) => new Array(newNum).fill(0))
    );
  };

  // 🔹 Actualizar valores de oferta (supply)
  const handleSupplyChange = (index, value) => {
    const newSupply = [...supply];
    newSupply[index] = Number(value);
    setSupply(newSupply);
  };

  // 🔹 Actualizar valores de demanda (demand)
  const handleDemandChange = (index, value) => {
    const newDemand = [...demand];
    newDemand[index] = Number(value);
    setDemand(newDemand);
  };

  // 🔹 Actualizar valores de costos en la matriz
  const handleCostChange = (i, j, value) => {
    setCosts((prevCosts) => {
      const updatedCosts = prevCosts.map((row) => [...row]);
      updatedCosts[i][j] = Number(value);
      return updatedCosts;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = { supply, demand, costs, method };
      console.log("📡 Enviando datos al backend:", requestData);
      const result = await solveTransport(requestData);
      console.log("📩 Respuesta recibida del backend:", result);
      setSolution(result);
      setError(null);
    } catch (err) {
      console.error("❌ Error en la solicitud:", err);
      setError("Error en la entrada. Asegúrate de llenar todos los campos.");
    }
  };

  // 🔹 Función para mostrar una matriz como tabla
  const renderMatrixTable = (matrix) => (
    <table className="border-collapse border border-gray-500 mt-2">
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-400 p-2 text-center">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🚚 Problema de Transporte</h1>

      {/* Sección de parámetros */}
      <div className="flex gap-4 mb-4">
        <label>
          🚛 Número de Suministros:
          <input
            type="number"
            className="border p-2 ml-2"
            min="1"
            value={numSuppliers}
            onChange={handleNumSuppliersChange}
          />
        </label>
        <label>
          🏢 Número de Demandas:
          <input
            type="number"
            className="border p-2 ml-2"
            min="1"
            value={numDemands}
            onChange={handleNumDemandsChange}
          />
        </label>
      </div>

      {/* Sección para ingresar oferta (Supply) */}
      <h3 className="text-lg font-semibold">📦 Oferta (Supply)</h3>
      <div className="flex gap-2 mt-2">
        {supply.map((value, i) => (
          <input
            key={i}
            type="number"
            className="border p-2 w-16"
            value={value}
            onChange={(e) => handleSupplyChange(i, e.target.value)}
          />
        ))}
      </div>

      {/* Sección para ingresar demanda (Demand) */}
      <h3 className="text-lg font-semibold mt-4">🏭 Demanda (Demand)</h3>
      <div className="flex gap-2 mt-2">
        {demand.map((value, i) => (
          <input
            key={i}
            type="number"
            className="border p-2 w-16"
            value={value}
            onChange={(e) => handleDemandChange(i, e.target.value)}
          />
        ))}
      </div>

      {/* Tabla para ingresar costos */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">💲 Matriz de Costos</h3>
        <table className="border-collapse border border-gray-500 mt-2">
          <tbody>
            {costs.map((row, i) => (
              <tr key={i}>
                {row.map((cost, j) => (
                  <td key={j} className="border border-gray-400 p-2">
                    <input
                      type="number"
                      className="w-16 border p-1"
                      value={cost}
                      onChange={(e) =>
                        handleCostChange(i, j, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Método de selección */}
      <label className="block mt-4">
        📌 Método Inicial:
        <select
          className="border p-2 ml-2"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="northwest">Esquina Noroeste</option>
          <option value="minimum_cost">Costo Mínimo</option>
          <option value="vogel">Aproximación de Vogel</option>
        </select>
      </label>

      {/* Botón para resolver */}
      <button
        className="bg-blue-600 text-white p-2 mt-4 rounded"
        onClick={handleSubmit}
      >
        🚀 Resolver
      </button>

      {/* Sección de resultados */}
      {solution && solution.status === "success" && (
        <div className="mt-4 p-4 bg-gray-100">
          <h2 className="text-xl font-bold text-green-600">
            📊 Costo Total: {solution.total_cost}
          </h2>

          <h3 className="text-lg font-semibold mt-4">🛠 Solución Inicial:</h3>
          {renderMatrixTable(solution.initial_solution)}

          <h3 className="text-lg font-semibold mt-4">🏆 Solución Óptima:</h3>
          {renderMatrixTable(solution.optimal_solution)}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
