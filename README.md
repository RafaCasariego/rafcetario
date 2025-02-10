# Rafcetario 🍽️

Rafcetario es una aplicación web para compartir recetas de cocina, donde los usuarios pueden explorar, buscar y ver recetas en detalle.  
**¡La API ha sido desarrollada desde cero con FastAPI!**  

---

## Características ✨

- **Exploración & Búsqueda 🔍**  
  Navega y filtra recetas por nombre o ingredientes.

- **Vista Detallada 📖**  
  Consulta el detalle completo de cada receta (imagen, ingredientes, instrucciones y tiempo de preparación).

- **Interacción Social ❤️**  
  Da like y agrega recetas a favoritos. La interfaz actualiza de forma optimista, mostrando animaciones (confeti) al interactuar.

- **Gestión de Usuarios 👤**  
  Registro, autenticación y administración de perfiles. La seguridad se implementa con JWT.

- **Subida de Archivos 🚀**  
  Las imágenes de recetas se suben a AWS S3 de forma escalable y segura.

- **Documentación & Testing 🛠️**  
  La API está documentada en Swagger y se realizan tests con Playwright.

---

## Tecnologías Utilizadas 🛠️

### Frontend
- **React** (con Vite para un desarrollo rápido) ⚡
- **Tailwind CSS** para el estilado 🎨
- **canvas-confetti** para animaciones de confeti 🎉
- **Playwright** para testing end-to-end

### Backend
- **FastAPI** (desarrollada desde cero por mí) 🚀
- **SQLAlchemy** para la gestión de la base de datos 🗄️
- **JWT** para autenticación segura 🔐
- **AWS S3** para la subida de archivos 📦
- **Swagger** para la documentación y pruebas de la API 📄

---

## Uso 🚀

- **Explora Recetas:**  
  Al ingresar a la aplicación, se muestra un grid interactivo con todas las recetas. Utiliza el buscador para filtrar por nombre o ingredientes.

- **Detalle e Interacción:**  
  Al seleccionar una receta, accede a su vista detallada, donde podrás dar like y agregar a favoritos de forma inmediata gracias a la actualización optimista de la interfaz.

- **Autenticación & Seguridad:**  
  Los usuarios se registran e inician sesión. Las operaciones sensibles se protegen mediante JWT, y las contraseñas se gestionan de forma segura.

- **Subida de Imágenes:**  
  Las imágenes se cargan a AWS S3, lo que garantiza escalabilidad y fiabilidad en el almacenamiento.

- **Documentación de la API:**  
  Consulta y prueba todos los endpoints a través de Swagger.

- **Testing:**  
  Se realizan tests automatizados con Playwright para garantizar la robustez de la aplicación.

---

## Endpoints Principales 🔗

### Recetas
- `GET /recetas` — Obtiene todas las recetas.  
- `GET /recetas/{receta_id}` — Detalle de una receta.  
- `POST /recetas` — Crea una receta (requiere autenticación).  
- `PUT /recetas/{receta_id}` — Actualiza una receta.  
- `DELETE /recetas/{receta_id}` — Elimina una receta.

### Likes & Favoritos
- `PUT /recetas/{receta_id}/like` — Alterna el estado de like.  
- `PUT /recetas/{receta_id}/favorito` — Alterna el estado de favorito.  
- `GET /recetas/{receta_id}/likes` — Retorna el total de likes.  
- `GET /usuarios/{usuario_id}/favoritos` — Obtiene las recetas favoritas del usuario.

### Usuarios
- `POST /registro` — Registro de usuarios.  
- `POST /login` — Inicio de sesión (retorna token JWT).  
- `GET /perfil` — Perfil del usuario autenticado.  
- `PUT /perfil` — Actualiza datos del usuario.  
- `DELETE /perfil` — Elimina la cuenta del usuario.

---

## Estructura del Proyecto 🗂️

- **Frontend:**  
  Contiene los componentes de React (por ejemplo, `Inicio.jsx` y `RecetaDetalle.jsx`), configuración de rutas, y archivos de configuración (Vite, Tailwind, etc.).

- **Backend:**  
  - `main.py`: Punto de entrada de la API.  
  - Módulos CRUD y endpoints (por ejemplo, `receta.py`, `favorito_like.py`, `usuario.py`).  
  - Modelos (SQLAlchemy) y esquemas (Pydantic) para la validación de datos.  
  - Configuración de la base de datos en `database.py`.  
  - Subida de archivos a AWS S3.

---

**Gracias por visitar el 'Rafcetario' :)**
👨‍💻 Autor: Rafael Casariego
📧 Contacto: rafacasariego@gmail.com
