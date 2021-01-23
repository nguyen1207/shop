const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String },
    category: { type: String},
    price: { type: Number, min: 1 },
    description: { type: String },
    image: { type: String },
    rating: { type: Number },
    bestSeller: {type: Boolean},
});

module.exports = mongoose.model('Product', Product);
