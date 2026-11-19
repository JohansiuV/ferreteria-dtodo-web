/* ============================================================
   CONFIGURACIÓN DE LA WEB · Ferretería D'todo
   Edita SOLO este archivo para cambiar datos de contacto.
   Si dejas un dato vacío ("") esa parte se oculta sola.
   ============================================================ */
window.DTODO = {
  negocio: {
    nombre: "Ferretería D'todo",
    razonSocial: "Ferretería D'todo S.A.C.",
    ruc: "20611450061", // Fuente: padrón SUNAT
    distrito: "San Martín de Porres, Lima"
  },

  // WhatsApp: código de país + número, sin espacios ni signos
  whatsapp: "51934420700",
  mensajeWhatsapp: "Hola D'todo, quisiera hacer una consulta.",

  // Formas de pago (deja numero:"" para ocultar un medio)
  pagos: {
    efectivo: true,
    yape: { numero: "934420700", titular: "" }, // TODO: nombre del titular
    plin: { numero: "", titular: "" }, // TODO: número de Plin
    fiado: true,
    yapeQR: "" // ej: "images/qr-yape.png"
  },

  // Ubicación. La dirección es la fiscal de SUNAT: confirma que sea la de la tienda.
  direccion: "Lote 7 Mz. A, Urb. San Nicolás, San Martín de Porres, Lima",
  horario: "", // TODO: ej "Lunes a sábado, 7:00 a. m. a 7:00 p. m."
  mapaEmbed: "", // opcional: pega aquí el enlace de "Insertar un mapa" de Google Maps

  // Redes (vacío = no se muestra)
  redes: { facebook: "", instagram: "", tiktok: "" },

  // Precios del catálogo: true = muestra precio · false = "Consulta por WhatsApp"
  mostrarPrecios: true,

  // Fotos reales para el carrusel del inicio (si está vacío se usan las ilustraciones)
  // ej: [{ src: "images/tienda1.jpg", titulo: "Nuestra tienda" }]
  fotosCarrusel: []
};
