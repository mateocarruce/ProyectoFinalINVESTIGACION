from typing import List, Union  # ✅ Permite que los pesos sean int o float

from algorithms.network_optimization import solve_all_problems
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class NetworkProblemRequest(BaseModel):
    graph: List[List[Union[str, int, float]]]  # ✅ Ahora acepta nombres de nodos como str y pesos como int o float

@router.post("/solve_network")
def solve_network_problem(request: NetworkProblemRequest):
    result = solve_all_problems(request.graph)
    return result
