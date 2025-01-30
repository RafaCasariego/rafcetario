"""
Esquemas de Pydantic para validación de datos en las solicitudes y respuestas
"""

from pydantic import BaseModel, EmailStr

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


# Esquema para crear un usuario
class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str


# Esquema para devolver la info de un usuario (excepto la contraseña)
class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr

    class Config:
        from_attributes = True # Permite convertir SQLAlchemy a Pydantic


# Esquema para el login del usuario
class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str