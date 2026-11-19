[README (1).md](https://github.com/user-attachments/files/35063262/README.1.md)
# Ferretería D'todo · Web pública

Página web estática del negocio, independiente del sistema **Caja D'todo**. No necesita servidor ni base de datos.

## Probarla

Descomprime el ZIP y abre `index.html` con doble clic. Necesita internet para cargar las tipografías y el mapa.

## Estructura

```
ferreteria-dtodo-web/
├── index.html        Estructura de la página
├── css/styles.css    Estilos (colores acero y amarillo obra)
├── js/
│   ├── config.js     Datos del negocio (único archivo que debes editar)
│   ├── catalog.js    Catálogo público (nombre, categoría y precio)
│   └── main.js       Carrusel, catálogo, pagos y mapa
├── images/           Ilustraciones del carrusel y logo
└── LEEME.txt
```

## Cambiar los datos

Todo se edita en `js/config.js`. Si un dato queda vacío (`""`), esa parte se oculta sola.

| Campo | Estado | Qué poner |
|---|---|---|
| `whatsapp` | Listo | `51934420700` |
| `pagos.yape.numero` | Listo | `934420700` |
| `pagos.yape.titular` | Pendiente | Nombre del titular del Yape |
| `pagos.plin` | Pendiente | Número y titular de Plin |
| `pagos.yapeQR` | Pendiente | Ruta del QR, ej. `images/qr-yape.png` |
| `direccion` | Revisar | Es la dirección fiscal de SUNAT; confirma que sea la de la tienda |
| `horario` | Pendiente | Ej. `Lunes a sábado, 7:00 a. m. a 7:00 p. m.` |
| `redes` | Pendiente | Enlaces de Facebook, Instagram y TikTok |
| `mapaEmbed` | Opcional | Enlace de «Insertar un mapa» de Google Maps |
| `mostrarPrecios` | Listo | `true` muestra precios; `false` muestra «Consultar» |

## Fotos reales en el carrusel

El carrusel cambia cada 3 segundos. Mientras no pongas fotos, usa las ilustraciones incluidas.

1. Copia tus fotos a la carpeta `images/`.
2. En `config.js`, completa `fotosCarrusel`:

```js
fotosCarrusel: [
  { src: "images/tienda1.jpg", titulo: "Nuestra tienda", sub: "Atención de lunes a sábado" },
  { src: "images/tienda2.jpg", titulo: "Gasfitería", sub: "Tubos, codos y llaves" }
]
```

## Catálogo

`js/catalog.js` se generó desde el sistema Caja D'todo y solo contiene nombre, categoría y precio de venta. No incluye costos, márgenes, stock ni proveedores. Para actualizar un precio, edita el valor `precio` del producto en ese archivo.

## Publicar gratis

- **Netlify Drop:** entra a `app.netlify.com/drop` y arrastra la carpeta `ferreteria-dtodo-web`.
- **GitHub Pages:** sube la carpeta a un repositorio y activa Pages en *Settings → Pages*.

## Datos del negocio

Ferretería D'todo S.A.C. · RUC 20611450061 · San Martín de Porres, Lima, Perú (fuente: padrón SUNAT).
