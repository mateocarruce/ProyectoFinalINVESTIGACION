from fastapi import APIRouter, HTTPException
from models.linear_program import (
    solve_linear_problem,
    solve_graphical,
    solve_two_phase_linear_problem,
    solve_m_big_linear_problem,
    solve_dual_linear_problem
)
from utils.validations import validate_linear_problem
from utils.sensitivity_analysis import analyze_sensitivity

router = APIRouter()

@router.post("/solve_linear")
def solve_linear(data: dict):
    print("Datos recibidos:", data)
    errors = validate_linear_problem(data)
    if errors:
        raise HTTPException(status_code=400, detail=errors)
    
    # Determinar el método a utilizar
    method = data.get("method", "simplex")  # Método por defecto: Simplex
    try:
        if method == "graphical":
            solution = solve_graphical(data)  # Llamar al método gráfico
        elif method == "two_phase":
            # Llamar al método de Dos Fases
            solution = solve_two_phase_linear_problem(
                data["objective_coeffs"],
                data["variables"],
                data["constraints"],
                data["objective"]
            )
        elif method == "m_big":  # Para el método Gran M
            solution = solve_m_big_linear_problem(
                data["objective_coeffs"],
                data["variables"],
                data["constraints"],
                data["objective"]
            )
        elif method == "dual":
            solution = solve_dual_linear_problem(data)    
        else:
            solution = solve_linear_problem(data)  # Llamar al método de programación lineal

        # Análisis de sensibilidad (explicativo)
        # Omitir el análisis adicional para los métodos 'graphical' y 'dual'
        if method.lower() == "graphical":
            sensitivity_analysis = solution.get("sensitivity_analysis", None)
        elif method.lower() == "dual":
            # Para el método dual, tomar el análisis generado internamente
            sensitivity_analysis = solution.get("sensitivity_analysis", None)
        else:
            sensitivity_analysis = analyze_sensitivity(data, solution)

        response = {
            "solution": solution,
            "sensitivity_analysis": sensitivity_analysis
        }

        if method == "graphical":
            response["solution"]["graph"] = "/static/graph_with_table.png"
        else:
            response["solution"]["graph"] = None

        print("Respuesta del backend:", response)  # Para depuración
        return response

    except Exception as e:
        print("Error en solve_linear:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


def save_graph_to_file():
    graph_path = "static/graph_with_table.png"  # Guardar la imagen en la carpeta pública
    # Código para generar el gráfico y guardarlo en graph_path