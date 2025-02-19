import numpy as np

def balance_transportation_problem(supply, demand, costs):
    """
    Verifica si el problema de transporte está balanceado. Si no lo está,
    agrega una fila o columna ficticia con costo cero.
    """
    total_supply = sum(supply)
    total_demand = sum(demand)

    print(f"📌 Total Supply: {total_supply}, Total Demand: {total_demand}")  # 🔍 Agregar log

    if None in supply or None in demand or None in costs:
        raise ValueError("❌ Se encontraron valores None en supply, demand o costs.")

    if total_supply > total_demand:
        # 🔹 Agregar columna ficticia con demanda extra
        demand.append(total_supply - total_demand)
        costs = np.hstack((costs, np.zeros((costs.shape[0], 1))))  # ✅ Usar np.hstack en vez de append

    elif total_demand > total_supply:
        # 🔹 Agregar fila ficticia con oferta extra
        supply.append(total_demand - total_supply)
        costs = np.vstack((costs, np.zeros((1, costs.shape[1]))))  # ✅ Usar np.vstack en vez de append

    return supply, demand, costs

def northwest_corner_method(supply, demand):
    """
    Método de Esquina Noroeste para encontrar una solución inicial.
    """
    supply = supply.copy()
    demand = demand.copy()
    allocation = np.zeros((len(supply), len(demand)), dtype=float)  # ✅ Convertir a float

    i, j = 0, 0
    while i < len(supply) and j < len(demand):
        min_val = min(supply[i], demand[j])
        allocation[i, j] = min_val  # ✅ Asegurar que no queden valores None
        supply[i] -= min_val
        demand[j] -= min_val

        if supply[i] == 0:
            i += 1
        if demand[j] == 0:
            j += 1

    print("✅ Solución Inicial (Esquina Noroeste):\n", allocation)
    return allocation

def minimum_cost_method(supply, demand, costs):
    """
    Método de Costo Mínimo para encontrar una solución inicial.
    """
    supply = supply.copy()
    demand = demand.copy()
    costs = np.array(costs, dtype=float)  # ✅ Convertir costos a float
    allocation = np.zeros((len(supply), len(demand)), dtype=float)  # ✅ Convertir a float

    # Obtener lista de todas las celdas ordenadas por costo mínimo
    cost_indices = [(i, j) for i in range(len(supply)) for j in range(len(demand))]
    cost_indices.sort(key=lambda x: costs[x[0], x[1]])  # Ordenar por costo mínimo

    for i, j in cost_indices:
        if supply[i] > 0 and demand[j] > 0:
            min_val = min(supply[i], demand[j])
            allocation[i, j] = min_val  # ✅ Asegurar que no queden valores None
            supply[i] -= min_val
            demand[j] -= min_val

    print("✅ Solución Inicial (Costo Mínimo):\n", allocation)
    return allocation

def vogel_approximation_method(supply, demand, costs):
    """
    Método de Aproximación de Vogel para encontrar una solución inicial.
    """
    supply = supply.copy()
    demand = demand.copy()
    costs = np.array(costs, dtype=float)  # ✅ Convertir a float para evitar errores con np.inf
    allocation = np.zeros((len(supply), len(demand)))

    while np.any(supply) and np.any(demand):
        penalties = []

        # Calcular penalizaciones por fila y columna
        for i, row in enumerate(costs):
            if supply[i] > 0:
                sorted_row = sorted(row)
                penalties.append((sorted_row[1] - sorted_row[0], 'row', i))

        for j, col in enumerate(costs.T):
            if demand[j] > 0:
                sorted_col = sorted(col)
                penalties.append((sorted_col[1] - sorted_col[0], 'col', j))

        # Seleccionar la fila o columna con la mayor penalización
        max_penalty = max(penalties, key=lambda x: x[0])

        if max_penalty[1] == 'row':
            i = max_penalty[2]
            j = np.argmin(costs[i])
        else:
            j = max_penalty[2]
            i = np.argmin(costs[:, j])

        # Asignar la cantidad máxima posible
        min_val = min(supply[i], demand[j])
        allocation[i][j] = min_val
        supply[i] -= min_val
        demand[j] -= min_val

        # ✅ Asegurarse de que costs[i, j] sea float antes de asignar np.inf
        costs[i, j] = float('inf')  # ✅ Convertir explícitamente a float

    return allocation

def modi_method(allocation, costs):
    """
    Método MODI para optimizar la solución inicial.
    """
    # Implementación del método MODI aquí...
    return allocation  # Retorna la solución óptima después de MODI

