"""
Punto de entrada de la API, donde se definen las rutas y se inicia la app
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import crud.receta
from schemas import RecetaCreate, RecetaUpdate, UsuarioLogin, UsuarioCreate, UsuarioResponse, UsuarioUpdate
import crud.usuario
from models import Receta, Usuario
from auth.jwt import obtener_usuario_actual, crear_token
from auth.security import verify_password
import crud.favorito_like


# Crear la base de datos
Base.metadata.create_all(bind=engine)


# Instancia de FastAPI
app = FastAPI()




"""********************** ENDPOINTS DE LAS RECETAS **********************"""



# Endpoint para buscar recetas concretas por su nombre, ingredientes o timepo de prep.
@app.get("/recetas/buscar")
async def buscar_recetas(
    nombre: str = None,
    ingredientes: str = None,
    tiempo_max: int = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit  # Calcular desde qué receta empezar
    recetas = crud.receta.buscar_recetas(db, nombre, ingredientes, tiempo_max, skip, limit)
    
    return {"total": len(recetas), "page": page, "recetas": recetas}



# Endpoint para btener todas las recetas (No requiere autenticación)
@app.get("/recetas")
async def mostrar_recetas(db: Session = Depends(get_db)):
    return crud.receta.get_recetas(db)



# Endpoint para crear una nueva receta (requiere autenticación)
@app.post("/recetas", status_code=status.HTTP_201_CREATED)
async def crear_receta(
    receta: RecetaCreate,
    usuario_actual: dict = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud.receta.create_receta(db, receta, usuario_actual)



# Endpoint para obtener una receta por ID (No requiere autenticación)
@app.get("/recetas/{receta_id}")
async def mostrar_receta(receta_id: int, db: Session = Depends(get_db)):
    receta = crud.receta.get_receta_by_id(db, receta_id)
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
    return crud.receta.modificar_receta(db, receta_id, receta, usuario_actual)



# Endpoint para eliminar una receta (solo el dueño puede hacerlo)
@app.delete("/recetas/{receta_id}")
async def eliminar_receta(
    receta_id: int,
    usuario_actual: dict = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud.receta.eliminar_receta(db, receta_id, usuario_actual)




"""********************** ENDPOINTS DE LOS USUARIOS **********************"""



# Registrar un nuevo usuario
@app.post("/registro")
async def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    usuario_creado = crud.usuario.crear_usuario(db, usuario)
    
    if not usuario_creado:
        raise HTTPException(status_code=400, detail="El usuario ya existe con ese email")

    return {"mensaje": "Usuario creado con éxito", "usuario": usuario_creado}



# Iniciar sesión. Devuelve un token JWT si las credenciales son correctas.
@app.post("/login")
async def login(datos_login: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = crud.usuario.obtener_usuario_por_email(db, datos_login.username)  # Ojo, aquí usamos `username`, no `email`
    
    if not usuario or not verify_password(datos_login.password, usuario.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = crear_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}



# Endpoint para obtener el perfil del usuario autenticado
@app.get("/perfil", response_model=UsuarioResponse)
async def perfil_usuario(usuario_actual: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)):
    return crud.usuario.obtener_perfil_usuario(db, usuario_actual)



# Endpoint para que el usuario autenticado pueda modificar sus datos personales
@app.put("/perfil", response_model=UsuarioResponse)
async def actualizar_perfil(
    datos_actualizados: UsuarioUpdate,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    return crud.usuario.actualizar_usuario(db, usuario_actual, datos_actualizados)



# Endpoint para que un usuario autenticado elimine su cuenta y recetas asociadas
@app.delete("/perfil", status_code=status.HTTP_200_OK)
async def eliminar_cuenta_usuario(
    usuario_actual: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)
):
    return crud.usuario.eliminar_cuenta(db, usuario_actual)



# Endpoint para que un usuario autenticado cambie su contraseña
@app.put("/perfil/cambiar_contraseña", status_code=status.HTTP_200_OK)
async def cambiar_contraseña_usuario(
    contraseña_actual: str,
    nueva_contraseña: str,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud.usuario.cambiar_contraseña(db, usuario_actual, contraseña_actual, nueva_contraseña)




"""********************** ENDPOINTS DE LOS FAVORITOS/LIKES **********************"""



# Marcar o quitar una receta de favoritos
@app.put("/recetas/{receta_id}/favorito")
async def toggle_favorito(
    receta_id: int,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud.favorito_like.toggle_favorito(db, usuario_actual.id, receta_id)



# Marcar o quitar un like en una receta
@app.put("/recetas/{receta_id}/like")
async def toggle_like(
    receta_id: int,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return crud.favorito_like.toggle_like(db, usuario_actual.id, receta_id)



# Obtener las recetas favoritas del usuario autenticado
@app.get("/usuarios/{usuario_id}/favoritos")
async def obtener_favoritos(usuario_id: int, db: Session = Depends(get_db)):
    return crud.favorito_like.obtener_favoritos(db, usuario_id)




# Obtener el total de likes de una receta
@app.get("/recetas/{receta_id}/likes")
async def contar_likes(receta_id: int, db: Session = Depends(get_db)):
    return crud.favorito_like.contar_likes(db, receta_id)