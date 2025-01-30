"""
Punto de entrada de la API, donde se definen las rutas y se inicia la app
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import crud.receta as crud_receta
from schemas import RecetaCreate, RecetaUpdate, UsuarioLogin, UsuarioCreate
from crud.usuario import autenticar_usuario, crear_usuario, obtener_usuario_por_email
from models import Receta
from auth.jwt import obtener_usuario_actual, crear_token
from auth.security import verify_password


# Crear la base de datos
Base.metadata.create_all(bind=engine)


# Instancia de FastAPI
app = FastAPI()



# Endpoint para btener todas las recetas (No requiere autenticación)
@app.get("/recetas")
async def mostrar_recetas(db: Session = Depends(get_db)):
    return crud_receta.get_recetas(db)



# Endpoint para crear una nueva receta (requiere autenticación)
@app.post("/recetas", status_code=status.HTTP_201_CREATED)
async def crear_receta(
    receta: RecetaCreate,
    usuario_actual: dict = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud_receta.create_receta(db, receta, usuario_actual)



# Endpoint para obtener una receta por ID (No requiere autenticación)
@app.get("/recetas/{receta_id}")
async def mostrar_receta(receta_id: int, db: Session = Depends(get_db)):
    receta = crud_receta.get_receta_by_id(db, receta_id)
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta



# Endpoint para modificar una receta (solo el dueño puede hacerlo)
@app.put("/recetas/{receta_id}")
async def modificar_receta(
    receta_id: int,
    receta: RecetaUpdate,
    usuario_actual: dict = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud_receta.modificar_receta(db, receta_id, receta, usuario_actual)



# Endpoint para eliminar una receta (solo el dueño puede hacerlo)
@app.delete("/recetas/{receta_id}")
async def eliminar_receta(
    receta_id: int,
    usuario_actual: dict = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud_receta.eliminar_receta(db, receta_id, usuario_actual)



# Registrar un nuevo usuario
@app.post("/registro")
async def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    usuario_creado = crear_usuario(db, usuario)
    
    if not usuario_creado:
        raise HTTPException(status_code=400, detail="El usuario ya existe con ese email")

    return {"mensaje": "Usuario creado con éxito", "usuario": usuario_creado}



# Iniciar sesión. Devuelve un token JWT si las credenciales son correctas.
@app.post("/login")
async def login(datos_login: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = obtener_usuario_por_email(db, datos_login.username)  # Ojo, aquí usamos `username`, no `email`
    
    if not usuario or not verify_password(datos_login.password, usuario.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = crear_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}
