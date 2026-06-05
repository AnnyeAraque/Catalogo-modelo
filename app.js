const TELEFONO_NEGOCIO = "573123780870"; // Tu número de WhatsApp de pruebas
const PORCENTAJE_DESCUENTO = 0.10; // 10% de descuento para el combo personalizado

document.addEventListener("DOMContentLoaded", () => {
    
    // --- LÓGICA DE PRODUCTOS INDIVIDUALES Y CANTIDADES ---
    const tarjetasIndividuales = document.querySelectorAll(".card-individual");

    tarjetasIndividuales.forEach(tarjeta => {
        const inputCantidad = tarjeta.querySelector(".input-cantidad");
        const precioBase = parseInt(tarjeta.querySelector(".product-price").getAttribute("data-precio-base"));
        const displayTotal = tarjeta.querySelector(".total-producto");
        const botonPedido = tarjeta.querySelector(".btn-order");

        // Función reutilizable para actualizar el total visible del producto
        const actualizarTotalProducto = () => {
            let cantidad = parseInt(inputCantidad.value) || 1;
            if (cantidad < 1) cantidad = 1;
            
            const totalCalculado = precioBase * cantidad;
            displayTotal.textContent = `Total: $${totalCalculado.toLocaleString('es-CO')}`;
            botonPedido.setAttribute("data-precio", totalCalculado);
        };

        // Escuchar cuando el usuario cambia el número en el teclado o las flechitas
        inputCantidad.addEventListener("input", actualizarTotalProducto);

        // Evento de clic en el botón de WhatsApp individual
        botonPedido.addEventListener("click", () => {
            const cantidad = inputCantidad.value;
            const nombreProducto = botonPedido.getAttribute("data-producto");
            const precioTotal = botonPedido.getAttribute("data-precio") || precioBase;

            const mensaje = `Hola! 👋 Vengo de tu catálogo digital.\nMe gustaría solicitar:\n\n *${nombreProducto}*\n Cantidad: ${cantidad}\n *Total Pedido: $${parseInt(precioTotal).toLocaleString('es-CO')}*\n\n¿Me confirman el pedido para proceder con la dirección de domicilio?`;
            
            enviarWhatsApp(mensaje);
        });
    });

    // --- LÓGICA DE LA SECCIÓN ¡ARMA TU COMBO! ---
    const selectPlato = document.getElementById("select-plato");
    const selectAcompanamiento = document.getElementById("select-acompanamiento");
    const selectBebida = document.getElementById("select-bebida");
    const displayAntesCombo = document.getElementById("precio-antes-combo");
    const displayTotalCombo = document.getElementById("total-combo-precio");
    const btnPedidoCombo = document.getElementById("btn-pedido-combo");

    const calcularTotalesCombo = () => {
        // Solo sumar valores que estén seleccionados (no vacíos)
        const valorPlato = selectPlato.value ? parseInt(selectPlato.value) : 0;
        const valorAco = selectAcompanamiento.value ? parseInt(selectAcompanamiento.value) : 0;
        const valorBebida = selectBebida.value ? parseInt(selectBebida.value) : 0;

        const sumaBruta = valorPlato + valorAco + valorBebida;
        const ahorro = sumaBruta * PORCENTAJE_DESCUENTO;
        const precioFinalConDescuento = sumaBruta - ahorro;

        displayAntesCombo.textContent = `Antes: $${sumaBruta.toLocaleString('es-CO')}`;
        displayTotalCombo.textContent = `Total Combo: $${precioFinalConDescuento.toLocaleString('es-CO')}`;
    };

    // Escuchar cambios en cualquiera de las listas desplegables del combo
    selectPlato.addEventListener("change", calcularTotalesCombo);
    selectAcompanamiento.addEventListener("change", calcularTotalesCombo);
    selectBebida.addEventListener("change", calcularTotalesCombo);

    // Inicializar el cálculo por primera vez al cargar la web
    calcularTotalesCombo();

    // Evento para enviar el combo armado por WhatsApp
    btnPedidoCombo.addEventListener("click", () => {
        const textoPlato = selectPlato.options[selectPlato.selectedIndex].text;
        const textoAco = selectAcompanamiento.options[selectAcompanamiento.selectedIndex].text;
        const textoBebida = selectBebida.options[selectBebida.selectedIndex].text;
        const precioFinalTexto = displayTotalCombo.textContent.replace("Total Combo: ", "");

        const mensajeCombo = `¡Hola! ⚡ He armado un *Combo Personalizado* en el catálogo:\n\n🍔 *Plato Principal:* ${textoPlato}\n🍟 *Acompañamiento:* ${textoAco}\n🥤 *Bebida:* ${textoBebida}\n\n🔥 *Precio Combo (10% Desc Incluido): ${precioFinalTexto}*\n\n¿Me toman el pedido a domicilio por favor?`;
        
        enviarWhatsApp(mensajeCombo);
    });
});

// Función global auxiliar para codificar y redirigir
function enviarWhatsApp(msg) {
    const msgCodificado = encodeURIComponent(msg);
    const url = `https://wa.me/${TELEFONO_NEGOCIO}?text=${msgCodificado}`;
    window.open(url, "_blank");
}
