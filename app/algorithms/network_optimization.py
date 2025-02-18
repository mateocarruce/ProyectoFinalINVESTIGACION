import networkx as nx

def dijkstra_algorithm(graph, start_node):
    G = nx.Graph()

    # Convertir la matriz de adyacencia en una lista de aristas
    num_nodes = len(graph)
    for i in range(num_nodes):
        for j in range(num_nodes):
            if graph[i][j] > 0:  # Evitar conexiones 0 (sin conexión)
                G.add_edge(i, j, weight=graph[i][j])

    # Ejecutar Dijkstra
    path_lengths, paths = nx.single_source_dijkstra(G, start_node)

    return {"distances": path_lengths, "paths": paths}
