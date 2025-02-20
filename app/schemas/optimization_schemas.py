from typing import List, Optional

from pydantic import BaseModel


class LinearProgrammingRequest(BaseModel):
    c: List[float]
    A_ub: List[List[float]]
    b_ub: List[float]

class OptimizationResponse(BaseModel):
    status: str
    solution: Optional[List[float]]
    message: Optional[str]
