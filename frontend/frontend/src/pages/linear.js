import { useState } from "react";
import solveLinear from "../services/api";

export default function LinearPage() {
    const [problemDescription, setProblemDescription] = useState("");
    const [data, setData] = useState({ method: "simplex", coefficients: [] });
    const [solution, setSolution] = useState(null);
    const [explanation, setExplanation] = useState("");

    const handleSolve = async () => {
        try {
            const response = await solveLinear({ ...data, description: problemDescription });
            setSolution(response.solution);
            setExplanation(response.explanation);
        } catch (error) {
            console.error("Error al resolver:", error);
        }
    };

    return (
        <div>
            <h1>Resolver Problema Lineal</h1>
            <textarea
                placeholder="Describe tu problema aquí..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
            />
            {/* Aquí irían los inputs para ingresar los valores del problema */}
            <button onClick={handleSolve}>Resolver</button>
            {solution && (
                <div>
                    <h2>Solución:</h2>
                    <p>{JSON.stringify(solution)}</p>
                    <h2>Explicación:</h2>
                    <p>{explanation}</p>
                </div>
            )}
        </div>
    );
}