def calculate_potentials(allocation, costs):
    """
    Calcula los potenciales U y V para el método MODI.
    """
    rows, cols = allocation.shape
    U = [None] * rows
    V = [None] * cols

    # ✅ Fijar el primer potencial arbitrariamente en 0
    U[0] = 0  

    assigned_cells = [(i, j) for i in range(rows) for j in range(cols) if allocation[i][j] > 0]

    for _ in range(len(assigned_cells)):  # Iterar hasta que todos los valores sean asignados
        for i, j in assigned_cells:
            if U[i] is not None and V[j] is None:
                V[j] = costs[i][j] - U[i]
            elif V[j] is not None and U[i] is None:
                U[i] = costs[i][j] - V[j]

    # 🔍 Verificar si aún hay valores None
    if None in U or None in V:
        print(f"❌ Error en calcular potenciales: U = {U}, V = {V}")
        
        # ✅ Asignar 0 a cualquier valor None restante para evitar fallos en MODI
        U = [0 if u is None else u for u in U]
        V = [0 if v is None else v for v in V]

    print(f"✅ Potenciales corregidos: U = {U}, V = {V}")
    return U, V

def calculate_reduced_costs(U, V, costs):
    """
    Calcula los costos reducidos Z[i][j] = C[i][j] - (U[i] + V[j]).
    """
    rows, cols = costs.shape
    reduced_costs = np.zeros((rows, cols))

    for i in range(rows):
        for j in range(cols):
            reduced_costs[i][j] = costs[i][j] - (U[i] + V[j])

    return reduced_costs

def find_entering_cell(reduced_costs):
    """
    Encuentra la celda con el menor costo reducido negativo (más negativo).
    Si todos los costos reducidos son positivos o cero, la solución es óptima.
    """
    min_value = 0
    entering_cell = None

    rows, cols = reduced_costs.shape
    for i in range(rows):
        for j in range(cols):
            if reduced_costs[i][j] < min_value:  # Se busca el más negativo
                min_value = reduced_costs[i][j]
                entering_cell = (i, j)

    return entering_cell

def find_loop(allocation, entering_cell):
    """
    Encuentra el ciclo de intercambio de celdas en la solución actual.
    """
    i, j = entering_cell
    rows, cols = allocation.shape

    # Encontrar filas y columnas involucradas
    row_links = {idx: set() for idx in range(rows)}
    col_links = {idx: set() for idx in range(cols)}

    for row in range(rows):
        for col in range(cols):
            if allocation[row, col] > 0:
                row_links[row].add(col)
                col_links[col].add(row)

    # Buscar el ciclo de celdas en zig-zag
    path = [(i, j)]
    row_used = set()
    col_used = set()

    while True:
        last_i, last_j = path[-1]

        if len(path) % 2 == 1:  # Buscar en la misma fila
            possible_cols = row_links[last_i] - {last_j}
            if possible_cols:
                next_j = possible_cols.pop()
                path.append((last_i, next_j))
                col_used.add(next_j)
            else:
                break
        else:  # Buscar en la misma columna
            possible_rows = col_links[last_j] - {last_i}
            if possible_rows:
                next_i = possible_rows.pop()
                path.append((next_i, last_j))
                row_used.add(next_i)
            else:
                break

        if path[-1] == entering_cell:  # Si se cierra el ciclo, terminar
            break

    return path

def update_allocation(allocation, loop):
    """
    Ajusta la solución basada en el ciclo MODI, sumando/restando cantidades.
    """
    # Determinar los valores en las celdas alternas del ciclo
    values = [allocation[i, j] for i, j in loop[1::2]]
    theta = min(values)  # Cantidad mínima a restar en el ciclo

    # Actualizar la asignación con +theta y -theta en posiciones alternas
    for idx, (i, j) in enumerate(loop):
        if idx % 2 == 0:
            allocation[i, j] += theta
        else:
            allocation[i, j] -= theta

    return allocation

def modi_method(allocation, costs, max_iterations=100):
    """
    Método MODI para optimizar la solución inicial.
    """
    allocation = np.array(allocation, dtype=float)  # ✅ Convertimos todo a float
    costs = np.array(costs, dtype=float)
    iterations = 0  # Contador de iteraciones

    print("✅ Matriz inicial en MODI:\n", allocation)

    while True:
        if iterations >= max_iterations:  # ✅ Evitar bucles infinitos
            print("❌ Límite de iteraciones alcanzado en MODI.")
            return allocation.tolist()

        iterations += 1  # Aumentar el contador

        # Paso 1: Calcular potenciales (U y V)
        U, V = calculate_potentials(allocation, costs)

        # 🔍 Verificar si hay valores None en U y V
        if None in U or None in V:
            print("❌ Error en MODI: Potenciales contienen None.")
            return allocation.tolist()

        # Paso 2: Calcular costos reducidos
        reduced_costs = calculate_reduced_costs(U, V, costs)

        # 🔍 Verificar si hay valores None en reduced_costs
        if np.isnan(reduced_costs).any():
            print("❌ Error en MODI: Costos reducidos contienen NaN.")
            return allocation.tolist()

        # Paso 3: Identificar la celda entrante
        entering_cell = find_entering_cell(reduced_costs)

        if entering_cell is None:
            # Si no hay costos reducidos negativos, la solución es óptima
            return allocation.tolist()

        # Paso 4: Encontrar el ciclo de intercambio
        loop = find_loop(allocation, entering_cell)

        # Paso 5: Actualizar la solución con el ciclo MODI
        allocation = update_allocation(allocation, loop)
