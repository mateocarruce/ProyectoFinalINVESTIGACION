from fastapi.encoders import jsonable_encoder
from pulp import value

def analyze_sensitivity(data, solution):
    """Genera un análisis explicativo y amigable de sensibilidad basado en la solución obtenida."""
    if "status" not in solution or solution["status"] != "Optimal":
        return {"error": "No se puede realizar el análisis de sensibilidad sin una solución óptima."}

    # Variables óptimas
    variable_values = solution["variable_values"]
    optimal_value = solution["objective_value"]
    
    explanation = (
        f"🔎 **Resumen de la Solución:**\n"
        f"El modelo ha encontrado la mejor combinación de valores para maximizar/minimizar la función objetivo.\n\n"
        f"✅ **Para obtener el mejor resultado, debes utilizar:**\n"
    )
    
    for var, value in variable_values.items():
        explanation += f"  - {var}: {value:.2f} unidades.\n"

    explanation += (
        f"\n🎯 **Esto permitirá alcanzar un resultado óptimo de** `{optimal_value:.2f}`.\n\n"
    )

    # 📊 Impacto de variables en la función objetivo
    explanation += "**📊 Impacto de las variables en el resultado:**\n"
    for var, coef in zip(data["variables"], data["objective_coeffs"]):
        explanation += (
            f"  - Si aumentas `{var}` en una unidad, la función objetivo cambiará en `{coef:.2f}` unidades.\n"
        )

    # 🔍 Análisis de restricciones
    active_constraints = []
    shadow_prices = []
    constraints_explanation = "\n🔍 **Estado de las restricciones:**\n"

    for i, constraint in enumerate(data["constraints"]):
        lhs_value = sum(
            coef * variable_values[var]
            for coef, var in zip(constraint["coeffs"], data["variables"])
        )
        
        active = lhs_value == constraint["rhs"]
        active_constraints.append({
            "index": i + 1,
            "expression": f"{constraint['coeffs']} ≤ {constraint['rhs']}",
            "status": "Activa" if active else "No activa",
        })

        shadow_price = 1 if active else 0  # Estimación simple
        shadow_prices.append(shadow_price)

        if active:
            constraints_explanation += f"  - 🔴 **Restricción {i+1} está en su límite** ({constraint['coeffs']} ≤ {constraint['rhs']}).\n"
        else:
            constraints_explanation += f"  - 🟢 **Restricción {i+1} aún tiene margen** ({constraint['coeffs']} ≤ {constraint['rhs']}).\n"

    explanation += constraints_explanation

    # 💰 Valores sombra
    shadow_price_explanation = "\n💰 **Valores Sombra (Precios Duales):**\n"
    for i, price in enumerate(shadow_prices):
        shadow_price_explanation += (
            f"  - Si aumentas el límite de la **Restricción {i+1}**, el resultado óptimo cambiará en aproximadamente `{price:.2f}` unidades.\n"
        )

    explanation += shadow_price_explanation

    # 📢 Recomendaciones estratégicas
    recommendations = []
    recommendations_explanation = "\n📢 **¿Cómo mejorar los resultados?**\n"

    for constraint in active_constraints:
        if constraint["status"] == "Activa":
            recommendations.append(
                f"  - 🚀 La **Restricción {constraint['index']}** está en su límite. "
                "Si quieres mejorar el resultado, intenta aumentar su margen o modificar su coeficiente en la función objetivo."
            )
    
    for rec in recommendations:
        recommendations_explanation += f"{rec}\n"

    explanation += recommendations_explanation

    return {
        "objective_impact": data["objective_coeffs"],
        "active_constraints": active_constraints,
        "shadow_prices": shadow_prices,
        "recommendations": recommendations,
        "explanation": explanation
    }
