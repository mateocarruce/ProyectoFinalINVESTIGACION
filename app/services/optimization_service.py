from algorithms.linear_programming import solve_linear_program
from algorithms.transportation import northwest_corner_method
from algorithms.network_optimization import dijkstra_algorithm

def solve_optimization(problem_type, data):
    if problem_type == "linear":
        return solve_linear_program(data["c"], data["A_ub"], data["b_ub"])
    elif problem_type == "transport":
        return northwest_corner_method(data["supply"], data["demand"])
    elif problem_type == "network":
        return dijkstra_algorithm(data["graph"], data["start_node"])
    return {"status": "error", "message": "Unknown problem type"}
