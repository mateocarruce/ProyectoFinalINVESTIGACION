from algorithms.linear_programming import solve_linear_program
from models.linear_program import  solve_m_big_linear_problem, solve_dual_linear_problem,solve_graphical           
import numpy as np
import google.generativeai as genai

from algorithms.transportation import (
    balance_transportation_problem,
    northwest_corner_method,
    minimum_cost_method,
    vogel_approximation_method,
    modi_method
)
from algorithms.network_optimization import dijkstra_algorithm

API_KEY = "AIzaSyAA8l3RsLttGn9-KYU7gvrZnLa-rNxZQzE"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-pro")

def generate_sensitivity_analysis(solution, total_cost):
    """
    Genera un análisis de sensibilidad utilizando Google Gemini AI.
    """
    prompt = f"""Dado un problema de transporte con la solución óptima:
    {solution} y un costo total de {total_cost}, analiza los resultados obtenidos,
    identifica posibles mejoras y proporciona recomendaciones para optimizar la distribución."""

    response = model.generate_content(prompt).text
    return response

def calculate_total_cost(solution, costs):
    """
    Calcula el costo total de la solución basada en la matriz de costos.
    """
    total_cost = 0
    for i in range(len(solution)):
        for j in range(len(solution[i])):
            total_cost += solution[i][j] * costs[i][j] 
    return total_cost

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

            # Guardamos el tamaño original
            original_supply_len = len(supply)
            original_demand_len = len(demand)

            # 🔍 Verificar si se necesita balancear el problema
            supply, demand, costs = balance_transportation_problem(supply, demand, costs)

            balance_message = None
            if len(supply) > original_supply_len:
                balance_message = "Se agregó un suministro ficticio para balancear el problema."
            elif len(demand) > original_demand_len:
                balance_message = "Se agregó una demanda ficticia para balancear el problema."

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
            
            # Optimización con MODI
            optimal_solution = modi_method(initial_solution, costs)
            total_cost = calculate_total_cost(optimal_solution, costs)

            # 📌 Generar Análisis de Sensibilidad con Google Gemini AI
            sensitivity_analysis = generate_sensitivity_analysis(optimal_solution, total_cost)

            response = {
                "status": "success",
                "initial_solution": initial_solution.tolist(),
                "optimal_solution": optimal_solution,
                "total_cost": total_cost,
                "sensitivity_analysis": sensitivity_analysis
            }
            print("📩 Respuesta enviada al frontend:", response)  # ✅ Verificar respuesta

            return response

        except Exception as e:
            print(f"❌ Error en solve_optimization: {str(e)}")
            return {"status": "error", "message": str(e)}
    elif problem_type == "network":
        return dijkstra_algorithm(data["graph"], data["start_node"])
    return {"status": "error", "message": "Unknown problem type"}

