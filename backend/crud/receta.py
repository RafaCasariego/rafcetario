from sqlalchemy.orm import Session
from models import Receta
from schemas import RecetaCreate, RecetaUpdate


# Obtener todas las recetas
def get_recetas(db: Session):
    return db.query(Receta).all()


# Crear una nueva receta
def create_receta(db: Session, receta: RecetaCreate):
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
    return nueva_receta



# Obtener una receta por ID
def get_receta_by_id(db: Session, receta_id: int):
    return db.query(Receta).filter(Receta.id == receta_id).first()



# Eliminar una receta
def delete_receta(db: Session, receta_id: int):
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if receta:
        db.delete(receta)
        db.commit()
        return receta
    return None



# Modificar una receta
def update_receta(db: Session, receta_id: int, receta_data: RecetaUpdate):
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if not receta:
        return None
    receta.nombre = receta_data.nombre
    receta.descripcion = receta_data.descripcion
    receta.ingredientes = receta_data.ingredientes
    receta.instrucciones = receta_data.instrucciones
    receta.tiempo_minutos = receta_data.tiempo_minutos
    db.commit()
    db.refresh(receta)
    return receta
