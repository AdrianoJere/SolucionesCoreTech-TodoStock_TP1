# 📦 TodoStock S.A. — Sistema de Gestión de Stock

> Primer Parcial — Desarrollo de Sistemas Web (Back End)  
> Caso #3 · 2° E · 1C 2026 · IFTS 29

---

## 📋 Descripción

**TodoStock S.A.** es un sistema backend para la gestión de inventario de una distribuidora mayorista de artículos de limpieza. Permite registrar productos con información de lote y vencimiento, y gestionar movimientos de ingreso y egreso de mercadería con actualización automática del stock.

Desarrollado con **Node.js** y **Express**, aplica los contenidos de los módulos D4 (POO con JavaScript), D5 (Fundamentos de Node.js) y D6 (Introducción a Express).

---

## 🚀 Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js | Runtime del servidor |
| Express 4 | Framework web, rutas y middlewares |
| Pug 3 | Motor de plantillas HTML |
| dotenv | Variables de entorno |
| JSON (fs) | Persistencia de datos |

---

## 📁 Estructura del proyecto

```
todostock/
├── public/
│   └── css/style.css
├── src/
│   ├── app.js
│   ├── data/
│   │   ├── productos.json
│   │   └── movimientos.json
│   ├── models/
│   │   ├── Producto.js        ← POO: props privadas, getters, stockBajo
│   │   └── Movimiento.js      ← Herencia: Movimiento extends Registro
│   ├── middleware/
│   │   └── index.js           ← logger, validarProducto, validarMovimiento
│   ├── controllers/
│   │   ├── productosController.js
│   │   └── movimientosController.js
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
git clone https://github.com/AdrianoJere/SolucionesCoreTech-TodoStock_TP1.git
cd SolucionesCoreTech-TodoStock_TP1
npm install
npm start
```

Abrir en: [http://localhost:3000](http://localhost:3000)

---

## 🔌 Endpoints API

### Productos — `/api/productos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos?estado=activo` | Filtrar por estado |
| GET | `/api/productos/:id` | Obtener por ID |
| POST | `/api/productos` | Crear producto |
| PATCH | `/api/productos/:id/stock` | Actualizar stock |
| PATCH | `/api/productos/:id/estado` | Actualizar estado |
| DELETE | `/api/productos/:id` | Eliminar |

### Movimientos — `/api/movimientos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/movimientos` | Listar todos |
| GET | `/api/movimientos?tipo=ingreso` | Filtrar por tipo |
| GET | `/api/movimientos?productoId=1` | Filtrar por producto |
| GET | `/api/movimientos/:id` | Obtener por ID |
| POST | `/api/movimientos` | Registrar movimiento (actualiza stock) |
| DELETE | `/api/movimientos/:id` | Eliminar |

---

## 🧪 Ejemplos de uso

**Crear producto:**
```json
POST /api/productos
{ "nombre": "Desinfectante 1L", "precio": 750, "stock": 40,
  "unidad": "litro", "lote": "L-2024-010", "vencimiento": "2027-01-15" }
```

**Registrar ingreso:**
```json
POST /api/movimientos
{ "productoId": 1, "tipo": "ingreso", "cantidad": 50, "motivo": "Compra a proveedor" }
```

**Registrar egreso:**
```json
POST /api/movimientos
{ "productoId": 2, "tipo": "egreso", "cantidad": 10, "motivo": "Despacho cliente" }
```

> ⚠️ Si el egreso supera el stock disponible → `400 Bad Request`

---

## 👥 Integrantes

| Integrante | Rol |
|---|---|
| Adriano Caloni | Líder / Backend |
| Emiliano Gutierrez | Modelos / Datos |
| Jeremias Imperiales | Vistas / Documentación |

---

## 📚 Bibliografía

- [Documentación oficial Node.js](https://nodejs.org/es/docs/)
- [Documentación oficial Express](https://expressjs.com/es/)
- [Documentación oficial Pug](https://pugjs.org/)
- [MDN — Clases en JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes)
- [Fazt Code — Node.js y Express](https://www.youtube.com/@FaztCode)
