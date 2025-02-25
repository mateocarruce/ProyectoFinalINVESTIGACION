"use client";
import React, { useState } from "react";
import { solveLinear } from "../services/linearService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

export default function LinearPage() {
  const [method, setMethod] = useState("simplex");
  const [objective, setObjective] = useState("max");
  const [numVariables, setNumVariables] = useState(2);
  const [numConstraints, setNumConstraints] = useState(2);
  const [modelGenerated, setModelGenerated] = useState(false);
  const [objectiveCoeffs, setObjectiveCoeffs] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Genera el modelo dinámico (función objetivo y restricciones)
  const generateModel = () => {
    const n = Number(numVariables);
    const m = Number(numConstraints);
    setObjectiveCoeffs(new Array(n).fill(""));
    setConstraints(
      new Array(m).fill(null).map(() => ({
        coeffs: new Array(n).fill(""),
        sign: "<=",
        rhs: ""
      }))
    );
    setModelGenerated(true);
  };

  // Limpia el formulario (reset de todos los estados)
  const clearForm = () => {
    setMethod("simplex");
    setObjective("max");
    setNumVariables(2);
    setNumConstraints(2);
    setObjectiveCoeffs([]);
    setConstraints([]);
    setModelGenerated(false);
    setSolution(null);
    setError(null);
  };

  // Actualiza el valor de un coeficiente de la función objetivo
  const handleObjectiveCoeffChange = (index, value) => {
    const newCoeffs = [...objectiveCoeffs];
    newCoeffs[index] = value;
    setObjectiveCoeffs(newCoeffs);
  };

  // Actualiza el coeficiente de una restricción dada (fila y columna)
  const handleConstraintCoeffChange = (row, col, value) => {
    const newConstraints = constraints.map((rowData, i) =>
      i === row
        ? { ...rowData, coeffs: rowData.coeffs.map((c, j) => (j === col ? value : c)) }
        : rowData
    );
    setConstraints(newConstraints);
  };

  // Actualiza el signo de una restricción
  const handleConstraintSignChange = (row, value) => {
    const newConstraints = constraints.map((rowData, i) =>
      i === row ? { ...rowData, sign: value } : rowData
    );
    setConstraints(newConstraints);
  };

  // Actualiza el RHS de una restricción
  const handleConstraintRHSChange = (row, value) => {
    const newConstraints = constraints.map((rowData, i) =>
      i === row ? { ...rowData, rhs: value } : rowData
    );
    setConstraints(newConstraints);
  };

  // Recopila los datos y envía la petición al backend
  const solveProblem = async () => {
    // Genera nombres de variables: x1, x2, ..., x_n
    const variables = Array.from({ length: objectiveCoeffs.length }, (_, i) => `x${i + 1}`);
    const requestData = {
      objective,
      variables,
      objective_coeffs: objectiveCoeffs.map(Number),
      constraints: constraints.map((c) => ({
        coeffs: c.coeffs.map(Number),
        sign: c.sign,
        rhs: Number(c.rhs)
      })),
      method
    };

    try {
      const result = await solveLinear(requestData);
      setSolution(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el backend.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar fijo */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <button onClick={() => router.push("/")} className="btn btn-light">
          ⬅ Regresar al Inicio
        </button>
        <h3 className="text-white mx-auto">Solucionador de Programación Lineal</h3>
      </nav>

      {/* Espacio para evitar solapamiento con el Navbar */}
      <div className="container mt-5"></div>



      {/* Espacio para evitar solapamiento con el Navbar fijo */}
      <div className="pt-5 mt-5">
        <div className="container my-4">
          {/* Configuración del Modelo */}
          <div className="card shadow-lg p-4 mb-4">
            <h4 className="text-primary">Configuración del Modelo</h4>
            <div className="row mt-3">
              <div className="col-md-3">
                <label>Método</label>
                <select
                  className="form-control"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="simplex">Simplex</option>
                  <option value="two_phase">Dos Fases</option>
                  <option value="m_big">Gran M</option>
                  <option value="dual">Dual</option>
                  <option value="graphical">Gráfico</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Tipo de Objetivo</label>
                <select
                  className="form-control"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                >
                  <option value="max">Maximizar</option>
                  <option value="min">Minimizar</option>
                </select>
              </div>
              <div className="col-md-3">
                <label># Variables</label>
                <select
                  className="form-control"
                  value={numVariables}
                  onChange={(e) => setNumVariables(e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label># Restricciones</label>
                <select
                  className="form-control"
                  value={numConstraints}
                  onChange={(e) => setNumConstraints(e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <button className="btn btn-primary w-100" onClick={generateModel}>
                  Generar Modelo
                </button>
              </div>
              <div className="col-md-6">
                <button className="btn btn-danger w-100" onClick={clearForm}>
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Si se generó el modelo, se muestran las secciones de Función Objetivo y Restricciones */}
          {modelGenerated && (
            <>
              {/* Función Objetivo */}
              <div className="card shadow-lg p-4 mb-4">
                <h4 className="text-primary">Función Objetivo</h4>
                <div className="row mt-3">
                  {objectiveCoeffs.map((coef, index) => (
                    <div key={index} className="col-md-2 d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control"
                        placeholder={`x${index + 1}`}
                        value={coef}
                        onChange={(e) => handleObjectiveCoeffChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Restricciones */}
              <div className="card shadow-lg p-4 mb-4">
                <h4 className="text-primary">Restricciones</h4>
                {constraints.map((constraint, i) => (
                  <div key={i} className="row mb-3 align-items-center">
                    {constraint.coeffs.map((coef, j) => (
                      <div key={j} className="col-md-2 d-flex align-items-center">
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`x${j + 1}`}
                          value={coef}
                          onChange={(e) => handleConstraintCoeffChange(i, j, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                    <div className="col-md-2">
                      <select
                        className="form-control"
                        value={constraint.sign}
                        onChange={(e) => handleConstraintSignChange(i, e.target.value)}
                      >
                        <option value="<=">≤</option>
                        <option value=">=">≥</option>
                        <option value="=">=</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="RHS"
                        value={constraint.rhs}
                        onChange={(e) => handleConstraintRHSChange(i, e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mb-4">
                <button className="btn btn-success w-50" onClick={solveProblem}>
                  Resolver
                </button>
              </div>
            </>
          )}

          {/* Mostrar errores */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {/* Resultados */}
          {solution && solution.solution && (
            <div className="card shadow-lg p-4 mb-4">
              <h4 className="text-success">Solución</h4>
              <p>
                <strong>Estado:</strong> {solution.solution.status}
              </p>
              <p>
                <strong>Valor Óptimo:</strong> {solution.solution.objective_value}
              </p>
              <h5>Valores de Variables:</h5>
              <ul className="list-group">
                {Object.entries(solution.solution.variable_values).map(([key, val]) => (
                  <li key={key} className="list-group-item">
                    {key}: {val.toFixed(2)}
                  </li>
                ))}
              </ul>
              {solution.solution.artificial_variables && (
                <div className="mt-3">
                  <h5>Variables Artificiales:</h5>
                  {Array.isArray(solution.solution.artificial_variables) ? (
                    <ul className="list-group">
                      {solution.solution.artificial_variables.map((val, index) => (
                        <li key={index} className="list-group-item">
                          a{index + 1}: {val.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-group">
                      {Object.entries(solution.solution.artificial_variables).map(([key, val]) => (
                        <li key={key} className="list-group-item">
                          {key}: {val.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {solution.solution.graph && (
                <div className="mt-3 text-center">
                  <Image
                    src={`http://127.0.0.1:8000/static/graph_with_table.png`}
                    alt="Gráfico de solución"
                    width={500}
                    height={500}
                    className="img-fluid rounded"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowModal(true)}
                  />
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Modal para mostrar el gráfico ampliado */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Detalles del Gráfico</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {solution && solution.solution && solution.solution.graph && (
            <Image
              src={`http://127.0.0.1:8000${solution.solution.graph}`}
              alt="Gráfico ampliado"
              width={600}
              height={600}
              className="img-fluid rounded"
            />
          )}


        </Modal.Body>
      </Modal>
      {/* 🔥 Análisis de Sensibilidad Mejorado */}
{solution && solution.sensitivity_analysis && (
  <div className="mt-5">
    <h3 className="text-dark">📊 Análisis de Sensibilidad</h3>
    <div className="card shadow-lg p-4 bg-white">
      
      {/* Estado y Valor Óptimo */}
      <p className="mb-3">
        <span className="badge bg-success me-2">📌</span>
        <strong>Estado de la solución:</strong> {solution.solution.status === "Optimal" ? "✅ Óptima" : "⚠ No Óptima"}
      </p>
      <p>
        <span className="badge bg-primary me-2">🎯</span>
        <strong>Valor Óptimo:</strong> <span className="text-primary">{solution.solution.objective_value}</span>
      </p>

      {/* Explicación General */}
      <div className="alert alert-info">
        <h5 className="text-primary">📢 Explicación del Resultado:</h5>
        <p className="text-muted">{solution.sensitivity_analysis.explanation}</p>
      </div>

      {/* 📌 Recomendaciones estratégicas */}
      <h5 className="text-primary mt-3">📢 ¿Cómo mejorar los resultados?</h5>
      <ul className="list-group">
        {solution.sensitivity_analysis.recommendations.map((recommendation, index) => (
          <li key={index} className="list-group-item">📌 {recommendation}</li>
        ))}
      </ul>

    </div>
  </div>
)}

    </div>
  );
}