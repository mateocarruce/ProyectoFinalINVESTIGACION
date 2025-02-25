# services/optimization_service_network.py
import google.generativeai as genai
from algorithms.network_optimization import solve_all_problems

# Configura Gemini IA con la API Key
API_KEY = "AIzaSyDH3qCZqhPfelcWvSZo0f9MEKpniXBXMf8"
genai.configure(api_key=API_KEY)

# Listar modelos disponibles para asegurarnos de que "gemini-pro" está soportado
models = genai.list_models()

# Usar la versión correcta del modelo
model = genai.GenerativeModel("gemini-1.5-pro-latest")
def generate_network_analysis(results):
    prompt = f"""
    Devuelve **solamente** un objeto JSON válido y EXACTO que cumpla con la siguiente estructura, sin ningún texto adicional ni comentarios fuera del JSON. Usa formato Markdown para enriquecer algunos campos (por ejemplo, emojis, negritas) y asegúrate de **rellenar TODOS los campos obligatoriamente**, incluyendo **valores numéricos en todas las comparaciones y explicaciones**.

    **Estructura JSON EXACTA (NO OMITIR NINGÚN CAMPO):**
    ```json
    {{
      "metodos": {{
        "ruta_mas_corta": {{
          "secuencia": "{results['shortest_path']['node_order']}",
          "peso_total": {results['shortest_path']['total_weight']},
          "detalle": "Ruta óptima 💰 para costo mínimo"
        }},
        "ruta_mas_larga": {{
          "secuencia": "{results['longest_path']['node_order']}",
          "peso_total": {results['longest_path']['total_weight']},
          "detalle": "Ruta extensa 🛣️"
        }},
        "mst": {{
          "aristas": [
            {", ".join([f'{{"origen": "{u}", "destino": "{v}", "peso": {w}}}' for u, v, w in results['mst']['edges']])}
          ],
          "peso_total": {results['mst']['total_weight']},
          "detalle": "Conecta todos los nodos 🕸️ al menor costo"
        }},
        "flujo_maximo": {{
          "flujo_total": {results['max_flow']['max_flow']},
          "iteraciones": [
            {", ".join([f'{{"ruta": "{step["path"]}", "capacidad": {step["capacity"]}}}' for step in results['max_flow']['iterations']])}
          ],
          "detalle": "Máximo flujo posible 💦"
        }}
      }},
      "comparacion": {{
        "ruta_mas_corta": "La **Ruta más Corta** tiene un peso total de **{results['shortest_path']['total_weight']}**, lo que la hace ideal para minimizar costos en redes con restricciones de peso.",
        "ruta_mas_larga": "La **Ruta más Larga** tiene un peso total de **{results['longest_path']['total_weight']}**, lo que puede no ser óptimo en términos de eficiencia.",
        "mst": "El **Árbol de Expansión Mínima (MST)** tiene un peso total de **{results['mst']['total_weight']}**, lo que es útil para conectar todos los nodos con el menor costo posible.",
        "flujo_maximo": "El **Flujo Máximo** es de **{results['max_flow']['max_flow']}**, lo que indica la máxima capacidad de transmisión en la red."
      }},
      "metodo_optimo": {{
        "explicacion": "Comparando los resultados, el método más eficiente para minimizar costos es **Ruta más Corta** con un peso de **{results['shortest_path']['total_weight']}**, mientras que para maximizar la capacidad de flujo es **Flujo Máximo** con un valor de **{results['max_flow']['max_flow']}**.",
        "recomendacion": "Se recomienda utilizar **Ruta más Corta** para optimizar costos entre **{results['shortest_path']['node_order'][0]} → {results['shortest_path']['node_order'][-1]}** con un peso de **{results['shortest_path']['total_weight']}**, o **Flujo Máximo** si la prioridad es la transmisión de flujo en la red."
      }},
      "conclusion": "Para optimizar la red, si se busca minimizar costos, se recomienda la **Ruta Más Corta** ({results['shortest_path']['node_order'][0]} → {results['shortest_path']['node_order'][-1]}) con un peso total de **{results['shortest_path']['total_weight']}**. Si se busca maximizar el flujo, se debe emplear el **Flujo Máximo**, que permite un flujo total de **{results['max_flow']['max_flow']}**."
    }}
    ```

    **Instrucciones Claves para Generar la Respuesta Correctamente:**
    1. **NO OMITIR** NINGÚN campo del JSON.
    2. **INCLUIR TODOS LOS VALORES NUMÉRICOS** en la comparación de los 4 métodos.
    3. **La explicación del método óptimo DEBE contener valores específicos** y justificar por qué se elige ese método.
    4. **La recomendación final DEBE indicar los nodos de inicio y destino con los valores obtenidos**.
    5. **No devolver nada fuera del JSON.**
    """
    
    print("Prompt enviado a Gemini IA:", prompt)
    try:
        response = model.generate_content(prompt)
        analysis = response.text
        print("Respuesta de Gemini IA:", analysis)
    except Exception as e:
        print("Error al generar contenido con Gemini IA:", e)
        analysis = "Error al generar análisis: " + str(e)
    return analysis

def solve_optimization_network(problem_type, data):
    """
    Si problem_type es "all", se ejecutan todos los métodos y se genera el análisis de sensibilidad.
    Se espera que data contenga la llave "graph" con la lista de aristas.
    """
    if problem_type == "all":
        results = solve_all_problems(data["graph"])
        network_analysis = generate_network_analysis(results)
        results["network_analysis"] = network_analysis
        return results
    elif problem_type == "shortest_path":
        results = solve_all_problems(data["graph"])
        return {"shortest_path": results["shortest_path"]}
    elif problem_type == "mst":
        results = solve_all_problems(data["graph"])
        return {"mst": results["mst"]}
    else:
        return {"status": "error", "message": "Unknown problem type"}