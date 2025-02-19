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
    if problem_type == "linear":
        return solve_linear_program(data["c"], data["A_ub"], data["b_ub"])
    elif problem_type == "transport":
        try:
            supply = data["supply"]
            demand = data["demand"]
            costs = np.array(data["costs"], dtype=float)  # Convertir costos a float

            # Verificar si está balanceado
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

            # Aplicar método MODI para optimizar
            optimal_solution = modi_method(initial_solution, costs)

            return {
                "status": "success",
                "initial_solution": initial_solution.tolist(),  # ✅ Se mantiene .tolist() porque es un numpy array
                "optimal_solution": optimal_solution  # ✅ No usar .tolist() porque ya es una lista
            }

        except Exception as e:
            print(f"❌ Error en solve_optimization: {str(e)}")
            return {"status": "error", "message": str(e)}
    elif problem_type == "network":
        return dijkstra_algorithm(data["graph"], data["start_node"])
    return {"status": "error", "message": "Unknown problem type"}
