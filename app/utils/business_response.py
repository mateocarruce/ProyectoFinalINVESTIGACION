from transformers import pipeline

# Inicializa el pipeline de resumen (si lo necesitas para otros casos)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def generate_business_response(solution, problem_text: str) -> str:
    """
    Genera una respuesta al negocio de forma genérica utilizando los resultados de la solución.
    
    Parámetros:
      - solution: Puede ser un dict con los resultados (con claves "status", "objective_value", "variable_values")
        o bien, en algunos casos, un string ya generado.
      - problem_text: descripción original del problema planteado.
    
    Retorna:
      Un string con una respuesta legible y amigable.
    """
    # Si solution es un string, retornarlo directamente
    if isinstance(solution, str):
        return solution

    # Si solution es un diccionario, procesarlo
    variable_values = solution.get("variable_values", {})
    objective_value = solution.get("objective_value", None)
    status = solution.get("status", "No definido")
    
    response_lines = []
    if status.lower() == "optimal":
        response_lines.append("La solución óptima es la siguiente:")
        # Recorre todas las variables y sus valores
        for var, val in variable_values.items():
            response_lines.append(f"  - {var}: {val:.2f}")
        if objective_value is not None:
            response_lines.append(f"Con un valor óptimo de: {objective_value:.2f} USD.")
    else:
        response_lines.append("No se encontró una solución óptima para el problema planteado.")
    
    if problem_text:
        response_lines.append("\nResumen del problema:")
        response_lines.append(problem_text)
    
    return "\n".join(response_lines)