def generate_sensitivity_analysis_lp(solution, objective_value, constraints, variables, method):
    """
    Genera un análisis de sensibilidad para problemas de programación lineal, considerando
    el tipo de método utilizado (Gran M, Dos Fases, Dual, Gráfico, Simplex) y las variables artificiales.
    """
    artificial_vars = solution.get("artificial_variables", {})
    excess_vars = solution.get("excess_variables", {})  # Variables de exceso
    method_name = method.upper()  # Método utilizado

    # --- Análisis de Variables Artificiales ---
    artificial_analysis = ""
    if artificial_vars:
        for var_name, value in artificial_vars.items():
            if value > 0:
                artificial_analysis += f"🚨 **Advertencia:** La variable artificial **{var_name}** tiene un valor de **{value}**, lo que sugiere posibles conflictos o subóptimidad en la solución.\n"
            else:
                artificial_analysis += f"✅ La variable artificial **{var_name}** tiene un valor de **{value}**, indicando que fue eliminada correctamente.\n"

    # --- Análisis de Variables de Exceso ---
    excess_analysis = ""
    if excess_vars:
        for var_name, value in excess_vars.items():
            if value > 0:
                excess_analysis += f"🚨 **Advertencia:** La variable de exceso **{var_name}** tiene un valor de **{value}**, lo que indica que la restricción asociada no se está utilizando completamente.\n"
            else:
                excess_analysis += f"✅ La variable de exceso **{var_name}** tiene un valor de **{value}**, indicando que la restricción se satisface sin exceso.\n"

    # --- Sensibilidad de los Coeficientes del Objetivo ---
    objective_sensitivity = "📈 **Función Objetivo:** Los cambios en los coeficientes pueden alterar la pendiente y desplazar el óptimo.\n"
    if method_name in ["M_BIG", "TWO_PHASE"]:
        objective_sensitivity += "⚠️ **Nota:** En métodos como Gran M o Dos Fases, se deben considerar las penalizaciones y el comportamiento de las variables artificiales.\n"

    # --- Análisis de Restricciones ---
    constraints_sensitivity = "📐 **Restricciones:**\n"
    for i, constraint in enumerate(constraints):
        lhs = " + ".join(f"{constraint['coeffs'][j]}*{variables[j]}" for j in range(len(constraint['coeffs'])))
        if constraint["sign"] == "<=":
            constraints_sensitivity += f"   - **Restricción {i+1}:** `{lhs} <= {constraint['rhs']}`\n"
        elif constraint["sign"] == ">=":
            constraints_sensitivity += f"   - **Restricción {i+1}:** `{lhs} >= {constraint['rhs']}`\n"
        else:
            constraints_sensitivity += f"   - **Restricción {i+1}:** `{lhs} = {constraint['rhs']}`\n"

    # --- Si se usa el método Dual, delegar a su función específica ---
    if method_name == "DUAL":
        return generate_sensitivity_analysis_dual(solution, constraints, "max", objective_value)

    # --- Si se usa el método Gráfico, delegar a su función específica ---
    if method_name == "GRAPHICAL":
        return generate_sensitivity_analysis_graphical(solution, objective_value, constraints, variables)

    # Construir el análisis completo para métodos SIMPLEX, M_BIG, TWO_PHASE, etc.
    analysis_text = (
        artificial_analysis + "\n" +
        excess_analysis + "\n" +
        objective_sensitivity + "\n" +
        constraints_sensitivity
    )

    # --- Recomendaciones ---
    recommendations = []
    if method_name in ["M_BIG", "TWO_PHASE"]:
        recommendations.append("🔍 Revisar la formulación de las restricciones, ya que las variables artificiales pueden indicar problemas en el modelo.")
    if method_name == "SIMPLEX":
        recommendations.append("⚙️ Verificar las iteraciones del método Simplex para confirmar que los valores básicos sean correctos.")

    return {
        "explanation": f"**Análisis de Sensibilidad** utilizando el método **{method_name}**:",
        "analysis": analysis_text,
        "recommendations": recommendations
    }

def generate_sensitivity_analysis_dual(solution, constraints, primal_objective, dual_objective_value):
    """
    Genera un análisis de sensibilidad para el método dual en programación lineal.
    Evalúa cómo los cambios en las restricciones afectan las variables duales y la solución óptima.
    """
    dual_analysis = ""
    
    if primal_objective == "max":
        dual_analysis += "🔷 **Método Dual (Maximización)**\n"
        dual_analysis += "-----------------------------------\n"
        dual_analysis += "Este análisis examina cómo los cambios en las restricciones afectan la solución óptima en el problema primal.\n"
    else:
        dual_analysis += "🔷 **Método Dual (Minimización)**\n"
        dual_analysis += "-----------------------------------\n"
        dual_analysis += "Este análisis evalúa la sensibilidad del problema a modificaciones en las restricciones.\n"
    
    dual_analysis += f"\n**Valor óptimo de la función objetivo dual:** `{dual_objective_value}`\n\n"
    
    # Evaluación de las restricciones y variables duales
    for i, constraint in enumerate(constraints):
        dual_value = solution["variable_values"].get(f"y{i+1}", 0)
        dual_analysis += f"**Restricción {i+1}:** Valor de la variable dual = **{dual_value}**\n"
        if dual_value > 0:
            dual_analysis += "   - 🔴 **Activa (ligante):** Cambios en esta restricción modificarán la solución óptima.\n"
            # Estimación del rango de factibilidad (aproximado)
            lower_bound = constraint["rhs"] - abs(dual_value) * 0.1
            upper_bound = constraint["rhs"] + abs(dual_value) * 0.1
            dual_analysis += f"     • **Rango de factibilidad:** `{lower_bound:.2f} ≤ RHS ≤ {upper_bound:.2f}`\n"
        else:
            dual_analysis += "   - ⚪ **No activa:** Pequeñas variaciones no afectarán la solución óptima.\n"
        dual_analysis += "\n"

    recommendations = [
        "💡 Si una restricción tiene una variable dual positiva, evaluar cómo su modificación (aumentar el RHS) podría mejorar la solución.",
        "💡 Si la variable dual es cero, considerar si la restricción puede ser ajustada sin afectar el óptimo.",
        "💡 Utilizar el valor sombra para identificar restricciones críticas."
    ]
    
    return {
        "analysis": dual_analysis,
        "recommendations": recommendations
    }

