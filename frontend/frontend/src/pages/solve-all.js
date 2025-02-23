"use client";
import React, { useState } from "react";
import { solveOptimization } from "../services/optimizationService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

export default function SolveAllPage() {
  const [optimizationData, setOptimizationData] = useState({});
  const [problemDescription, setProblemDescription] = useState(""); // ✅ Estado para la descripción
  const [solution, setSolution] = useState(null);
  const [explanation, setExplanation] = useState(null); // ✅ Estado para la explicación de Gemini
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Función para resolver el problema
  const handleSolve = async () => {
    setError(null);
    try {
      const response = await solveOptimization({
        ...optimizationData,
        description: problemDescription, // ✅ Enviar la descripción al backend
      });

      setSolution(response.solution);
      setExplanation(response.explanation); // ✅ Guardar la explicación de Gemini
      setShowModal(true);
    } catch (err) {
      setError("Error al resolver el problema.");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Optimización General</h1>

      {/* Cuadro de texto para la descripción del problema */}
      <div className="mb-3">
        <label className="form-label">Descripción del problema:</label>
        <textarea
          className="form-control"
          rows="3"
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          placeholder="Describe el problema en palabras simples..."
        />
      </div>

      {/* Botón para resolver */}
      <button className="btn btn-primary" onClick={handleSolve}>
        Resolver
      </button>

      {/* Modal para mostrar la solución y la explicación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {solution && <p><strong>Solución:</strong> {JSON.stringify(solution)}</p>}
          {explanation && <p><strong>Explicación de Gemini:</strong> {explanation}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}
