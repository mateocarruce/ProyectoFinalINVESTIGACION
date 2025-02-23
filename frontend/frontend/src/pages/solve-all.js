"use client";
import React, { useState } from "react";
import { solveOptimization } from "../services/optimizationService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SolveAllPage() {
  const [optimizationData, setOptimizationData] = useState({});
  const [solution, setSolution] = useState(null);
  const [explanation, setExplanation] = useState(null);  // ✅ Nuevo estado para la explicación
  const [error, setError] = useState(null);

  const handleSolve = async () => {
    setError(null);
    setSolution(null);
    setExplanation(null); // ✅ Resetear la explicación antes de la llamada a la API

    try {
      const response = await solveOptimization(optimizationData);
      setSolution(response.solution);
      setExplanation(response.explanation);  // ✅ Guardar la explicación en el estado
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Optimización General</h1>

      {/* Botón para resolver */}
      <button className="btn btn-primary" onClick={handleSolve}>
        Resolver
      </button>

      {/* Mostrar solución si está disponible */}
      {solution && (
        <div className="mt-4">
          <h3>Solución:</h3>
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
