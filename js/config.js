const NEGOCIO_CONFIG = {
    // Identificación
    nombre: "Burgers & Co. Yopal",
    slogan: "¡Pide tus domicilios en 2 clics!",
    telefono: "573123780870", // Número de WhatsApp del negocio (con código de país)
    
    // Estilos
    colores: {
        primario: "#ff9000",        // Naranja
        secundario: "#25d366",      // WhatsApp verde
        fondo: "#121214",           // Gris oscuro
        acentoCombo: "#8e44ad"      // Morado para combos
    },
    
    // Configuración de combos (dinámico)
    tieneCombo: true,               // ¿Usa sección combos?
    descuentoCombo: 0.10,           // Porcentaje descuento
    categoriaCombo: ["Plato", "Acompañamiento", "Bebida"],
    
    // Categorías de productos
    mostrarCategorias: true,
    categoriasPermitidas: ["Hamburguesas", "Pizzas", "Bebidas", "Postres"]
};