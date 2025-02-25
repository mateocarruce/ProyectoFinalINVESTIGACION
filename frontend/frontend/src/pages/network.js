"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { solveNetwork } from "../services/networkService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Función opcional para extraer JSON de Markdown (si es necesario)
function extractJSONFromMarkdown(mdText) {
  const codeBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = mdText.match(codeBlockRegex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {
      console.error("Error parseando el bloque JSON:", err);
    }
  }
  return null;
}


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
    const result = await solveNetwork({ ...data, problem_type: "all" });
    console.log("Respuesta del backend:", result);
    let parsedAnalysis = result.network_analysis;
    try {
      if (
        typeof result.network_analysis === "string" &&
        result.network_analysis.trim().startsWith("{")
      ) {
        parsedAnalysis = JSON.parse(result.network_analysis);
      } else {
        // Si es Markdown, intenta extraer el bloque JSON
        const extracted = extractJSONFromMarkdown(result.network_analysis);
        if (extracted) parsedAnalysis = extracted;
      }
    } catch (error) {
      console.error("Error parseando network_analysis:", error);
      parsedAnalysis = result.network_analysis;
    }
    setSolution({ ...result, network_analysis: parsedAnalysis });
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
                                        🔹 Iteración {index + 1}: {step.path} | Capacidad {step.capacity}
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

          {/* Sección de Análisis de Sensibilidad / Interpretación de Resultados */}
          {solution && solution.network_analysis && (
            <div className="mt-5">
              <h3 className="text-dark text-center">
                📊 Análisis de resultados obtenidos
              </h3>
              <div className="card bg-white shadow-lg p-4"> {/* Cuadro con fondo blanco */}
                <div className="row">

                  {/* 1. Análisis de Métodos */}
                  {solution.network_analysis.metodos && (
                    <div className="col-12 mb-4">
                      <h5 className="text-black fst-italic text-center">1. Análisis de Métodos</h5>
                      <div className="row">
                        {Object.entries(solution.network_analysis.metodos).map(
                          ([key, metodo]) => (
                            <div className="col-md-3 mb-3" key={key}>
                              <div className="card shadow-sm">
                                <div className="card-header text-center">
                                  <strong>{key.replace("_", " ").toUpperCase()}</strong>
                                </div>
                                <div className="card-body text-left">
                                  {key === "mst" ? (
                                    <>
                                      <p className="card-text"><strong>Aristas:</strong></p>
                                      <ul className="list-group list-group-flush">
                                        {metodo.aristas &&
                                          metodo.aristas.map((arista, idx) => (
                                            <li key={idx} className="list-group-item">
                                              {arista.origen} → {arista.destino} ({arista.peso})
                                            </li>
                                          ))}
                                      </ul>
                                      <p className="card-text mt-2"><strong>Peso total:</strong> {metodo.peso_total}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="card-text"><strong>Secuencia:</strong> {metodo.secuencia}</p>
                                      <p className="card-text"><strong>{key === "max_flow" ? "Flujo total" : "Peso total"}:</strong> {metodo.peso_total || metodo.flujo_total}</p>
                                    </>
                                  )}
                                  <p className="card-text"><em>{metodo.detalle}</em></p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. Comparación de Resultados */}
                  {solution.network_analysis.comparacion && (
                    <div className="col-12 mb-4">
                      <h5 className="text-black fst-italic text-center">2. Comparación de Resultados</h5>
                      <div className="card shadow-sm p-3">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className="text-left">Método</th>
                              <th className="text-left">Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(solution.network_analysis.comparacion).map(
                              ([key, value]) => (
                                <tr key={key}>
                                  <td className="text-capitalize">{key.replace("_", " ")}</td>
                                  <td className="text-justify">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {value}
                                    </ReactMarkdown>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 3. Método Óptimo */}
                  {solution.network_analysis.metodo_optimo && (
                    <div className="col-12 mb-4">
                      <h5 className="text-black fst-italic text-center">3. Método Óptimo</h5>
                      <div className="card shadow-sm p-3">
                        <p className="text-left">
                          <strong>Explicación:</strong>{" "}
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {solution.network_analysis.metodo_optimo.explicacion}
                          </ReactMarkdown>
                        </p>
                        <p className="text-left">
                          <strong>Recomendación:</strong>{" "}
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {solution.network_analysis.metodo_optimo.recomendacion}
                          </ReactMarkdown>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 4. Conclusión y Recomendación */}
                  {solution.network_analysis.conclusion && (
                    <div className="col-12 mb-4">
                      <h5 className="text-black fst-italic text-center">4. Conclusión y Recomendación</h5>
                      <div className="card shadow-sm p-3">
                      <p className="text-left">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {solution.network_analysis.conclusion}
                          </ReactMarkdown>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div> {/* Fin del cuadro de fondo blanco */}
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