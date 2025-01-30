from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import crud.receta as crud_receta
from schemas import RecetaCreate, RecetaUpdate

# Crear la base de datos
Base.metadata.create_all(bind=engine)

# Instancia de FastAPI
app = FastAPI()

# Obtener todas las recetas
@app.get("/recetas")
async def mostrar_recetas(db: Session = Depends(get_db)):
    return crud_receta.get_recetas(db)

# Crear una receta
@app.post("/recetas")
async def crear_receta(receta: RecetaCreate, db: Session = Depends(get_db)):
    return crud_receta.create_receta(db, receta)

# Obtener una receta por ID
@app.get("/recetas/{receta_id}")
async def mostrar_receta(receta_id: int, db: Session = Depends(get_db)):
    receta = crud_receta.get_receta_by_id(db, receta_id)
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta

# Modificar una receta
@app.put("/recetas/{receta_id}")
async def modificar_receta(receta_id: int, receta: RecetaUpdate, db: Session = Depends(get_db)):
    receta_actualizada = crud_receta.update_receta(db, receta_id, receta)
    if not receta_actualizada:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta_actualizada

# Eliminar una receta
@app.delete("/recetas/{receta_id}")
async def eliminar_receta(receta_id: int, db: Session = Depends(get_db)):
    receta_eliminada = crud_receta.delete_receta(db, receta_id)
    if not receta_eliminada:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return {"mensaje": f"Receta {receta_eliminada.nombre} eliminada con éxito"}
