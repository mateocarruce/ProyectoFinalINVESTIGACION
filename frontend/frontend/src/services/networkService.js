import { api } from "./api"; // 🔹 IMPORTANTE: Asegurar que api está importado

export const solveNetwork = async (data) => {
  try {
    const response = await api.post("/api/solve_network", data);
    return response.data;
  } catch (error) {
    console.error("Error al resolver optimización en redes:", error.response?.data || error.message);
    return null;
  }
};
