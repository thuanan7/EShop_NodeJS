'use strict';

async function addCart(id, quantity) {
    const response = await fetch('/cart', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({id, quantity})
    });

    const jsonResponse = await response.json();
    document.querySelector('#cart-quantity').innerText = `(${jsonResponse.quantity})`;
}
