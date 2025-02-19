from fastapi import APIRouter
from schemas.optimization_schemas import LinearProgrammingRequest, OptimizationResponse
from services.optimization_service import solve_optimization

router = APIRouter()

@router.post("/solve_transport")
def solve_transportation(data: dict):
    return solve_optimization("transport", data)

@router.post("/solve_network")
def solve_network_optimization(data: dict):
    return solve_optimization("network", data)
