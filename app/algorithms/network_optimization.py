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
    """Flujo Máximo con detalle del flujo por nodo"""
    G = nx.DiGraph()
    for u, v, w in graph:
        G.add_edge(u, v, capacity=w)

    flow_value, flow_dict = nx.maximum_flow(G, source, sink)

    image = generate_graph_image(graph, title="Flujo Máximo")

    return {
        "max_flow": flow_value,
        "flow_distribution": flow_dict,
        "start_node": source,
        "end_node": sink,
        "graph_image": image
    }

def min_cost_flow_algorithm(graph):
    """Flujo de Costo Mínimo en una Red Dirigida"""
    G = nx.DiGraph()

    # Agregar aristas con pesos y capacidades
    for u, v, w in graph:
        G.add_edge(u, v, weight=w, capacity=w)  

    # 🔹 Fuente y sumidero definidos automáticamente (primer y último nodo del grafo)
    source = list(G.nodes)[0]  # Primer nodo
    sink = list(G.nodes)[-1]    # Último nodo

    # 🔹 Asignar demanda/suministro a los nodos
    supply = sum(w for _, _, w in graph)  # Oferta total
    demand = -supply  # Demanda total

    G.nodes[source]["demand"] = supply
    G.nodes[sink]["demand"] = demand

    try:
        # Aplicar algoritmo de Flujo de Costo Mínimo
        flow_cost, flow_dict = nx.network_simplex(G)

        # Generar imagen del grafo con flujo de costo mínimo
        image = generate_graph_image(graph, title="Flujo de Costo Mínimo")

        return {
            "total_cost": flow_cost,
            "flow_distribution": flow_dict,
            "graph_image": image
        }
    except nx.NetworkXUnfeasible:
        return {"error": "❌ La red no es factible para el flujo de costo mínimo. Verifica la demanda y oferta en los nodos."}

def solve_all_problems(graph):
    """Resuelve todos los problemas y devuelve datos completos"""
    source, sink = graph[0][0], graph[-1][1]

    return {
        "shortest_path": dijkstra_algorithm(graph, list(graph[0])[0]),
        "longest_path": longest_path(graph),
        "mst": minimum_spanning_tree(graph),
        "max_flow": max_flow_algorithm(graph, source, sink),
        "min_cost_flow": min_cost_flow_algorithm(graph),
    }

