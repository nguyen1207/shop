const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    id: { 
        type: String 
    },
    customerEmail: { 
        type: String
    },
    price: { 
        type: Number 
    },
    items: { 
        type: Object 
    },
    payAt: {
        type: Date, 
        default: Date.now()
    },
});

module.exports = mongoose.model('Order', Order);
