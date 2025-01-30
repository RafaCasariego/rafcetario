from pydantic import BaseModel

# Esquema para crear una receta
class RecetaCreate(BaseModel):
    nombre: str
    descripcion: str
    ingredientes: str
    instrucciones: str
    tiempo_minutos: int

# Esquema para actualizar una receta
class RecetaUpdate(BaseModel):
    nombre: str
    descripcion: str
    ingredientes: str
    instrucciones: str
    tiempo_minutos: int
