var stripe = Stripe('pk_test_51IMwMdJL0UnBSnvcQPSkjfvhJROvNSKkpHVTJlRYxBBW7IukSZI8KNE4CVJrlHXeqxPUuK4RXrcdn4AFso8oZdZ000hzOAyT9e');

var checkoutBtn = document.getElementById('checkout-btn')
var shopItems = document.querySelectorAll('.shop-item');

var items = [];
shopItems.forEach(function(shopItem) {
    var quantityElement = shopItem.getElementsByClassName('quantity')[0];
    var quantity = quantityElement.dataset.quantity;
    items.push({id: shopItem.dataset.itemId, quantity: quantity});
    
})


checkoutBtn.addEventListener("click", function () {
    fetch("/purchase", {
        method: "POST",
        body: JSON.stringify({items: items}),
        headers: {'Content-Type': 'application/json'},
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
        // If redirectToCheckout fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using error.message.
        if (result.error) {
            alert(result.error.message);
        }
    })
    .catch(function (error) {
        console.error("Error:", error);
    });
});