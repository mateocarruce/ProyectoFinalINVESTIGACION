import google.generativeai as genai
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configurar la clave de API de Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_explanation(prompt):
    """
    Genera una explicación usando Google Gemini.
    """
    try:
        model = genai.GenerativeModel("gemini-pro")  # Modelo Gemini Pro
        response = model.generate_content(prompt)
        return response.text if response else "No se pudo generar la explicación."
    except Exception as e:
        return f"Error en la generación de explicación: {str(e)}"
