import { useState } from "react";
import TransportPage from "./transport";  // ✅ Importa transport.js correctamente
import NetworkPage from "./network";  // ✅ Importa network.js correctamente
import LinearPage from "./linear";  // ✅ Importa linear.js correctamente
import "bootstrap/dist/css/bootstrap.min.css";

export default function SolveAll() {

  const [error] = useState(null);

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <h1 className="text-center text-primary">📊 Optimización Completa del Negocio</h1>

      <div className="row mt-4">
        {/* 📦 Sección de Programación Lineal */}
        <div className="col-md-4">
          <div className="card shadow-lg p-4">
            <LinearPage />
          </div>
        </div>

        {/* 🚚 Sección de Transporte */}
        <div className="col-md-4">
          <div className="card shadow-lg p-4">
            <TransportPage />
          </div>
        </div>

        {/* 🌐 Sección de Redes */}
        <div className="col-md-4">
          <div className="card shadow-lg p-4">
            <NetworkPage />
          </div>
        </div>
      </div>

      {/* 🔹 Análisis de Sensibilidad */}
      <div className="mt-5 p-4 bg-white shadow-lg rounded border">
        <h2 className="text-dark text-center">📊 Análisis de Sensibilidad</h2>
        <p className="text-center text-muted">Aquí se mostrarán los análisis y conclusiones sobre los resultados obtenidos.</p>
        <div className="border p-3 bg-light" style={{ minHeight: "150px", fontSize: "18px", textAlign: "center" }}>
          <em>🔎 Espacio reservado para futuros cálculos y análisis.</em>
        </div>
      </div>

      {/* Error */}
      {error && <p className="alert alert-danger mt-4 text-center">{error}</p>}
    </div>
  );
}
