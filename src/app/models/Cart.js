module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalPrice = oldCart.totalPrice || 0;
    this.totalQuantity = oldCart.totalQuantity || 0;

    this.add = function(item, id, quantity) {

        // Check item exist in the cart
        var storedItem = this.items[id];
        // If not found item then initialize the item
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }

        // Update the quantity and price of the item
        storedItem.quantity += quantity;
        storedItem.price = Math.round( storedItem.item.price * storedItem.quantity * 100 ) / 100;

        // Update the total price and quanity in cart
        this.totalPrice = Math.round( (this.totalPrice + storedItem.item.price * quantity) * 100 ) / 100;
        this.totalQuantity += quantity;
    }   

    this.remove = function(id) {
        this.totalQuantity -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    this.changeQuantity = function(item, id, newQuantity) {
        var storedItem = this.items[id];  
        var oldQuantity = storedItem.quantity;

        // Update the quantity and price of the item
        storedItem.quantity = newQuantity;
        storedItem.price = Math.round( storedItem.item.price * newQuantity * 100 ) / 100;

        // Update the total price and quanity in cart
        this.totalQuantity = this.totalQuantity - oldQuantity + newQuantity;
        this.totalPrice -= storedItem.item.price * oldQuantity;
        this.totalPrice = Math.round( (this.totalPrice + storedItem.item.price * newQuantity) * 100 ) / 100

    }

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) { 
            arr.push(this.items[id]);
        }
        return arr;
    }

}