
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import sessionmaker, Session, declarative_base, relationship
from pydantic import BaseModel
from dotenv import load_dotenv
import os

import mysql.connector
from mysql.connector import Error

# Cargar las variables de entorno
load_dotenv()

# Crear la instancia de FastAPI
app = FastAPI()


# CONFIGURACIÓN DE LA BASE DE DATOS
#------------------------------------------------------------------------

# Obtener la URL de la base de datos desde el archivo .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el motor de la base de datos
engine = create_engine(DATABASE_URL)

# Crear la sesión: sessionmaker gestiona las transacciones con la base de datos. 
# `autocommit=False` evita confirmaciones automáticas, y `autoflush=False` evita sincronizar los cambios automáticamente.
# `bind=engine` vincula la sesión al motor de la base de datos.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear la clase base para los modelos de la base de datos
Base = declarative_base()

# Modelo de Usuario en la base de datos
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Asumiendo que usarás un campo de contraseña (encriptada)

    # Relación con Recetas
    recetas = relationship("Receta", back_populates="usuario")

# Modelo de la receta en la base de datos
class Receta(Base):
    __tablename__ = "recetas"  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, index=True)  # Columna ID
    nombre = Column(String, index=True)  # Columna nombre
    descripcion = Column(Text)  # Columna descripción
    ingredientes = Column(Text)  # Columna ingredientes
    instrucciones = Column(Text)  # Columna instrucciones
    tiempo_minutos = Column(Integer)  # Columna tiempo en minutos
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))  # Clave foránea para usuario

    # Relación inversa con Usuario
    usuario = relationship("Usuario", back_populates="recetas")

#------------------------------------------------------------------------


# CONFIGURACIÓN DE LA API, ENDPOINTS
#------------------------------------------------------------------------

# Pydantic schema para crear una receta
class RecetaCreate(BaseModel):
    nombre: str
    descripcion: str
    ingredientes: str
    instrucciones: str
    tiempo_minutos: int

# Esquema para actualizar una receta (solo los campos modificables)
class RecetaUpdate(BaseModel):
    nombre: str
    descripcion: str
    ingredientes: str
    instrucciones: str
    tiempo_minutos: int


# Endpoint para obtener todas las recetas
@app.get("/recetas")
async def mostrar_recetas(db: Session = Depends(get_db)):
    recetas = db.query(Receta).all()
    return recetas


# Endpoint para crear una nueva receta
@app.post("/recetas")
async def crear_receta(receta: RecetaCreate, db: Session = Depends(get_db)):
    # Crear una instancia del modelo Receta en la base de datos
    nueva_receta = Receta(
        nombre=receta.nombre,
        descripcion=receta.descripcion,
        ingredientes=receta.ingredientes,
        instrucciones=receta.instrucciones,
        tiempo_minutos=receta.tiempo_minutos
    )
    db.add(nueva_receta)
    db.commit()
    db.refresh(nueva_receta)

    return {"mensaje": "Receta creada con éxito!", "receta": nueva_receta}


# Endpoint para obtener una receta por su ID
@app.get("/recetas/{receta_id}")
async def mostrar_receta(receta_id: int, db: Session = Depends(get_db)):
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if receta:
        return receta
    return {"mensaje": "Receta no encontrada"}

# Endpoint para eliminar una receta por su ID
@app.delete("/recetas/{receta_id}")
async def eliminar_receta(receta_id: int, db: Session = Depends(get_db)):
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if receta:
        db.delete(receta)
        db.commit()
        return {"mensaje": f"Receta {receta.nombre} eliminada con éxito"}
    return {"mensaje": "Receta no encontrada"}


# Endpoint para modificar una receta por su ID
@app.put("/recetas/{receta_id}")
async def modificar_receta(
    receta_id: int, 
    receta: RecetaUpdate, 
    db: Session = Depends(get_db)
):
    # Buscar la receta por su ID
    receta_existente = db.query(Receta).filter(Receta.id == receta_id).first()
    
    # Si no encontramos la receta, devolvemos un error
    if not receta_existente:
        return {"mensaje": "Receta no encontrada"}
    
    # Si la receta existe, actualizamos los campos
    receta_existente.nombre = receta.nombre
    receta_existente.descripcion = receta.descripcion
    receta_existente.ingredientes = receta.ingredientes
    receta_existente.instrucciones = receta.instrucciones
    receta_existente.tiempo_minutos = receta.tiempo_minutos
    
    # Guardar los cambios en la base de datos
    db.commit()
    db.refresh(receta_existente)  # Actualiza el objeto con los nuevos valores
    
    return {"mensaje": f"Receta {receta_existente.nombre} actualizada con éxito", "receta": receta_existente}

#------------------------------------------------------------------------


