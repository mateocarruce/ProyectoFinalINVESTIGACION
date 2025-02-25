"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { solveNetwork } from "../services/networkService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

export default function NetworkPage() {
  const [graph, setGraph] = useState([]);
  const [solution, setSolution] = useState(null);
  const [edgeData, setEdgeData] = useState({ from: "", to: "", weight: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const addEdge = () => {
    if (!edgeData.from || !edgeData.to || !edgeData.weight) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    setGraph((prevGraph) => [
      ...prevGraph,
      [edgeData.from, edgeData.to, parseInt(edgeData.weight)]
    ]);
    setEdgeData({ from: "", to: "", weight: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos al backend:", graph);
    const data = { graph };
    // Aquí se llama al endpoint que resuelve TODOS los métodos y genera el análisis
    const result = await solveNetwork({ ...data, problem_type: "all" });
    console.log("Respuesta del backend:", result);
    setSolution(result);
  };

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
    setShowModal(true);
  };

  const metodoNombres = {
    shortest_path: "Ruta Más Corta",
    longest_path: "Ruta Más Larga",
    mst: "Árbol de Expansión Mínima",
    max_flow: "Flujo Máximo"
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar FIJO */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <button onClick={() => router.push("/")} className="btn btn-light">
          ⬅ Regresar al Inicio
        </button>
        <h3 className="text-white mx-auto">Optimización en Redes</h3>
      </nav>

      {/* Contenido Principal */}
      <div style={{ marginTop: "80px" }}>
        <div className="container text-center mt-5">
          {/* Sección de ingreso de aristas */}
          <div className="row justify-content-center">
            {/* Agregar Nueva Arista */}
            <div className="col-md-6">
              <div className="card shadow-lg p-4">
                <h4 className="text-primary">➕ Agregar Nueva Arista</h4>
                <div className="row g-3 mt-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nodo origen"
                      value={edgeData.from}
                      onChange={(e) =>
                        setEdgeData({ ...edgeData, from: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nodo destino"
                      value={edgeData.to}
                      onChange={(e) =>
                        setEdgeData({ ...edgeData, to: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Peso"
                      value={edgeData.weight}
                      onChange={(e) =>
                        setEdgeData({ ...edgeData, weight: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={addEdge}
                >
                  ➕ Agregar Arista
                </button>
              </div>
            </div>

            {/* Lista de Aristas Ingresadas */}
            <div className="col-md-6">
              <div className="card shadow-lg p-4">
                <h4 className="text-success">📌 Aristas Ingresadas</h4>
                <ul className="list-group mt-3">
                  {graph.length > 0 ? (
                    graph.map(([u, v, w], index) => (
                      <li key={index} className="list-group-item">
                        🔹 {u} → {v} | Peso: {w}
                      </li>
                    ))
                  ) : (
                    <p className="text-muted">
                      No hay aristas ingresadas aún.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Botón Resolver */}
          <button
            onClick={handleSubmit}
            className="btn btn-success mt-4 w-50"
          >
            🚀 Resolver
          </button>

          {/* Resultados de la Optimización */}
          {solution && (
            <div className="mt-5">
              <h2 className="text-success">✅ Resultados de la Optimización</h2>
              <div className="d-flex flex-wrap justify-content-center mt-4 gap-3">
                {Object.keys(metodoNombres).map((key) => {
                  if (solution[key]) {
                    return (
                      <div
                        className="card shadow-lg"
                        style={{ width: "300px" }}
                        key={key}
                      >
                        <div className="card-body text-center">
                          <h5 className="text-primary">
                            🔹 {metodoNombres[key]}
                          </h5>
                          <p className="text-muted">
                            {key === "max_flow"
                              ? `Flujo total: ${solution[key].max_flow}`
                              : `Peso total: ${solution[key].total_weight}`}
                          </p>
                          <img
                            src={`data:image/png;base64,${solution[key].graph_image}`}
                            alt={metodoNombres[key]}
                            className="img-fluid rounded mt-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleImageClick(solution[key])}
                          />
                          {key === "max_flow" &&
                            solution.max_flow.iterations &&
                            solution.max_flow.iterations.length > 0 && (
                              <>
                                <h5 className="mt-3 text-primary">
                                  🔄 Iteraciones
                                </h5>
                                <ul className="list-group list-group-flush">
                                  {solution.max_flow.iterations.map(
                                    (step, index) => (
                                      <li
                                        key={index}
                                        className="list-group-item"
                                      >
                                        🔹 Iteración {index + 1}: Camino{" "}
                                        {step.path} | Capacidad {step.capacity}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </>
                            )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Sección de Análisis de Sensibilidad */}
          {solution && solution.network_analysis && (
            <div className="mt-5">
              <h3 className="text-dark">
                📊 Análisis de Sensibilidad / Interpretación de Resultados
              </h3>
              <div className="card shadow-lg p-4 bg-white">
                <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                  {solution.network_analysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para mostrar la imagen expandida */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">
            🔹 Detalles de la Solución
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <>
              <p className="text-muted">
                {selectedImage.total_weight !== undefined &&
                  `Peso total: ${selectedImage.total_weight}`}
                {selectedImage.max_flow !== undefined &&
                  `Flujo total: ${selectedImage.max_flow}`}
              </p>
              <img
                src={`data:image/png;base64,${selectedImage.graph_image}`}
                alt="Detalle de la imagen"
                className="img-fluid rounded"
              />
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
