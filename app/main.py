from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import optimization_routes
from routes.linear_solver import router as linear_solver_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Optimization API")

# Habilitar CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes restringir a ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los headers
)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir las rutas del API
app.include_router(optimization_routes.router, prefix="/api")
app.include_router(linear_solver_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
