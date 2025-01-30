"""
Definición de los modelos de la base de datos (tablas y relaciones con SQLAlchemy)
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Modelo Usuario
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # Almacenar contraseñas encriptadas

    # Relación con Recetas
    recetas = relationship("Receta", back_populates="usuario")

# Modelo Receta
class Receta(Base):
    __tablename__ = "recetas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(Text)
    ingredientes = Column(Text)
    instrucciones = Column(Text)
    tiempo_minutos = Column(Integer)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))

    usuario = relationship("Usuario", back_populates="recetas")
