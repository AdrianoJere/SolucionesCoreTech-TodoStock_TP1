# 📦 TodoStock S.A. — Sistema de Gestión de Stock

> Segunda Entrega — Desarrollo de Sistemas Web (Back End)  
> Caso #3 · 2° E · 1C 2026 · Agencia de Habilidades para el Futuro · IFTS 29

---

## 📋 Descripción

**TodoStock S.A.** es un sistema backend para la gestión de inventario de una distribuidora mayorista de artículos de limpieza. Permite registrar productos con información de lote y vencimiento, y gestionar movimientos de ingreso y egreso de mercadería con actualización automática del stock.

En esta segunda entrega se migró la persistencia de archivos JSON a **MongoDB** mediante **Mongoose**, y se incorporó programación asincrónica con **async/await** en todos los controladores.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js | Runtime del servidor |
| Express 4 | Framework web, rutas y middlewares |
| MongoDB | Base de datos NoSQL |
| Mongoose | ODM para MongoDB |
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
│   │   └── db.js                  ← Conexión a MongoDB
│   ├── models/
│   │   ├── Producto.js            ← Schema Mongoose + virtual stockBajo
│   │   └── Movimiento.js          ← Schema Mongoose + virtual impacto
│   ├── middleware/
│   │   └── index.js               ← logger, validarProducto, validarMovimiento, manejarErrores
│   ├── controllers/
│   │   ├── productosController.js ← async/await, CRUD completo
│   │   └── movimientosController.js ← async/await, actualiza stock
│   └── routes/
│       ├── productos.js
│       ├── movimientos.js
│       └── vistas.js
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
git clone https://github.com/AdrianoJere/SolucionesCoreTech-TodoStock_TP2.git
cd SolucionesCoreTech-TodoStock_TP2
npm install
```

Crear el archivo `.env` en la raíz:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/todostock
```

Iniciar el servidor:

```bash
npm start
# o en modo desarrollo:
npm run dev
```

Abrir en: http://localhost:3000

> Requiere MongoDB instalado y corriendo localmente, o reemplazar `MONGO_URI` con una URI de MongoDB Atlas.

---

## 🔌 Endpoints API

### Productos — `/api/productos`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos?estado=activo` | Filtrar por estado |
| GET | `/api/productos/:id` | Obtener por ID |
| POST | `/api/productos` | Crear producto |
| PATCH | `/api/productos/:id/stock` | Actualizar stock |
| PATCH | `/api/productos/:id/estado` | Actualizar estado |
| DELETE | `/api/productos/:id` | Eliminar |

### Movimientos — `/api/movimientos`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/movimientos` | Listar todos |
| GET | `/api/movimientos?tipo=ingreso` | Filtrar por tipo |
| GET | `/api/movimientos?productoId=...` | Filtrar por producto |
| GET | `/api/movimientos/:id` | Obtener por ID |
| POST | `/api/movimientos` | Registrar movimiento (actualiza stock) |
| DELETE | `/api/movimientos/:id` | Eliminar |

---

## 🖥️ Vistas (Pug)

Todas las vistas utilizan el motor de plantillas **Pug 3** y extienden el layout `base.pug`, que define la estructura HTML común (header con navegación, contenido principal y footer).

| Vista | Ruta | Descripción |
|---|---|---|
| `base.pug` | — | Layout base con header, navegación, footer y meta tags |
| `index.pug` | `/` | Listado de todos los productos con resumen de stock bajo, indicador visual (🔴/✅) por producto y enlace al detalle |
| `detalleProducto.pug` | `/productos/:id` | Ficha completa del producto con alerta de stock bajo y su historial de movimientos |
| `movimientos.pug` | `/movimientos` | Listado general de todos los movimientos de stock con diferenciación visual por tipo (ingreso/egreso) |
| `error.pug` | — | Página de error con código de estado y mensaje descriptivo |

### Funcionalidades de las vistas

- **Indicador de stock bajo**: el virtual `stockBajo` de Mongoose se utiliza para mostrar alertas 🔴 en el listado y en el detalle del producto.
- **Resumen en el listado**: se muestra el total de productos y la cantidad con stock bajo.
- **Clases CSS dinámicas**: las filas de la tabla reciben clases (`stock-bajo`, `ingreso`, `egreso`) según el estado, permitiendo estilizado visual diferenciado.
- **Formato de fechas**: las fechas de vencimiento y de movimientos se formatean con `toLocaleDateString('es-AR')` para mostrar el formato argentino.