def generate_sensitivity_analysis_graphical(solution, objective_value, constraints, variables):
    """
    Genera un análisis de sensibilidad para problemas resueltos con el método gráfico.
    Se analiza cómo los cambios en las restricciones y en los coeficientes de la función objetivo afectan la solución.
    """
    # Encabezado general
    analysis_text = "## Análisis de Sensibilidad\n\n"

    # 1. Restricciones
    analysis_text += "### 1. Restricciones\n\n"
    analysis_text += "Se analizan las restricciones del modelo y cómo variaciones en su lado derecho (RHS) pueden modificar la región factible:\n\n"
    for i, constraint in enumerate(constraints):
        coeffs = constraint["coeffs"]
        rhs = constraint["rhs"]
        # Formateo de la restricción según el signo
        if constraint["sign"] == "<=":
            restriccion = f"`{coeffs[0]}*x1 + {coeffs[1]}*x2 <= {rhs}`"
        elif constraint["sign"] == ">=":
            restriccion = f"`{coeffs[0]}*x1 + {coeffs[1]}*x2 >= {rhs}`"
        else:
            restriccion = f"`{coeffs[0]}*x1 + {coeffs[1]}*x2 = {rhs}`"
        
        analysis_text += f"**Restricción {i+1}:** {restriccion}\n\n"
        analysis_text += "- **Impacto:** Si se incrementa el valor del RHS, la región factible se contrae, lo que podría desplazar el punto óptimo.\n"
        analysis_text += "- **Recomendación:** Revisar el balance de las restricciones para mantener una solución viable.\n\n"
    
    # 2. Función Objetivo
    analysis_text += "### 2. Función Objetivo\n\n"
    analysis_text += f"La función objetivo es: **{variables[0]} * x1 + {variables[1]} * x2**.\n\n"
    analysis_text += "- **Impacto:** Cambiar los coeficientes de la función objetivo modifica la pendiente, lo que puede desplazar el óptimo a otro vértice.\n"
    analysis_text += "- **Recomendación:** Evaluar cuidadosamente cualquier variación en los coeficientes.\n\n"
    
    # 3. Puntos de Intersección
    analysis_text += "### 3. Puntos de Intersección\n\n"
    analysis_text += "Los puntos de intersección definen las soluciones candidatas. Es crucial confirmar que estos puntos se encuentren dentro de la región factible:\n\n"
    for i, point in enumerate(solution['intersection_points']):
        analysis_text += f"- **Punto {i+1}:** x1 = {point[0]:.2f}, x2 = {point[1]:.2f}\n"
        analysis_text += "  - **Impacto:** Un cambio en las restricciones puede alterar estos puntos y, en consecuencia, el óptimo.\n\n"
    
    # 4. Recomendaciones Finales
    analysis_text += "### 4. Recomendaciones Finales\n\n"
    analysis_text += "- Revisar cómo pequeños cambios en los coeficientes de las restricciones afectan la solución óptima.\n"
    analysis_text += "- Considerar ajustes en los coeficientes de la función objetivo y evaluar su impacto.\n"
    analysis_text += "- Realizar pruebas de sensibilidad con distintos valores para asegurar la robustez de la solución.\n\n"
    
    # Explicación general del análisis
    explanation_text = (
        "El análisis de sensibilidad muestra de forma clara cómo las variaciones en las restricciones y en los coeficientes de la función "
        "objetivo pueden influir en el resultado óptimo. Evaluar estos cambios es fundamental para confirmar que la solución sea robusta "
        "ante posibles modificaciones en los parámetros del modelo."
    )
    
    # Lista de recomendaciones resumidas
    recommendations = [
        "🔍 Revisar los coeficientes de las restricciones para asegurar la estabilidad de la solución.",
        "🔍 Evaluar el impacto de modificaciones en la función objetivo.",
        "🔍 Realizar pruebas con valores alternativos para validar la robustez del modelo."
    ]
    
    return {
        "explanation": explanation_text,
        "analysis": analysis_text,
        "recommendations": recommendations
    }
