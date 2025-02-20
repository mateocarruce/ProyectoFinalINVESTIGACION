"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {/* Título principal */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
        Solucionador de Problemas
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Selecciona un módulo para resolver problemas de optimización.
      </p>

      {/* Contenedor de opciones con mayor separación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
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

      {/* Sección Todos los Módulos con más espacio debajo */}
      <div className="w-4/5 md:w-2/3 bg-white shadow-lg rounded-lg p-6 text-center mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 Resolver con los 3 Modelos</h2>
        <p className="text-gray-700 mb-4">
          Aquí puedes ejecutar la solución con todos los modelos disponibles.
        </p>
        <Link href="/solve-all">
          <div className="px-6 py-3 rounded-lg shadow-lg bg-red-500 text-white text-lg font-bold hover:bg-red-600 transition-all duration-300 cursor-pointer inline-block">
            🔍 Ejecutar
          </div>
        </Link>
      </div>

      {/* Pie de página más pequeño */}
      <footer className="mt-10 text-gray-500 text-center text-xs">
        <p>© 2025 Solucionador de Optimización - Todos los derechos reservados</p>
        <p className="mt-1 text-gray-600">
          <strong>Creadores:</strong> CÁCERES PÉREZ DANIELA ELIZABETH · CARRASCO AMAGUA MATEO FELIPE · 
          JIMÉNEZ BASURTO DENNYS WLADIMIR · OLIVARES INTRIAGO MEYBILI TATIANA · SALAS CUEVA LESLY SALOMÉ
        </p>
      </footer>
    </div>
  );
}
