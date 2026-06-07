const TELEFONO_NEGOCIO = NEGOCIO_CONFIG.telefono;
const PORCENTAJE_DESCUENTO = NEGOCIO_CONFIG.descuentoCombo;

// Cargar datos (en el navegador, desde JSON local o API)
async function cargarDatos() {
    try {
        // path relative to index.html: data/data.json
        const response = await fetch('data/data.json');
        const datos = await response.json();
        inicializarCatalogo(datos);
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

function inicializarCatalogo(datos) {
    // Actualizar header
    document.querySelector(".brand-name").textContent = NEGOCIO_CONFIG.nombre;
    document.querySelector(".brand-slogan").textContent = NEGOCIO_CONFIG.slogan;
    
    // Renderizar productos
    const contenedor = document.getElementById('catalogo-productos');
    const renderizador = new RenderizadorCatalogo(contenedor, datos);
    renderizador.renderizarProductos();
    
    // Agregar evento a todos los productos
    agregarEventosProductos();
    
    // Renderizar combos si están habilitados
    if (NEGOCIO_CONFIG.tieneCombo) {
        renderizarSeccionCombos(datos.combos);
    }
}

function agregarEventosProductos() {
    const tarjetas = document.querySelectorAll(".card-individual");
    
    tarjetas.forEach(tarjeta => {
        const inputCantidad = tarjeta.querySelector(".input-cantidad");
        const precioBase = parseInt(tarjeta.querySelector(".product-price").getAttribute("data-precio-base"));
        const displayTotal = tarjeta.querySelector(".total-producto");
        const botonPedido = tarjeta.querySelector(".btn-order");
        const nombreProducto = botonPedido.getAttribute("data-producto");
        
        const validarCantidad = () => {
            let valor = inputCantidad.value.replace(/\D/g, '');
            if (valor.length > 2) {
                valor = valor.slice(0, 2);
            }
            if (valor === '') {
                valor = '1';
            }
            if (parseInt(valor, 10) < 1) {
                valor = '1';
            }
            if (parseInt(valor, 10) > 99) {
                valor = '99';
            }
            inputCantidad.value = valor;
        };

        const actualizarTotal = () => {
            validarCantidad();
            const cantidad = parseInt(inputCantidad.value, 10) || 1;
            const totalCalculado = precioBase * cantidad;
            displayTotal.textContent = `Total: $${totalCalculado.toLocaleString('es-CO')}`;
            botonPedido.setAttribute("data-precio", totalCalculado);
        };
        
        inputCantidad.addEventListener("input", actualizarTotal);
        
        botonPedido.addEventListener("click", () => {
            const cantidad = inputCantidad.value;
            const precioTotal = botonPedido.getAttribute("data-precio") || precioBase;
            
            const mensaje = `Hola! 👋 Vengo de tu catálogo digital.\nMe gustaría solicitar:\n\n *${nombreProducto}*\n Cantidad: ${cantidad}\n *Total Pedido: $${parseInt(precioTotal).toLocaleString('es-CO')}* \n\n Me confirmas el pedido?`;
            
            enviarWhatsApp(mensaje);
        });
    });
}

function renderizarSeccionCombos(dataCombos) {
    const contenedorCombos = document.getElementById('seccion-combos-container');
    
    const html = `
        <div class="tarjeta-combo">
            <div class="badge-descuento">✨ ¡${(PORCENTAJE_DESCUENTO * 100)}% DESC. INCLUIDO! ✨</div>
            <h2>🛠️ ¡Arma tu Combo Ideal!</h2>
            <p class="subtitulo-combo">Elige opciones de cada categoría.</p>
            <div id="opciones-combo"></div>
            <div class="fila-pedido-combo">
                <div class="precios-combo-display">
                    <span class="antes-precio" id="precio-antes-combo">Antes: $0</span>
                    <span class="total-combo" id="total-combo-precio">Total Combo: $0</span>
                </div>
            </div>
            <p class="combo-aviso" id="aviso-combo"></p>
            <div class="fila-pedido-combo">
                <button id="btn-pedido-combo" class="btn-pedido-combo" disabled>Pedir Combo 🛵</button>
            </div>
        </div>
    `;
    
    contenedorCombos.innerHTML = html;
    
    // Renderizar selects
    const renderizador = new RenderizadorCatalogo(null, null);
    const opcionesDiv = document.getElementById('opciones-combo');
    renderizador.renderizarCombos(opcionesDiv, dataCombos);
    
    // Agregar eventos a combos
    agregarEventosCombos(dataCombos);
}

function agregarEventosCombos(dataCombos) {
    const selects = dataCombos.map(c => document.getElementById(`select-${c.id}`));
    const displayAntes = document.getElementById("precio-antes-combo");
    const displayTotal = document.getElementById("total-combo-precio");
    const avisoCombo = document.getElementById("aviso-combo");
    const btnPedido = document.getElementById("btn-pedido-combo");
    
    const actualizarCombo = () => {
        const resultado = calcularComboConValidacion(selects, dataCombos, PORCENTAJE_DESCUENTO);
        
        displayAntes.textContent = `Antes: $${resultado.antes.toLocaleString('es-CO')}`;
        displayTotal.textContent = `Total Combo: $${resultado.despues.toLocaleString('es-CO')}`;
        avisoCombo.textContent = resultado.valido
            ? ''
            : 'El descuento aplica al seleccionar minimo Plato Principal + Bebida o Plato Principal + Acompañamiento.';
        btnPedido.disabled = !resultado.valido;
    };
    
    selects.forEach(select => {
        select.addEventListener("change", actualizarCombo);
    });
    
    actualizarCombo();
    
    btnPedido.addEventListener("click", () => {
        const items = [];
        
        dataCombos.forEach((combo, index) => {
            if (selects[index].value) {
                const nombre = selects[index].options[selects[index].selectedIndex].text;
                items.push(`${combo.nombre}: ${nombre}`);
            }
        });
        
        if (items.length === 0) {
            alert('Selecciona al menos un item');
            return;
        }
        
        const resultado = calcularComboConValidacion(selects, dataCombos, PORCENTAJE_DESCUENTO);
        
        if (!resultado.valido) {
            alert('Recuerda: para obtener descuento debes seleccionar plato principal + bebida o plato principal + acompañamiento.');
        }
        
        const mensaje = `¡Hola! ⚡ He armado un *Combo Personalizado*:\n\n${items.map(i => `• ${i}`).join('\n')}\n\n🔥 *Precio Combo (${resultado.valido ? (PORCENTAJE_DESCUENTO * 100) : 0}% Desc): $${resultado.despues.toLocaleString('es-CO')}* \n\n Me confirmas el pedido?`;
        
        enviarWhatsApp(mensaje);
    });
}

function esComboValido(selectores, dataCombos) {
    const seleccion = dataCombos.map((combo, index) => ({
        id: combo.id,
        precio: selectores[index].value ? parseInt(selectores[index].value, 10) : 0
    }));

    const tienePlato = seleccion.some(item => item.id === 'combo-plato' && item.precio > 0);
    const tieneAcompanamiento = seleccion.some(item => item.id === 'combo-acompanamiento' && item.precio > 0);
    const tieneBebida = seleccion.some(item => item.id === 'combo-bebida' && item.precio > 0);

    return tienePlato && (tieneAcompanamiento || tieneBebida);
}

function calcularComboConValidacion(selectores, dataCombos, descuento) {
    let total = 0;

    selectores.forEach(selector => {
        if (selector.value) {  // Solo suma si hay selección
            total += parseInt(selector.value, 10);
        }
    });

    const valido = esComboValido(selectores, dataCombos);
    const ahorro = valido ? total * descuento : 0;
    return {
        antes: total,
        descuento: ahorro,
        despues: total - ahorro,
        valido
    };
}

function enviarWhatsApp(msg) {
    const msgCodificado = encodeURIComponent(msg);
    const url = `https://wa.me/${TELEFONO_NEGOCIO}?text=${msgCodificado}`;
    window.open(url, "_blank");
}

// Iniciar cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarDatos);