from algorithms.linear_programming import solve_linear_program
import numpy as np
from algorithms.transportation import (
    balance_transportation_problem,
    northwest_corner_method,
    minimum_cost_method,
    vogel_approximation_method,
    modi_method
)
from algorithms.network_optimization import dijkstra_algorithm

def solve_optimization(problem_type, data):
    print(f"🚀 Recibida solicitud para {problem_type} con datos:", data)

    if problem_type == "linear":
        return solve_linear_program(data["c"], data["A_ub"], data["b_ub"])
    elif problem_type == "transport":
        try:
            # 🔍 Verificar si los datos existen
            if "supply" not in data or "demand" not in data or "costs" not in data:
                return {"status": "error", "message": "Faltan datos en la solicitud"}

            supply = data["supply"]
            demand = data["demand"]
            costs = np.array(data["costs"], dtype=float)

            # Balancear el problema
            supply, demand, costs = balance_transportation_problem(supply, demand, costs)

            # Seleccionar método inicial
            method = data.get("method", "northwest")

            if method == "northwest":
                initial_solution = northwest_corner_method(supply, demand)
            elif method == "minimum_cost":
                initial_solution = minimum_cost_method(supply, demand, costs)
            elif method == "vogel":
                initial_solution = vogel_approximation_method(supply, demand, costs)
            else:
                return {"status": "error", "message": "Método inválido"}

            # Aplicar MODI
            optimal_solution = modi_method(initial_solution, costs)

            # 🔍 Verificar la respuesta antes de enviarla
            response = {
                "status": "success",
                "initial_solution": initial_solution.tolist(),
                "optimal_solution": optimal_solution
            }
            print("📩 Respuesta enviada al frontend:", response)  # ✅ Verificar respuesta

            return response

        except Exception as e:
            print(f"❌ Error en solve_optimization: {str(e)}")
            return {"status": "error", "message": str(e)}
    elif problem_type == "network":
        return dijkstra_algorithm(data["graph"], data["start_node"])
    return {"status": "error", "message": "Unknown problem type"}
