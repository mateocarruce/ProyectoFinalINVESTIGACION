# routes/optimization_routes_network.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Union
from services.optimization_service_network import solve_optimization_network

router = APIRouter()

class NetworkProblemRequest(BaseModel):
    graph: List[List[Union[str, int, float]]]  # Acepta nodos como str y pesos como int/float

@router.post("/solve_network")
def solve_network_problem(request: NetworkProblemRequest):
    # En este ejemplo se usa "all" para que se ejecuten todos los métodos y se genere el análisis
    result = solve_optimization_network("all", request.dict())
    return result
