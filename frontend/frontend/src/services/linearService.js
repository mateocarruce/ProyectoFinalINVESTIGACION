import { api } from "./api";

export const solveLinear = async (data) => {
  try {
    const response = await api.post("/solve_linear", data);
    return response.data;  // ✅ Ahora devuelve { solution, explanation }
  } catch (error) {
    if (error.response) {
      console.error("Error al resolver programación lineal:", error.response.data);
      throw new Error(error.response.data.explanation || "Error desconocido en el servidor.");
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
      throw new Error("No se recibió respuesta del servidor. Intenta nuevamente.");
    } else {
      console.error("Error al configurar la solicitud:", error.message);
      throw new Error("Error al configurar la solicitud.");
    }
  }
};
