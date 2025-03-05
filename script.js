// Precios base y elementos
const prices = {
    hamburger: 5.00,
    hotdog: 3.50,
    sandwich: 4.00,
    ingredient: 0.50,
    sides: {
        patatas: 2.00,
        ensalada: 1.50,
        aros: 2.50
    },
    drinks: {
        agua: 1.00,
        refresco: 1.50,
        cerveza: 2.00
    }
};

// Variables de pedido
let orderDetails = {
    product: '',
    ingredients: [],
    sides: [],
    drink: '',
    totalPrice: 0
};

// Función para actualizar el precio total y desglose
function updatePrice() {
    let total = prices[orderDetails.product] || 0;

    // Ingredientes adicionales
    orderDetails.ingredients.forEach(ingredient => total += prices.ingredient);

    // Complementos
    orderDetails.sides.forEach(side => total += prices.sides[side]);

    // Bebida
    total += prices.drinks[orderDetails.drink];

    orderDetails.totalPrice = total;

    // Mostrar el desglose de precios
    const breakdown = document.getElementById('price-breakdown');
    breakdown.innerHTML = '';
    breakdown.innerHTML += `<li>Producto: ${orderDetails.product} - ${prices[orderDetails.product].toFixed(2)}€</li>`;
    
    orderDetails.ingredients.forEach(ingredient => {
        breakdown.innerHTML += `<li>Ingrediente: ${ingredient} - 0.50€</li>`;
    });

    orderDetails.sides.forEach(side => {
        breakdown.innerHTML += `<li>Complemento: ${side} - ${prices.sides[side].toFixed(2)}€</li>`;
    });

    breakdown.innerHTML += `<li>Bebida: ${orderDetails.drink} - ${prices.drinks[orderDetails.drink].toFixed(2)}€</li>`;

    // Actualizar el precio total
    document.getElementById('total-price').textContent = `${total.toFixed(2)}€`;
}

// Eventos de selección de producto principal
document.querySelectorAll('.product-option').forEach(button => {
    button.addEventListener('click', () => {
        orderDetails.product = button.dataset.product;
        updatePrice();
    });
});

// Eventos de selección de ingredientes adicionales
document.querySelectorAll('.ingredient').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const ingredient = checkbox.dataset.ingredient;
        if (checkbox.checked) {
            orderDetails.ingredients.push(ingredient);
        } else {
            orderDetails.ingredients = orderDetails.ingredients.filter(i => i !== ingredient);
        }
        updatePrice();
    });
});

// Eventos de selección de complementos
document.querySelectorAll('.side').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const side = checkbox.dataset.side;
        if (checkbox.checked) {
            orderDetails.sides.push(side);
        } else {
            orderDetails.sides = orderDetails.sides.filter(s => s !== side);
        }
        updatePrice();
    });
});

// Evento de selección de bebida
document.getElementById('drink').addEventListener('change', (event) => {
    orderDetails.drink = event.target.value;
    updatePrice();
});

// Confirmar pedido
document.getElementById('confirm-order').addEventListener('click', () => {
    // Guardar el pedido en el almacenamiento local
    const orderId = localStorage.getItem('lastOrderId') || 0;
    const newOrderId = parseInt(orderId) + 1;
    localStorage.setItem('lastOrderId', newOrderId);

    const order = { ...orderDetails, orderId: newOrderId };
    localStorage.setItem(`order-${newOrderId}`, JSON.stringify(order));

    // Enviar el pedido a la zona de display
    alert(`Pedido confirmado: #${newOrderId}`);
});
