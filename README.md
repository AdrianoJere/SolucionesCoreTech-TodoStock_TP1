# 📦 TodoStock S.A. — Sistema de Gestión de Stock

> Entrega Final — Desarrollo de Sistemas Web (Back End)  
> Caso #3 · 2° E · 1C 2026 · Agencia de Habilidades para el Futuro · IFTS 29

---

## 📋 Descripción

**TodoStock S.A.** es un sistema backend para la gestión de inventario de una distribuidora mayorista de artículos de limpieza. Permite registrar productos con información de lote y vencimiento, y gestionar movimientos de ingreso y egreso de mercadería con actualización automática del stock.

En esta entrega final se incorporó **autenticación con JWT**, se realizó el **despliegue en Render con MongoDB Atlas**, y se mejoró la estructura general del proyecto siguiendo el patrón MVC.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js | Runtime del servidor |
| Express 4 | Framework web, rutas y middlewares |
| MongoDB Atlas | Base de datos NoSQL en la nube |
| Mongoose | ODM para MongoDB |
| JSON Web Token | Autenticación stateless |
| bcryptjs | Hash seguro de contraseñas |
| Pug 3 | Motor de plantillas HTML |
| dotenv | Variables de entorno |

---

## 📁 Estructura del proyecto

```
todostock/
├── public/
│   └── css/style.css
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js                    ← Conexión a MongoDB
│   ├── models/
│   │   ├── Producto.js              ← Schema Mongoose + virtual stockBajo
│   │   ├── Movimiento.js            ← Schema Mongoose + virtual impacto
│   │   └── Usuario.js               ← Schema con hash de password ← NUEVO
│   ├── middleware/
│   │   ├── index.js                 ← logger, validaciones, manejarErrores
│   │   └── auth.js                  ← verifyToken, soloAdmin ← NUEVO
│   ├── controllers/
│   │   ├── productosController.js
│   │   ├── movimientosController.js
│   │   └── authController.js        ← register, login, perfil ← NUEVO
│   └── routes/
│       ├── productos.js
│       ├── movimientos.js
│       ├── vistas.js
│       └── auth.js                  ← /api/auth ← NUEVO
└── views/
    ├── layouts/base.pug
    └── pages/
        ├── index.pug
        ├── detalleProducto.pug
        ├── movimientos.pug
        └── error.pug
```

---

## ⚙️ Instalación y ejecución

```bash
git clone https://github.com/AdrianoJere/SolucionesCoreTech-TodoStock_TP1.git
cd SolucionesCoreTech-TodoStock_TP1
npm install
```

Crear el archivo `.env` en la raíz:

```
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/todostock
JWT_SECRET=todostock_clave_secreta_muy_larga_2026
JWT_EXPIRES_IN=8h
```

Iniciar el servidor:

```bash
npm start
# o en modo desarrollo:
npm run dev
```

Abrir en: http://localhost:3000

---

## 🔐 Autenticación con JWT

Las rutas de la API requieren un token JWT válido en el header:

```
Authorization: Bearer <token>
```

**Flujo:**
1. Registrarse en `POST /api/auth/register`
2. Hacer login en `POST /api/auth/login` → se obtiene el token
3. Incluir el token en todas las requests a `/api/productos` y `/api/movimientos`

**Roles disponibles:** `admin` y `operador`

---

## 🔌 Endpoints API

### Autenticación — `/api/auth`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Registrar usuario |
| POST | `/api/auth/login` | ❌ | Login → devuelve token |
| GET | `/api/auth/perfil` | ✅ | Ver perfil del usuario logueado |

### Productos — `/api/productos` *(requieren token)*

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos?estado=activo` | Filtrar por estado |
| GET | `/api/productos/:id` | Obtener por ID |
| POST | `/api/productos` | Crear producto |
| PATCH | `/api/productos/:id/stock` | Actualizar stock |
| PATCH | `/api/productos/:id/estado` | Actualizar estado |
| DELETE | `/api/productos/:id` | Eliminar |

### Movimientos — `/api/movimientos` *(requieren token)*

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/movimientos` | Listar todos |
| GET | `/api/movimientos?tipo=ingreso` | Filtrar por tipo |
| GET | `/api/movimientos?productoId=...` | Filtrar por producto |
| GET | `/api/movimientos/:id` | Obtener por ID |
| POST | `/api/movimientos` | Registrar movimiento |
| DELETE | `/api/movimientos/:id` | Eliminar |

---

## 🗂️ Diagramas

Los diagramas de análisis y diseño del sistema se encuentran en la carpeta [`/diagramas`](./diagramas):

| Diagrama | Archivo |
|---|---|
| Casos de Uso | [Diagrama de Casos de Uso.png](./diagramas/Diagrama%20de%20Casos%20de%20Uso.png) |
| Clases | [Diagrama de Clases.png](./diagramas/Diagrama%20de%20Clases.png) |
| Secuencia | [Diagrama de Secuencia - Request autenticada.png](./diagramas/Diagrama%20de%20Secuencia%20-%20Request%20autenticada.png) |
| Modelo ER | [Modelo ER (Entidad-Relación).png](./diagramas/Modelo%20ER%20(Entidad-Relaci%C3%B3n).png) |

> Los diagramas de casos de uso, clases y modelo ER fueron realizados con draw.io. El diagrama de secuencia fue generado con PlantUML.

---

## 🌐 Producción

La aplicación está desplegada en Render con MongoDB Atlas:

🔗 **https://solucionescoretech-todostock-tp1.onrender.com**

> En el plan gratuito de Render el servidor entra en reposo tras 15 minutos de inactividad. La primera request puede tardar hasta 30 segundos.

---

## 👥 Integrantes

| Integrante | Rol |
|---|---|
| Adriano Caloni | Líder / Backend — configuración, app.js, autenticación JWT, despliegue |
| Emiliano Gutierrez | Modelos / Datos — Schemas Mongoose, virtuals, validaciones |
| Jeremias Imperiales | Vistas / Documentación — Pug, ThunderClient, informe, video |

---

## 📚 Bibliografía

- [Documentación oficial Node.js](https://nodejs.org/es/docs/)
- [Documentación oficial Express](https://expressjs.com/es/)
- [Documentación oficial Mongoose](https://mongoosejs.com/docs/)
- [Documentación oficial MongoDB](https://www.mongodb.com/docs/)
- [Documentación oficial JWT](https://jwt.io/introduction)
- [Documentación oficial Pug](https://pugjs.org/)
- [Fazt Code — MongoDB y Mongoose con Node.js](https://www.youtube.com/@FaztCode)
- [MitoCode — Node.js + Express + MongoDB](https://www.youtube.com/@MitoCode)
