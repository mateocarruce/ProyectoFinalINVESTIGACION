from fastapi import APIRouter, HTTPException
import google.generativeai as genai
from models.linear_program import (
    solve_linear_problem, solve_graphical, solve_two_phase_linear_problem,
    solve_m_big_linear_problem, solve_dual_linear_problem
)
from utils.validations import validate_linear_problem
from utils.sensitivity_analysis import analyze_sensitivity

router = APIRouter()

# Configurar Gemini con la clave de API
genai.configure(api_key="TU_CLAVE_DE_API")


def get_gemini_explanation(problem_description, solution):
    """Genera una explicación usando Gemini basada en el problema y la solución"""
    prompt = f"""
    El usuario ha planteado el siguiente problema de programación lineal:

    {problem_description}

    Se ha resuelto utilizando un método de optimización. La solución obtenida es:

    {solution}

    Explica si esta es una buena solución en función del problema ingresado.
    """
    response = genai.generate_text(model="gemini-pro", prompt=prompt)
    return response.text if response else "No se pudo generar una explicación."


@router.post("/solve_linear")
def solve_linear(data: dict):
    print("Datos recibidos:", data)

    # Validar datos
    errors = validate_linear_problem(data)
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    problem_description = data.get("description", "No se proporcionó una descripción del problema.")
    method = data.get("method", "simplex")

    try:
        if method == "graphical":
            solution = solve_graphical(data)
        elif method == "two-phase":
            solution = solve_two_phase_linear_problem(data)
        elif method == "m-big":
            solution = solve_m_big_linear_problem(data)
        elif method == "dual":
            solution = solve_dual_linear_problem(data)
        else:
            solution = solve_linear_problem(data)

        # Obtener explicación con Gemini
        explanation = get_gemini_explanation(problem_description, solution)

        return {"solution": solution, "explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
