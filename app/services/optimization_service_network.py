import google.generativeai as genai
from algorithms.network_optimization import solve_all_problems

API_KEY = "AIzaSyAA8l3RsLttGn9-KYU7gvrZnLa-rNxZQzE"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-pro")

def generate_network_analysis(results):
    """
    Genera un análisis de sensibilidad para optimización de redes utilizando Google Gemini AI.
    Se incluye la descripción de la secuencia de nodos para cada método y una recomendación final.
    """
    prompt = f"""
    Dado los siguientes resultados de la optimización en redes:
    - Ruta más corta: Nodos {results['shortest_path']['node_order']}, peso total: {results['shortest_path']['total_weight']}.
    - Ruta más larga: Nodos {results['longest_path']['node_order']}, peso total: {results['longest_path']['total_weight']}.
    - Árbol de Expansión Mínima: Aristas {results['mst']['edges']}, peso total: {results['mst']['total_weight']}.
    - Flujo Máximo: Flujo total: {results['max_flow']['max_flow']}, Iteraciones: {results['max_flow']['iterations']}.
    
    Por favor, analiza estos resultados, indicando en detalle la secuencia de nodos de cada método (por ejemplo, "del nodo A al nodo B, de B a C", etc.) y proporciona una recomendación final sobre cuál método de redes es el más adecuado para optimizar la red, justificando tu elección en función de los valores obtenidos.
    """
    response = model.generate_content(prompt).text
    return response

def solve_optimization_network(problem_type, data):
    """
    Resuelve la optimización en redes.
    Si problem_type es "all", se ejecutan todos los métodos y se genera el análisis de sensibilidad.
    Se espera que data contenga la llave "graph" con la lista de aristas.
    """
    if problem_type == "all":
        results = solve_all_problems(data["graph"])
        network_analysis = generate_network_analysis(results)
        results["network_analysis"] = network_analysis
        return results
    elif problem_type == "shortest_path":
        results = solve_all_problems(data["graph"])
        return {"shortest_path": results["shortest_path"]}
    elif problem_type == "mst":
        results = solve_all_problems(data["graph"])
        return {"mst": results["mst"]}
    else:
        return {"status": "error", "message": "Unknown problem type"}
