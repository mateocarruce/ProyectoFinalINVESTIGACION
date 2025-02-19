"use client";
import { useState } from "react";
import { solveTransport } from "../services/transportService";

export default function TransportPage() {
  const [formData, setFormData] = useState({
    supply: "",
    demand: "",
    costs: "",
    method: "northwest",
  });

  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = {
        supply: JSON.parse(formData.supply),
        demand: JSON.parse(formData.demand),
        costs: JSON.parse(formData.costs),
        method: formData.method,
      };

      const result = await solveTransport(parsedData);
      setSolution(result);
      setError(null);
    } catch (err) {
      setError("❌ Formato inválido. Asegúrate de usar corchetes [] correctamente.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">🚚 Problema de Transporte</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block font-semibold">Suministro (supply):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.supply}
          onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
          placeholder='Ej: [20, 30, 25]'
          required
        />

        <label className="block font-semibold">Demanda (demand):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.demand}
          onChange={(e) => setFormData({ ...formData, demand: e.target.value })}
          placeholder='Ej: [10, 10, 15, 20]'
          required
        />

        <label className="block font-semibold">Costos de Transporte (costs):</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.costs}
          onChange={(e) => setFormData({ ...formData, costs: e.target.value })}
          placeholder='Ej: [[4, 8, 8, 10], [6, 3, 2, 6], [3, 6, 5, 8]]'
          required
        />

        <label className="block font-semibold">Método Inicial:</label>
        <select
          className="border p-2 w-full"
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value })}
        >
          <option value="northwest">Esquina Noroeste</option>
          <option value="minimum_cost">Costo Mínimo</option>
          <option value="vogel">Aproximación de Vogel</option>
        </select>

        <button type="submit" className="bg-green-600 text-white p-3 rounded w-full">
          Resolver 🚀
        </button>
      </form>

      {/* Mensajes de Error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Mostrar Solución */}
      {solution && solution.status === "success" && (
        <div className="mt-6 p-4 bg-gray-100">
          <h2 className="text-xl font-bold text-green-600">✅ Solución Inicial ({formData.method})</h2>
          <MatrixDisplay matrix={solution.initial_solution} />

          <h2 className="text-xl font-bold text-blue-600 mt-6">🔹 Solución Óptima (MODI)</h2>
          <MatrixDisplay matrix={solution.optimal_solution} />
        </div>
      )}

      {solution && solution.status === "error" && (
        <p className="text-red-500 mt-4">❌ {solution.message}</p>
      )}
    </div>
  );
}

// Componente para mostrar matrices en tabla
const MatrixDisplay = ({ matrix }) => (
  <table className="border-collapse border border-gray-500 mt-2 w-full text-center">
    <tbody>
      {matrix.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} className="border border-gray-500 p-2">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
