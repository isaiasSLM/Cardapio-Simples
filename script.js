let cartItems = {};
let totalPrice = 0;

// Função para adicionar item ao carrinho
function addToCart(itemName, itemPrice) {
    if (cartItems[itemName]) {
        // Se o item já existe, incrementa a quantidade
        cartItems[itemName].quantity += 1;
    } else {
        // Se o item não existe, adiciona ao carrinho
        cartItems[itemName] = { price: itemPrice, quantity: 1 };
    }
    totalPrice += itemPrice;
    updateCart();
}

// Atualiza a visualização do carrinho e o total
function updateCart() {
    const cartList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const itemCountElement = document.getElementById('item-count');

    // Limpa a lista do carrinho
    cartList.innerHTML = '';

    // Adiciona cada item do carrinho à lista
    for (const itemName in cartItems) {
        const item = cartItems[itemName];
        const listItem = document.createElement('li');
        listItem.textContent = `${itemName} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}`;

        // Botão para remover item
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-btn';
        removeButton.onclick = () => removeFromCart(itemName, item.price);

        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
    }

    totalPriceElement.textContent = totalPrice.toFixed(2);
    itemCountElement.textContent = getTotalItems();
}

// Função para remover item do carrinho
function removeFromCart(itemName, itemPrice) {
    if (cartItems[itemName]) {
        totalPrice -= itemPrice; // Subtrai o preço do total
        cartItems[itemName].quantity -= 1; // Decrementa a quantidade

        if (cartItems[itemName].quantity === 0) {
            delete cartItems[itemName]; // Remove o item se a quantidade for 0
        }
        updateCart();
    }
}

// Conta o total de itens no carrinho
function getTotalItems() {
    return Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
}

// Filtra itens por categoria
function filterItems(category) {
    const items = document.querySelectorAll('#menu-items .item');
    items.forEach(item => {
        if (item.getAttribute('data-category') === category || category === 'todos') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Gerencia a exibição do campo de troco
document.getElementById('payment-method').addEventListener('change', function() {
    const changeSection = document.getElementById('change-section');
    changeSection.style.display = this.value === 'dinheiro' ? 'block' : 'none';
});

// Envia o pedido via WhatsApp ao finalizar
document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const name = document.getElementById('name').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const notes = document.getElementById('notes').value;
    const change = document.getElementById('change').value;
    const endereco = document.getElementById('endereco').value;

    let orderMessage = `Cliente: ${name}.\n`;
    orderMessage += `Endereço: ${endereco}.\n`;
    orderMessage += `Forma de pagamento: ${paymentMethod}.\n`;
    orderMessage += `Troco: ${change}.\n`;
    orderMessage += `Observações: ${notes}.\n`;
    orderMessage += `Pedido:\n`;

    // Formatação do pedido
    for (const itemName in cartItems) {
        const item = cartItems[itemName];
        orderMessage += `${item.quantity}x ${itemName}\n`;
    }

    orderMessage += `Total: R$ ${totalPrice.toFixed(2)}`;

    // Substitua o número de telefone pelo número real
    const whatsappNumber = '558488770810';
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

    // Redireciona para o WhatsApp
    window.open(whatsappLink, '_blank');

    // Reseta o carrinho e o formulário
    cartItems = {};
    totalPrice = 0;
    updateCart();
    this.reset();
});