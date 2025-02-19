import { useState } from "react";
import { solveTransport } from "../services/transportService";
import "bootstrap/dist/css/bootstrap.min.css";  // 📌 Importamos Bootstrap

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

  const handleNumSuppliersChange = (e) => {
    const newNum = Number(e.target.value);
    setNumSuppliers(newNum);
    setSupply(new Array(newNum).fill(0));
    setCosts(Array.from({ length: newNum }, () => new Array(numDemands).fill(0)));
  };

  const handleNumDemandsChange = (e) => {
    const newNum = Number(e.target.value);
    setNumDemands(newNum);
    setDemand(new Array(newNum).fill(0));
    setCosts((prevCosts) =>
      prevCosts.map((row) => new Array(newNum).fill(0))
    );
  };

  const handleSupplyChange = (index, value) => {
    const newSupply = [...supply];
    newSupply[index] = Number(value);
    setSupply(newSupply);
  };

  const handleDemandChange = (index, value) => {
    const newDemand = [...demand];
    newDemand[index] = Number(value);
    setDemand(newDemand);
  };

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

  const renderMatrixTable = (matrix) => (
    <table className="table table-bordered mt-3">
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="text-center">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">🚚 Problema de Transporte</h1>

      <div className="row">
        {/* Número de Suministros */}
        <div className="col-md-6">
          <label className="form-label">🚛 Número de Suministros:</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={numSuppliers}
            onChange={handleNumSuppliersChange}
          />
        </div>

        {/* Número de Demandas */}
        <div className="col-md-6">
          <label className="form-label">🏢 Número de Demandas:</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={numDemands}
            onChange={handleNumDemandsChange}
          />
        </div>
      </div>

      {/* Sección para ingresar oferta (Supply) */}
      <h3 className="mt-4">📦 Oferta (Supply)</h3>
      <div className="input-group">
        {supply.map((value, i) => (
          <input
            key={i}
            type="number"
            className="form-control"
            value={value}
            onChange={(e) => handleSupplyChange(i, e.target.value)}
          />
        ))}
      </div>

      {/* Sección para ingresar demanda (Demand) */}
      <h3 className="mt-4">🏭 Demanda (Demand)</h3>
      <div className="input-group">
        {demand.map((value, i) => (
          <input
            key={i}
            type="number"
            className="form-control"
            value={value}
            onChange={(e) => handleDemandChange(i, e.target.value)}
          />
        ))}
      </div>

      {/* Tabla para ingresar costos */}
      <div className="mt-4">
        <h3>💲 Matriz de Costos</h3>
        <table className="table table-bordered">
          <tbody>
            {costs.map((row, i) => (
              <tr key={i}>
                {row.map((cost, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      className="form-control"
                      value={cost}
                      onChange={(e) => handleCostChange(i, j, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Método de selección */}
      <label className="mt-4">
        📌 Método Inicial:
        <select
          className="form-select mt-2"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="northwest">Esquina Noroeste</option>
          <option value="minimum_cost">Costo Mínimo</option>
          <option value="vogel">Aproximación de Vogel</option>
        </select>
      </label>

      {/* Botón para resolver */}
      <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
        🚀 Resolver
      </button>

      {/* Sección de resultados */}
      {solution && solution.status === "success" && (
        <div className="mt-4 p-4 bg-light rounded border">
          {/* 🔹 Mensaje de balanceo */}
          {solution.balance_message && (
            <p className="alert alert-warning text-center">{solution.balance_message}</p>
          )}

          <h2 className="text-success text-center">
            📊 Costo Total: {solution.total_cost}
          </h2>

          <h3 className="mt-4">🛠 Solución Inicial:</h3>
          {renderMatrixTable(solution.initial_solution)}

          <h3 className="mt-4">🏆 Solución Óptima:</h3>
          {renderMatrixTable(solution.optimal_solution)}
        </div>
      )}

      {/* Error */}
      {error && <p className="alert alert-danger mt-4 text-center">{error}</p>}
    </div>
  );
}
