"""
Funciones para manejar las operaciones CRUD de usuarios
"""

from sqlalchemy.orm import Session
from models import Usuario
from schemas import UsuarioCreate, UsuarioLogin
from auth.security import hash_password, verify_password
from auth.jwt import crear_token


# Crea un nuevo usuario en la base de datos. Verifica si el email del usuario ya existe
# en la base de datos. Si no existe, lo añade y guarda los datos.
def crear_usuario(db: Session, usuario: UsuarioCreate):

    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()

    if usuario_existente:
        return None  # Ya existe un usuario con ese email

    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password=hash_password(usuario.password)  # Se encripta la contraseña antes de guardarla.
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario



# Busca un usuario en la base de datos por su email, y si lo encuentra lo devuelve.
def obtener_usuario_por_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()



# Similar a la función anterior, pero busca por ID en vez de por email.
def obtener_usuario_por_id(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()



#Comprueba si ya hay un usuario con ese email. Devuelve True si existe y False si no.
def verificar_usuario_existe(db: Session, email: str) -> bool:
    return db.query(Usuario).filter(Usuario.email == email).first() is not None




# Función para devolver un token JWT al usuario si la autenticación es correcta
def autenticar_usuario(db: Session, datos_login: UsuarioLogin):
    usuario = db.query(Usuario).filter(Usuario.email == datos_login.email).first()
    
    # Si el usuario no existe o la contraseña es incorrecta, devuelve None
    if not usuario or not verify_password(datos_login.password, usuario.password):
        return None  
    
    # Si las credenciales son correctas, generamos un token JWT
    access_token = crear_token({"sub": usuario.email})
    return {"access_token": access_token, "token_type": "bearer"}