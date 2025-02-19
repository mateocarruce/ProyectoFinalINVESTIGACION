"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { solveTransport } from "../services/transportService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";  // ✅ Modal de Bootstrap para análisis de sensibilidad

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
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

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
    <div className="container-fluid bg-light min-vh-100">
      {/* ✅ Navbar FIJO */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <button onClick={() => router.push("/")} className="btn btn-light">
          ⬅ Regresar al Inicio
        </button>
        <h3 className="text-white mx-auto">Problema de Transporte</h3>
      </nav>

      {/* Espacio para evitar solapamiento con el Navbar */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg p-4">
              <h4 className="text-primary text-center">📦 Parámetros del Problema</h4>

              {/* Sección de parámetros */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <label>🚛 Número de Suministros:</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={numSuppliers}
                    onChange={handleNumSuppliersChange}
                  />
                </div>
                <div className="col-md-6">
                  <label>🏢 Número de Demandas:</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={numDemands}
                    onChange={handleNumDemandsChange}
                  />
                </div>
              </div>

              {/* Sección para ingresar oferta y demanda */}
              <div className="mt-4">
                <h5 className="text-success">📦 Oferta</h5>
                <div className="d-flex gap-2">
                  {supply.map((value, i) => (
                    <input
                      key={i}
                      type="number"
                      className="form-control w-25"
                      value={value}
                      onChange={(e) => handleSupplyChange(i, e.target.value)}
                    />
                  ))}
                </div>

                <h5 className="text-danger mt-4">🏭 Demanda</h5>
                <div className="d-flex gap-2">
                  {demand.map((value, i) => (
                    <input
                      key={i}
                      type="number"
                      className="form-control w-25"
                      value={value}
                      onChange={(e) => handleDemandChange(i, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Matriz de Costos */}
              <div className="mt-4">
                <h5 className="text-dark">💲 Matriz de Costos</h5>
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
              <div className="mt-3">
                <label>📌 Método Inicial:</label>
                <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="northwest">Esquina Noroeste</option>
                  <option value="minimum_cost">Costo Mínimo</option>
                  <option value="vogel">Aproximación de Vogel</option>
                </select>
              </div>

              {/* Botón Resolver */}
              <button className="btn btn-success w-100 mt-3" onClick={handleSubmit}>
                🚀 Resolver
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {solution && (
          <div className="mt-5">
            <h2 className="text-success text-center">✅ Resultados</h2>
            <h4 className="text-primary">📊 Costo Total: {solution.total_cost}</h4>
            <h5>🛠 Solución Inicial:</h5>
            {renderMatrixTable(solution.initial_solution)}
            <h5>🏆 Solución Óptima:</h5>
            {renderMatrixTable(solution.optimal_solution)}
          </div>
        )}

        {/* ✅ NUEVO APARTADO DE ANÁLISIS DE SENSIBILIDAD */}
        <div className="mt-5">
            <h3 className="text-dark">📊 Análisis de Sensibilidad / Resultados obtenidos / Toma de decisiones</h3>
            <div className="card shadow-lg p-4 bg-white">
              <p className="text-muted">
                Aquí se mostrarán los análisis y conclusiones sobre los resultados obtenidos en la optimización de
                redes.
              </p>
              <div
                className="border p-3 bg-light"
                style={{ minHeight: "150px", fontSize: "18px", textAlign: "center" }}
              >
                <em>🔎 Espacio reservado para futuros cálculos y análisis.</em>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
