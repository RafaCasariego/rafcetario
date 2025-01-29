Rafcetario API 🍽️
API RESTful para gestionar recetas de cocina, desarrollada con FastAPI y Playwright para testing.


📌 Características
✅ CRUD de recetas (crear, leer, actualizar, eliminar).
✅ Base de datos con MySQL (o PostgreSQL).
✅ Autenticación con JWT (OAuth2).
✅ Pruebas automáticas con Playwright y pytest.
✅ Documentación automática con Swagger.


🏗️ Tecnologías usadas
🔹 FastAPI (Backend)
🔹 SQLAlchemy (Base de datos)
🔹 Uvicorn (Servidor ASGI)
🔹 Playwright (Testing de frontend)
🔹 Swagger (Documentación interactiva)

Documentación de la API: http://127.0.0.1:8000/docs


🛠️ Testing

Para ejecutar las pruebas:
pytest backend/tests/  
npx playwright test frontend/tests/  


📜 Endpoints de la API

-----------------------------------------------------------------------------
Método	        Endpoint	        Descripción
-----------------------------------------------------------------------------
GET	            /recetas	        Obtener todas las recetas
GET	            /recetas/{id}	    Obtener una receta por ID
POST	        /recetas	        Crear una nueva receta (requiere login)
PUT	            /recetas/{id}	    Modificar una receta (solo el autor de la receta)
DELETE	        /recetas/{id}	    Eliminar una receta (solo el autor de la receta)
-----------------------------------------------------------------------------


🔒 Autenticación
Registro y login con JWT Tokens.
Los usuarios pueden crear, modificar y eliminar solo sus propias recetas.


👨‍💻 Autor
👤 Rafael Casariego
📧 Contacto: rafacasariego@gmail.com