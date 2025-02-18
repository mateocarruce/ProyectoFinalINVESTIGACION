import { api } from "./api"; // 🔹 IMPORTANTE: Asegurar que api está importado

export const solveTransport = async (data) => {
  try {
    const response = await api.post("/api/solve_transport", data);
    return response.data;
  } catch (error) {
    console.error("Error al resolver el problema de transporte:", error.response?.data || error.message);
    return null;
  }
};
