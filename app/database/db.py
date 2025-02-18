from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Cadena de conexión usando pymysql para MySQL
DATABASE_URL = "mysql+pymysql://opt_user:password123@localhost/optimization_db"

# Crear el motor de base de datos
engine = create_engine(DATABASE_URL)

# Configuración de la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para definir los modelos de SQLAlchemy
Base = declarative_base()
