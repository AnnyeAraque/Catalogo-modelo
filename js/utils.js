class RenderizadorCatalogo {
    constructor(contenedor, datos) {
        this.contenedor = contenedor;
        this.datos = datos;
    }
    
    // Renderizar todos los productos individuales
    renderizarProductos() {
        this.datos.productos.forEach(producto => {
            const tarjeta = this.crearTarjetaProducto(producto);
            this.contenedor.appendChild(tarjeta);
        });
    }
    
    // Crear elemento HTML de una tarjeta (SIN duplicación)
    crearTarjetaProducto(producto) {
        const div = document.createElement('div');
        div.className = 'product-card card-individual';
        
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-desc">${producto.descripcion}</p>
                <div class="product-footer">
                    <span class="product-price" data-precio-base="${producto.precio}">
                        $${producto.precio.toLocaleString('es-CO')}
                    </span>
                    <div class="control-cantidad">
                        <label>Cant:</label>
                        <div class="cantidad-control">
                            <button type="button" class="btn-cant minus" aria-label="Restar">−</button>
                            <input type="number" class="input-cantidad" value="1" min="1" max="99" inputmode="numeric" pattern="\d{1,2}">
                            <button type="button" class="btn-cant plus" aria-label="Sumar">+</button>
                        </div>
                    </div>
                    <div class="bloque-pedido">
                        <span class="total-producto">Total: $${producto.precio.toLocaleString('es-CO')}</span>
                        <button class="btn-order" data-producto="${producto.nombre}" data-precio="${producto.precio}">
                            Pedir por WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }
    
    // Renderizar combos dinámicamente
    renderizarCombos(contenedorCombos, dataCombos) {
        dataCombos.forEach(combo => {
            const select = document.createElement('select');
            select.id = `select-${combo.id}`;
            
            // Opción "Seleccione producto..."
            const optionVacia = document.createElement('option');
            optionVacia.value = '';
            optionVacia.textContent = 'Seleccione producto...';
            select.appendChild(optionVacia);
            
            // Opciones del combo
            combo.opciones.forEach(opcion => {
                const option = document.createElement('option');
                option.value = opcion.precio;
                option.textContent = opcion.nombre;
                select.appendChild(option);
            });
            
            const grupoDiv = document.createElement('div');
            grupoDiv.className = 'grupo-seleccion';
            grupoDiv.innerHTML = `<label for="select-${combo.id}">${combo.nombre}</label>`;
            grupoDiv.appendChild(select);
            
            contenedorCombos.appendChild(grupoDiv);
        });
    }
}

// Función auxiliar para calcular con validación
function calcularComboConValidacion(selectores, descuento) {
    let total = 0;
    
    selectores.forEach(selector => {
        if (selector.value) {  // Solo suma si hay selección
            total += parseInt(selector.value);
        }
    });
    
    const ahorro = total * descuento;
    return {
        antes: total,
        descuento: ahorro,
        despues: total - ahorro
    };
}