<div align="center"> 

# 🍽️ Kitchen Manager — Frontend
### *Interfaz de gestión para ghost kitchens*

Panel de administración, control de pedidos en tiempo real, portal QR para clientes y vista de cocina. Todo en un solo sistema desplegado en producción.

<img src="https://img.shields.io/badge/STATUS-PRODUCTION--READY-brightgreen?style=for-the-badge&logo=checkmarx"/>
<img src="https://img.shields.io/badge/VERSION-1.0.0-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/VITE-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/VERCEL-DEPLOYED-black?style=for-the-badge&logo=vercel"/>

</div>

---

## ⚡ Stack

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 🖥️ Vistas del sistema

| Vista | Ruta | Acceso |
|-------|------|--------|
| 🏠 Landing | `/` | Público |
| 🔐 Login | `/login` | Público |
| 👑 Panel Admin | `/admin` | ADMIN |
| 👨‍🍳 Panel Empleado | `/empleado` | EMPLEADO |
| 🧑‍🍽️ Vista Mesero | `/mesero` | Por nombre |
| 📱 Portal QR Cliente | `/menu/:token` | Público |
| 📺 Cocina TV | `/cocina` | Público |
| 📍 Seguimiento | `/seguimiento/:id` | Público |

---

## 🚀 Funcionalidades principales

| Módulo | Descripción |
|--------|-------------|
| 📊 Dashboard | Estadísticas generales y ventas recientes |
| 🍽️ Menú | CRUD con imágenes, categorías y filtros |
| 📦 Kanban | Gestión visual de pedidos por estado |
| 💰 Ventas | Historial con filtros, exportación Excel y facturas HTML |
| 📱 Portal QR | Carrito, selección de mesero y confirmación |
| 🤖 Predicción IA | Ranking de demanda por plato con modelo Weka |
| ✨ Chat IA | Asistente Gemini para consultas del negocio |
| 📊 Análisis | Platos estrella vs platos de baja rotación |

---

## ⚙️ Configuración

```js
// src/axiosConfig.js — interceptor JWT automático
const BASE = "https://kitchen-manager-back.onrender.com";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes("/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🛠️ Ejecutar localmente

```bash
git clone https://github.com/JuanBarriosS/kitchen-manager-front
cd kitchen-manager-front
npm install
npm run dev
```

> La app corre en `http://localhost:5173`

---

## 🌐 Producción

| Servicio | URL |
|----------|-----|
| Frontend | `https://kitchen-manager-front.vercel.app` |
| Backend | `https://kitchen-manager-back.onrender.com` |

---

## 📁 Estructura

```
src/
├── components/
│   ├── Admin.jsx         → Panel administrador
│   ├── Empleado.jsx      → Panel empleado + kanban
│   ├── MeseroView.jsx    → Vista móvil mesero
│   ├── Clientes.jsx      → Portal QR clientes
│   ├── CocinaTV.jsx      → Pantalla cocina
│   ├── Login.jsx         → Autenticación
│   └── SeguimientoPedido.jsx
├── axiosConfig.js        → Interceptor JWT
└── App.jsx               → Enrutador principal
```

---

<div align="center">

**Juan Barrios**  
Tecnológico Comfenalco · Ingeniería de Sistemas · 2026

</div>
