from algorithms.network_optimization import (
    dijkstra_algorithm, minimum_spanning_tree
)

def solve_optimization_network(problem_type, data):
    if problem_type == "shortest_path":
        return dijkstra_algorithm(data["graph"], data["start_node"])
    elif problem_type == "mst":
        return minimum_spanning_tree(data["graph"])
    return {"status": "error", "message": "Unknown problem type"}
