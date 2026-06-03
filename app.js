// CONFIGURACIÓN: Coloca aquí el número de WhatsApp del negocio (con código de país, 57 para Colombia)
const TELEFONO_NEGOCIO = "573123780870"; 

document.addEventListener("DOMContentLoaded", () => {
    const botonesPedido = document.querySelectorAll(".btn-order");

    botonesPedido.forEach(boton => {
        boton.addEventListener("click", (e) => {
            // Obtener datos del producto desde los atributos "data-" del HTML
            const nombreProducto = e.target.getAttribute("onclick");
            const precioProducto = e.target.getAttribute("onclick");

            // Redactar el mensaje automático optimizado para el comerciante
            const mensaje = `Hola! 👋 Vengo de tu catálogo digital. Me gustaría pedir:\n\n📌 *${nombreProducto}*\n💰 Precio: $${precioProducto}\n\n¿Me confirman la disponibilidad para el domicilio? ¡Gracias!`;

            // Codificar el mensaje para que sea válido en una URL
            const mensajeCodificado = encodeURIComponent(mensaje);

            // Crear el enlace directo a la API de WhatsApp
            const urlWhatsApp = `https://wa.me/${TELEFONO_NEGOCIO}?text=${mensajeCodificado}`;

            // Abrir la conversación en una pestaña nueva
            window.open(urlWhatsApp, "_blank");
        });
    });
});
