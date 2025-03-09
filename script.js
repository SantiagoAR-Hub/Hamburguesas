// Precios base y elementos
const precios = {
    hamburguesa: 5.00,
    cheeseburguer: 6.00,  // Coincide con data-product en HTML
    baconburguer: 7.00,   // Coincide con data-product en HTML
    bocadillopollo: 5.50,
    ingrediente: 0.50,
    complemento: {
        patatas: 2.00,
        alitas: 1.50,
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
    cantidad: 1,
    ingredientes: [],
    complemento: [],
    bebida: 'agua', // Valor por defecto
    precioTotal: 0,
    estado: 'Realizado',
    tiempoCreacion: new Date().getTime(),
    tiempoEstimado: 0,
    retraso: 0
};

// Función para actualizar el precio total y desglose
function actualizarPrecio() {
    let total = (precios[pedido.producto] || 0) * pedido.cantidad;

    // Ingredientes adicionales
    pedido.ingredientes.forEach(() => total += precios.ingrediente);

    // Acompañamientos
    pedido.complemento.forEach(complemento => total += precios.complemento[complemento]);

    // Bebida
    total += precios.bebidas[pedido.bebida];

    pedido.precioTotal = total;

    // Mostrar el desglose de precios
    const desglose = document.getElementById('desglose-precio');
    desglose.innerHTML = '';

    if (pedido.producto) {
        desglose.innerHTML += `<li>Producto: ${pedido.producto} (x${pedido.cantidad}) - ${(precios[pedido.producto] * pedido.cantidad).toFixed(2)}€</li>`;
    }

    pedido.ingredientes.forEach(ingrediente => {
        desglose.innerHTML += `<li>Ingrediente: ${ingrediente} - 0.50€</li>`;
    });

    pedido.complemento.forEach(complemento => {
        let cantidad = 1;
        desglose.innerHTML += `<li>Complemento: ${complemento} (x1) - ${precios.complemento[complemento].toFixed(2)}€</li>`;
    });

    desglose.innerHTML += `<li>Bebida: ${pedido.bebida} (x1) - ${precios.bebidas[pedido.bebida].toFixed(2)}€</li>`;

    // Actualizar el precio total
    document.getElementById('precio-total').textContent = `${total.toFixed(2)}€`;
}

// Eventos de selección de producto principal
document.querySelectorAll('.opcion-producto').forEach(boton => {
    boton.addEventListener('click', () => {
        pedido.producto = boton.dataset.producto;
        actualizarPrecio();
    });
});

// Eventos de selección de ingredientes adicionales
document.querySelectorAll('.ingrediente').forEach(casilla => {
    casilla.addEventListener('change', () => {
        const ingrediente = casilla.dataset.ingrediente;
        if (casilla.checked) {
            pedido.ingredientes.push(ingrediente);
        } else {
            pedido.ingredientes = pedido.ingredientes.filter(i => i !== ingrediente);
        }
        actualizarPrecio();
    });
});

// Eventos de selección de acompañamientos
document.querySelectorAll('.complemento').forEach(casilla => {
    casilla.addEventListener('change', () => {
        const complemento = casilla.dataset.complemento;
        if (casilla.checked) {
            pedido.complemento.push(complemento);
        } else {
            pedido.complemento = pedido.complemento.filter(a => a !== complemento);
        }
        actualizarPrecio();
    });
});

// Evento de selección de bebida
document.getElementById('bebida').addEventListener('change', (evento) => {
    pedido.bebida = evento.target.value;
    actualizarPrecio();
});

// Incrementar la cantidad
document.getElementById('incrementar').addEventListener('click', () => {
    if (pedido.cantidad < 50) {
        pedido.cantidad++;
        document.getElementById('cantidad').textContent = pedido.cantidad;
        actualizarPrecio();
    } else {
        alert("No puedes agregar más de 50 unidades de este producto.");
    }
});

// Decrementar la cantidad
document.getElementById('decrementar').addEventListener('click', () => {
    if (pedido.cantidad > 1) {
        pedido.cantidad--;
        document.getElementById('cantidad').textContent = pedido.cantidad;
        actualizarPrecio();
    } else {
        alert("Debes seleccionar al menos 1 unidad.");
    }
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

     // Limpiar la tabla de desglose de precio
     const desglose = document.getElementById('desglose-precio');
     desglose.innerHTML = '';
 
     // Resetear los ingredientes, complementos y producto seleccionado
     pedido.producto = '';
     pedido.ingredientes = [];
     pedido.complemento = [];
     pedido.cantidad = 1; // Resetea la cantidad a 1
     pedido.bebida = 'agua'; // Resetea la bebida a su valor por defecto
     pedido.precioTotal = 0; // Restablece el precio total
 
     // Restablecer el número de unidades de producto a 1
     document.getElementById('cantidad').textContent = '1';
 
     // Deseleccionar todos los ingredientes
     document.querySelectorAll('.ingrediente').forEach(casilla => {
         casilla.checked = false;
     });
 
     // Deseleccionar todos los complementos
     document.querySelectorAll('.complemento').forEach(casilla => {
         casilla.checked = false;
     });
 
     // Resetear la bebida
     document.getElementById('bebida').value = 'agua';
 
     // Actualizar el precio total a 0
     document.getElementById('precio-total').textContent = '0.00€';
 
});




