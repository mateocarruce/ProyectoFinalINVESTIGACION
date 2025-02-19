import networkx as nx
import matplotlib.pyplot as plt
import io
import base64

import matplotlib
matplotlib.use('Agg')

def generate_graph_image(graph, paths=None, title="Grafo"):
    """Genera una imagen del grafo con NetworkX y Matplotlib"""
    G = nx.DiGraph()
    for u, v, w in graph:
        G.add_edge(u, v, weight=w)

    pos = nx.spring_layout(G)
    labels = {(u, v): f"{d['weight']}" for u, v, d in G.edges(data=True)}

    plt.figure(figsize=(6, 4))
    nx.draw(G, pos, with_labels=True, node_color='lightblue', edge_color='gray', node_size=2000, font_size=10)
    nx.draw_networkx_edge_labels(G, pos, edge_labels=labels)

    if paths:
        edges = [(paths[i], paths[i + 1]) for i in range(len(paths) - 1)]
        nx.draw_networkx_edges(G, pos, edgelist=edges, edge_color='red', width=2)

    plt.title(title)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    plt.close()
    return image_base64

def dijkstra_algorithm(graph, start_node):
    """Ruta más corta con peso total y orden de nodos"""
    G = nx.DiGraph()
    for u, v, w in graph:
        G.add_edge(u, v, weight=w)

    path_lengths, paths = nx.single_source_dijkstra(G, start_node)

    # Obtener nodo destino con la mayor distancia encontrada
    end_node = max(path_lengths, key=path_lengths.get)
    total_weight = path_lengths[end_node]
    node_order = paths[end_node] if end_node in paths else []

    image = generate_graph_image(graph, node_order, "Ruta Más Corta")

    return {
        "total_weight": total_weight,
        "node_order": node_order,
        "start_node": start_node,
        "end_node": end_node,
        "graph_image": image
    }

def longest_path(graph):
    """Ruta más larga con peso total y orden de nodos"""
    G = nx.DiGraph()
    for u, v, w in graph:
        G.add_edge(u, v, weight=-w)

    longest_paths = {}
    max_distance = float('-inf')
    best_path = []
    start_node = None
    end_node = None

    for node in G.nodes:
        path_lengths, paths = nx.single_source_bellman_ford(G, node)
        for dest, weight in path_lengths.items():
            if -weight > max_distance:
                max_distance = -weight
                best_path = paths[dest]
                start_node = node
                end_node = dest

    image = generate_graph_image(graph, best_path, "Ruta Más Larga")

    return {
        "total_weight": max_distance,
        "node_order": best_path,
        "start_node": start_node,
        "end_node": end_node,
        "graph_image": image
    }

def minimum_spanning_tree(graph):
    """Árbol de Expansión Mínima con peso total"""
    G = nx.Graph()
    for u, v, w in graph:
        G.add_edge(u, v, weight=w)

    mst = nx.minimum_spanning_tree(G, algorithm="kruskal")
    mst_edges = [(u, v, d["weight"]) for u, v, d in mst.edges(data=True)]
    
    # ✅ Corrección: sumar pesos correctamente
    total_weight = sum(weight for _, _, weight in mst_edges)

    image = generate_graph_image(mst_edges, title="Árbol de Expansión Mínima")

    return {
        "edges": mst_edges,
        "total_weight": total_weight,
        "graph_image": image
    }

def max_flow_algorithm(graph, source, sink):
    """Flujo Máximo con detalle del flujo por nodo e iteraciones"""
    G = nx.DiGraph()
    
    # Agregar aristas con capacidad
    for u, v, w in graph:
        G.add_edge(u, v, capacity=w)

    # Inicializar variables
    flow_value = 0
    iterations = []
    residual_graph = G.copy()

    # Aplicar algoritmo de Edmonds-Karp
    while True:
        try:
            # Encontrar camino aumentante con BFS
            path = nx.shortest_path(residual_graph, source=source, target=sink, weight=None)
            min_capacity = min(residual_graph[u][v]["capacity"] for u, v in zip(path, path[1:]))
            
            # Guardar la iteración
            iterations.append({
                "path": " → ".join(path),
                "capacity": min_capacity
            })

            # Actualizar capacidades del grafo residual
            for u, v in zip(path, path[1:]):
                residual_graph[u][v]["capacity"] -= min_capacity
                if residual_graph[u][v]["capacity"] == 0:
                    residual_graph.remove_edge(u, v)

            # Acumular flujo
            flow_value += min_capacity

        except nx.NetworkXNoPath:
            # No hay más caminos aumentantes
            break

    # Generar imagen del flujo máximo
    image = generate_graph_image(graph, title="Flujo Máximo")

    return {
        "max_flow": flow_value,
        "iterations": iterations,
        "start_node": source,
        "end_node": sink,
        "graph_image": image
    }


def solve_all_problems(graph):
    """Resuelve todos los problemas y devuelve datos completos"""
    source, sink = graph[0][0], graph[-1][1]

    return {
        "shortest_path": dijkstra_algorithm(graph, list(graph[0])[0]),
        "longest_path": longest_path(graph),
        "mst": minimum_spanning_tree(graph),
        "max_flow": max_flow_algorithm(graph, source, sink),
        }

