import numpy as np

def northwest_corner_method(supply, demand):
    allocation = np.zeros((len(supply), len(demand)))
    i, j = 0, 0
    while i < len(supply) and j < len(demand):
        min_val = min(supply[i], demand[j])
        allocation[i][j] = min_val
        supply[i] -= min_val
        demand[j] -= min_val
        if supply[i] == 0:
            i += 1
        else:
            j += 1
    return allocation.tolist()
