"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { solveNetwork } from "../services/networkService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NetworkPage() {
  const [graph, setGraph] = useState([]);
  const [solution, setSolution] = useState(null);
  const [edgeData, setEdgeData] = useState({ from: "", to: "", weight: "" });
  const router = useRouter();

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
    console.log("Enviando datos al backend:", graph);
    const data = { graph };

    const result = await solveNetwork(data);
    setSolution(result);
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <button onClick={() => router.push("/")} className="btn btn-light">
          ⬅ Regresar al Inicio
        </button>
        <h1 className="text-white mx-auto">Optimización en Redes</h1>
      </nav>

      <div className="container text-center mt-5">
        {/* Sección de Ingreso */}
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px" }}>
          <h2 className="text-primary">➕ Agregar Nueva Arista</h2>
          <div className="row g-3 mt-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nodo origen"
                value={edgeData.from}
                onChange={(e) => setEdgeData({ ...edgeData, from: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nodo destino"
                value={edgeData.to}
                onChange={(e) => setEdgeData({ ...edgeData, to: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Peso"
                value={edgeData.weight}
                onChange={(e) => setEdgeData({ ...edgeData, weight: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-primary mt-3 w-100" onClick={addEdge}>
            ➕ Agregar Arista
          </button>
        </div>

        {/* Lista de Aristas */}
        <div className="card shadow-lg p-4 mt-4 mx-auto" style={{ maxWidth: "600px" }}>
          <h2 className="text-success">📌 Aristas Ingresadas</h2>
          <ul className="list-group mt-3">
            {graph.length > 0 ? (
              graph.map(([u, v, w], index) => (
                <li key={index} className="list-group-item">
                  🔹 {u} → {v} | Peso: {w}
                </li>
              ))
            ) : (
              <p className="text-muted">No hay aristas ingresadas aún.</p>
            )}
          </ul>
        </div>

        {/* Botón Resolver */}
        <button onClick={handleSubmit} className="btn btn-success mt-4 w-50">
          🚀 Resolver
        </button>

        {/* Resultados */}
        {solution && (
          <div className="mt-5">
            <h2 className="text-success">✅ Resultados de la Optimización</h2>

            {/* Contenedor de Resultados en una sola fila */}
            <div className="d-flex flex-wrap justify-content-center mt-4 gap-3">
              {solution.shortest_path && (
                <div className="card shadow-lg" style={{ width: "300px" }}>
                  <div className="card-body text-center">
                    <h5 className="text-primary">🔹 Ruta más corta</h5>
                    <p className="text-muted">Peso total: {solution.shortest_path.total_weight}</p>
                    <img src={`data:image/png;base64,${solution.shortest_path.graph_image}`} alt="Ruta más corta" className="img-fluid rounded mt-2" />
                  </div>
                </div>
              )}

              {solution.longest_path && (
                <div className="card shadow-lg" style={{ width: "300px" }}>
                  <div className="card-body text-center">
                    <h5 className="text-primary">🔹 Ruta más larga</h5>
                    <p className="text-muted">Peso total: {solution.longest_path.total_weight}</p>
                    <img src={`data:image/png;base64,${solution.longest_path.graph_image}`} alt="Ruta más larga" className="img-fluid rounded mt-2" />
                  </div>
                </div>
              )}

              {solution.mst && (
                <div className="card shadow-lg" style={{ width: "300px" }}>
                  <div className="card-body text-center">
                    <h5 className="text-primary">🔹 Árbol de Expansión Mínima</h5>
                    <p className="text-muted">Peso total: {solution.mst.total_weight}</p>
                    <img src={`data:image/png;base64,${solution.mst.graph_image}`} alt="Árbol de Expansión Mínima" className="img-fluid rounded mt-2" />
                  </div>
                </div>
              )}

              {/* Flujo Máximo Mejorado */}
              {solution.max_flow && (
                <div className="card shadow-lg" style={{ width: "300px" }}>
                  <div className="card-body text-center">
                    <h5 className="text-primary">🔹 Flujo Máximo</h5>
                    <p className="text-muted">Flujo total: {solution.max_flow.max_flow}</p>
                    <img src={`data:image/png;base64,${solution.max_flow.graph_image}`} alt="Flujo Máximo" className="img-fluid rounded mt-2" />

                    {/* Iteraciones */}
                    <h5 className="mt-3 text-primary">🔄 Iteraciones</h5>
                    <ul className="list-group list-group-flush">
                      {solution.max_flow.iterations.map((step, index) => (
                        <li key={index} className="list-group-item">
                          🔹 Iteración {index + 1}: Camino {step.path} | Capacidad {step.capacity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
