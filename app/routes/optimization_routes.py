from fastapi import APIRouter, HTTPException
import google.generativeai as genai
from schemas.optimization_schemas import LinearProgrammingRequest, OptimizationResponse
from services.optimization_service import solve_optimization

router = APIRouter()

# Configurar Gemini con la clave de API
genai.configure(api_key="TU_CLAVE_DE_API")


def get_gemini_explanation(problem_description, solution):
    """Genera una explicación usando Gemini basada en el problema y la solución"""
    prompt = f"""
    El usuario planteó el siguiente problema de optimización:

    {problem_description}

    Se obtuvo la siguiente solución:

    {solution}

    Explica si esta es una buena solución en función del problema ingresado.
    """
    response = genai.generate_text(model="gemini-pro", prompt=prompt)
    return response.text if response else "No se pudo generar una explicación."


@router.post("/solve_transport")
def solve_transportation(data: dict):
    try:
        problem_description = data.get("description", "No se proporcionó una descripción del problema.")
        solution = solve_optimization("transport", data)

        # Obtener explicación con Gemini
        explanation = get_gemini_explanation(problem_description, solution)

        return {"solution": solution, "explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
