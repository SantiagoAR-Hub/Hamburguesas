// Precios base y elementos
const precios = {
    hamburguesa: 5.00,
    cheeseburguesa: 6.00,
    baconburguesa: 7.00,
    bocadillopollo: 5.50,
    ingrediente: 0.50,
    acompanamientos: {
        patatas: 2.00,
        ensalada: 1.50,
        aros: 2.50
    },
    bebidas: {
        agua: 1.00,
        refresco: 1.50,
        cerveza: 2.00
    }
};

// Variables del pedido
let pedido = {
    producto: '',
    ingredientes: [],
    acompanamientos: [],
    bebida: 'agua', // Valor por defecto
    precioTotal: 0
};

// Función para actualizar el precio total y desglose
function actualizarPrecio() {
    let total = precios[pedido.producto] || 0;

    // Ingredientes adicionales
    pedido.ingredientes.forEach(() => total += precios.ingrediente);

    // Acompañamientos
    pedido.acompanamientos.forEach(acompanamiento => total += precios.acompanamientos[acompanamiento]);

    // Bebida
    total += precios.bebidas[pedido.bebida];

    pedido.precioTotal = total;

    // Mostrar el desglose de precios
    const desglose = document.getElementById('desgloce-precio');
    desglose.innerHTML = '';

    if (pedido.producto) {
        desglose.innerHTML += `<li>Producto: ${pedido.producto} - ${precios[pedido.producto].toFixed(2)}€</li>`;
    }

    pedido.ingredientes.forEach(ingrediente => {
        desglose.innerHTML += `<li>Ingrediente: ${ingrediente} - 0.50€</li>`;
    });

    pedido.acompanamientos.forEach(acompanamiento => {
        desglose.innerHTML += `<li>Acompañamiento: ${acompanamiento} - ${precios.acompanamientos[acompanamiento].toFixed(2)}€</li>`;
    });

    desglose.innerHTML += `<li>Bebida: ${pedido.bebida} - ${precios.bebidas[pedido.bebida].toFixed(2)}€</li>`;

    // Actualizar el precio total
    document.getElementById('precio-total').textContent = `${total.toFixed(2)}€`;
}

// Eventos de selección de producto principal
document.querySelectorAll('.opcion-producto').forEach(boton => {
    boton.addEventListener('click', () => {
        pedido.producto = boton.dataset.product;
        actualizarPrecio();
    });
});

// Eventos de selección de ingredientes adicionales
document.querySelectorAll('.ingrediente').forEach(casilla => {
    casilla.addEventListener('change', () => {
        const ingrediente = casilla.dataset.ingredient;
        if (casilla.checked) {
            pedido.ingredientes.push(ingrediente);
        } else {
            pedido.ingredientes = pedido.ingredientes.filter(i => i !== ingrediente);
        }
        actualizarPrecio();
    });
});

// Eventos de selección de acompañamientos
document.querySelectorAll('.acompanamiento').forEach(casilla => {
    casilla.addEventListener('change', () => {
        const acompanamiento = casilla.dataset.side;
        if (casilla.checked) {
            pedido.acompanamientos.push(acompanamiento);
        } else {
            pedido.acompanamientos = pedido.acompanamientos.filter(a => a !== acompanamiento);
        }
        actualizarPrecio();
    });
});

// Evento de selección de bebida
document.getElementById('bebida').addEventListener('change', (evento) => {
    pedido.bebida = evento.target.value;
    actualizarPrecio();
});

// Confirmar pedido
document.getElementById('confirmar-orden').addEventListener('click', () => {
    if (!pedido.producto) {
        alert("Debes seleccionar un producto antes de confirmar el pedido.");
        return;
    }

    // Guardar el pedido en el almacenamiento local
    const idPedido = localStorage.getItem('ultimoPedidoId') || 0;
    const nuevoIdPedido = parseInt(idPedido) + 1;
    localStorage.setItem('ultimoPedidoId', nuevoIdPedido);

    const nuevoPedido = { ...pedido, idPedido: nuevoIdPedido };
    localStorage.setItem(`pedido-${nuevoIdPedido}`, JSON.stringify(nuevoPedido));

    // Enviar el pedido a la zona de display
    alert(`Pedido confirmado: #${nuevoIdPedido}`);
});