---

## 🧪 Pruebas documentadas (Thunder Client)

Se documentan las pruebas realizadas sobre la API REST utilizando **Thunder Client** (extensión de VS Code).

### Productos

| # | Método | Endpoint | Descripción | Status esperado |
|---|---|---|---|---|
| 1 | GET | `/api/productos` | Listar todos los productos | 200 |
| 2 | GET | `/api/productos?estado=activo` | Filtrar productos activos | 200 |
| 3 | POST | `/api/productos` | Crear un nuevo producto | 201 |
| 4 | GET | `/api/productos/:id` | Obtener producto por ID | 200 |
| 5 | PATCH | `/api/productos/:id/stock` | Actualizar stock de un producto | 200 |
| 6 | PATCH | `/api/productos/:id/estado` | Cambiar estado de un producto | 200 |
| 7 | DELETE | `/api/productos/:id` | Eliminar un producto | 200 |

#### Ejemplo — Crear producto (POST `/api/productos`)

```json
{
  "nombre": "Lavandina Concentrada 1L",
  "precio": 850,
  "stock": 120,
  "unidad": "litro",
  "lote": "L-2024-001",
  "vencimiento": "2026-12-01"
}
```

#### Ejemplo — Producto con stock bajo (POST `/api/productos`)

```json
{
  "nombre": "Detergente Líquido 500ml",
  "precio": 620,
  "stock": 3,
  "unidad": "unidad",
  "lote": "L-2024-010",
  "vencimiento": "2026-08-15"
}
```

### Movimientos

| # | Método | Endpoint | Descripción | Status esperado |
|---|---|---|---|---|
| 1 | GET | `/api/movimientos` | Listar todos los movimientos | 200 |
| 2 | GET | `/api/movimientos?tipo=ingreso` | Filtrar movimientos de ingreso | 200 |
| 3 | GET | `/api/movimientos?tipo=egreso` | Filtrar movimientos de egreso | 200 |
| 4 | GET | `/api/movimientos?productoId=...` | Filtrar movimientos por producto | 200 |
| 5 | POST | `/api/movimientos` | Registrar un movimiento (actualiza stock) | 201 |
| 6 | GET | `/api/movimientos/:id` | Obtener movimiento por ID | 200 |
| 7 | DELETE | `/api/movimientos/:id` | Eliminar un movimiento | 200 |

#### Ejemplo — Registrar ingreso (POST `/api/movimientos`)

```json
{
  "productoId": "<ID_DEL_PRODUCTO>",
  "tipo": "ingreso",
  "cantidad": 50,
  "motivo": "Reposición de stock mensual"
}
```

#### Ejemplo — Registrar egreso (POST `/api/movimientos`)

```json
{
  "productoId": "<ID_DEL_PRODUCTO>",
  "tipo": "egreso",
  "cantidad": 10,
  "motivo": "Venta a cliente minorista"
}
```

### Pruebas de stock bajo

Para verificar el funcionamiento del virtual `stockBajo`, se crearon productos con valores de stock bajos:

| Producto | Stock | stockBajo |
|---|---|---|
| Lavandina Concentrada 1L | 120 | ❌ No |
| Detergente Líquido 500ml | 3 | ✅ Sí |
| Jabón en Polvo 800g | 5 | ✅ Sí |
| Desinfectante Multiuso 750ml | 8 | ✅ Sí |

---

## 👥 Integrantes

| Integrante | Rol |
|---|---|
| Adriano Caloni | Líder / Backend — configuración, app.js, conexión MongoDB, integración |
| Emiliano Gutierrez | Modelos / Datos — Schemas Mongoose, virtuals, validaciones |
| Jeremias Imperiales | Vistas / Documentación — Pug, ThunderClient, informe |

---

## 📚 Bibliografía

- [Documentación oficial Node.js](https://nodejs.org/es/docs/)
- [Documentación oficial Express](https://expressjs.com/es/)
- [Documentación oficial Mongoose](https://mongoosejs.com/docs/)
- [Documentación oficial MongoDB](https://www.mongodb.com/docs/)
- [Documentación oficial Pug](https://pugjs.org/)
- [Fazt Code — MongoDB y Mongoose con Node.js](https://www.youtube.com/@FaztCode)
- [MitoCode — Node.js + Express + MongoDB](https://www.youtube.com/@MitoCode)
