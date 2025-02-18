import { api } from "./api";

export const solveLinear = async (data) => {
  try {
    const response = await api.post("/api/solve_linear", data);
    return response.data;
  } catch (error) {
    console.error("Error al resolver programación lineal:", error.response?.data || error.message);
    return null;
  }
};
