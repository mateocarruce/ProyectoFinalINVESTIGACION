def analyze_sensitivity(data, solution):
    from models.linear_program import solve_linear_problem  # Importación dentro de la función

    perturbation = 0.01
    sensitivities = {}

    for i, var in enumerate(data["variables"]):
        modified_coeffs = data["objective_coeffs"][:]
        modified_coeffs[i] += perturbation
        new_data = data.copy()
        new_data["objective_coeffs"] = modified_coeffs

        new_solution = solve_linear_problem(new_data)

        sensitivities[var] = (new_solution["objective_value"] - solution["objective_value"]) / perturbation

    return sensitivities
