"use strict";

async function addCart(id, quantity) {
	const response = await fetch("/cart", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ id, quantity }),
	});

	const jsonResponse = await response.json();
	document.querySelector(
		"#cart-quantity"
	).innerText = `(${jsonResponse.quantity})`;
}

async function updateItem(id, quantity) {
	const response = await fetch("/cart", {
		method: "PUT",
		headers: {
			"Content-type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ id, quantity }),
	});

	if (response.status !== 204) {
		const jsonResponse = await response.json();
		document.querySelector(`#item-${id}-total`).innerText =
			"$" + `${jsonResponse.total}`;
		document.querySelector("#cart-subtotal").innerText =
			"$" + `${jsonResponse.subtotal}`;
		document.querySelector("#cart-grandtotal").innerText =
			"$" + `${jsonResponse.grandtotal}`;
		document.querySelector(
			"#cart-quantity"
		).innerText = `(${jsonResponse.quantity})`;
	}
}

async function removeItem(id) {
	if (confirm("Are you sure you want to remove this item?")) {
		const response = await fetch("/cart", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id }),
		});
		const jsonResponse = await response.json();

		if (jsonResponse.quantity) {
			document.getElementById(`cart-item-${id}-row`).remove();
			document.querySelector("#cart-subtotal").innerHTML =
				"$" + `${jsonResponse.subtotal}`;
			document.querySelector("#cart-grandtotal").innerHTML =
				"$" + `${jsonResponse.grandtotal}`;
			document.querySelector(
				"#cart-quantity"
			).innerText = `(${jsonResponse.quantity})`;
		} else {
			location.reload();
		}
	}
}

async function clearCart() {
	if (confirm("Are you sure you want to clear the cart?")) {
		const response = await fetch("/cart/clear", { method: "DELETE" });
		if (response.status === 204) {
			location.reload();
		}
	}
}

function placeOrders(event) {
	event.preventDefault();

	const addressId = document.querySelector('input[name="addressId"]:checked');
	if (!addressId || addressId.value == 0) {
		if (!event.target.checkValidity()) {
			return event.target.reportValidity();
		}
	}
	event.target.submit();
}

function checkPasswordConfirm(formId) {
	const password = document.querySelector(`#${formId} input[name=password]`);
	const confirmPassword = document.querySelector(`#${formId} input[name=confirmPassword]`);
	
	if (password.value != confirmPassword.value) {
		confirmPassword.setCustomValidity('Password not match!');
		confirmPassword.reportValidity();
	} else {
		confirmPassword.setCustomValidity('');
	}
}
