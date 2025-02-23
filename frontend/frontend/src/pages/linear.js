"use client";
import React, { useState } from "react";
import { solveLinear } from "../services/linearService";
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
  const [explanation, setExplanation] = useState(null);  // ✅ Nuevo estado para la explicación
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Función para resolver el problema
  const handleSolve = async () => {
    setError(null);
    setSolution(null);
    setExplanation(null); // ✅ Resetear la explicación antes de la llamada a la API

    try {
      const response = await solveLinear({
        method,
        objective,
        numVariables,
        numConstraints,
        objectiveCoeffs,
        constraints,
      });
      setSolution(response.solution);
      setExplanation(response.explanation);  // ✅ Guardar la explicación en el estado
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Resolución de Programación Lineal</h1>

      {/* Botón para resolver */}
      <button className="btn btn-primary" onClick={handleSolve}>
        Resolver
      </button>

      {/* Mostrar solución si está disponible */}
      {solution && (
        <div className="mt-4">
          <h3>Solución Óptima:</h3>
          <p>{JSON.stringify(solution)}</p>
        </div>
      )}

      {/* Mostrar explicación de la IA si está disponible */}
      {explanation && (
        <div className="mt-4">
          <h3>Explicación:</h3>
          <p>{explanation}</p>
        </div>
      )}

      {/* Mostrar error si ocurre */}
      {error && (
        <div className="mt-4 alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
