from databases import Database
import os
from dotenv import load_dotenv

load_dotenv()

# Aquí se obtiene la URL de la base de datos desde el archivo .env
DATABASE_URL = os.getenv("DATABASE_URL")

database = Database(DATABASE_URL)

# Funciones para conectar y desconectar la base de datos
async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()
