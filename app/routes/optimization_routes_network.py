from fastapi import APIRouter, HTTPException
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Union
from algorithms.network_optimization import solve_all_problems

router = APIRouter()

# Configurar Gemini con la clave de API
genai.configure(api_key="TU_CLAVE_DE_API")


def get_gemini_explanation(problem_description, solution):
    """Genera una explicación usando Gemini basada en el problema y la solución"""
    prompt = f"""
    El usuario planteó el siguiente problema de optimización de redes:

    {problem_description}

    Se obtuvo la siguiente solución:

    {solution}

    Explica si esta es una buena solución en función del problema ingresado.
    """
    response = genai.generate_text(model="gemini-pro", prompt=prompt)
    return response.text if response else "No se pudo generar una explicación."


class NetworkProblemRequest(BaseModel):
    graph: List[List[Union[str, int, float]]]
    description: str = "No se proporcionó una descripción del problema."


@router.post("/solve_network")
def solve_network_problem(request: NetworkProblemRequest):
    try:
        solution = solve_all_problems(request.graph)

        # Obtener explicación con Gemini
        explanation = get_gemini_explanation(request.description, solution)

        return {"solution": solution, "explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
