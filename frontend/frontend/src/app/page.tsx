"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {/* Título principal */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
        Optimization Solver
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Selecciona un módulo para resolver problemas de optimización.
      </p>

      {/* Contenedor de opciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Programación Lineal */}
        <Link href="/linear">
          <div
            className={`p-6 rounded-lg shadow-lg transition-all duration-300 cursor-pointer ${
              hovered === "linear" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onMouseEnter={() => setHovered("linear")}
            onMouseLeave={() => setHovered(null)}
          >
            <h2 className="text-2xl font-bold">📈 Programación Lineal</h2>
            <p className="text-gray-700">
              Resuelve problemas de optimización lineal con restricciones.
            </p>
          </div>
        </Link>

        {/* Card: Problema de Transporte */}
        <Link href="/transport">
          <div className="p-6 rounded-lg shadow-lg bg-white hover:bg-green-500 transition-all duration-300 cursor-pointer">
            <h2 className="text-2xl font-bold">🚚 Problema de Transporte</h2>
            <p className="text-gray-700">
              Optimiza la distribución de recursos entre varios destinos.
            </p>
          </div>
        </Link>

        {/* Card: Optimización en Redes */}
        <Link href="/network">
          <div className="p-6 rounded-lg shadow-lg bg-white hover:bg-blue-500 transition-all duration-300 cursor-pointer">
            <h2 className="text-2xl font-bold">🌐 Optimización en Redes</h2>
            <p className="text-gray-700">
              Encuentra rutas óptimas en sistemas de transporte y redes.
            </p>
          </div>
        </Link>

      </div>

      {/* Pie de página */}
      <footer className="absolute bottom-4 text-gray-500">
        <p>© 2025 Optimization Solver - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
