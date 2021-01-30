const Product = require('../models/Product');
const {mongooseToObject} = require('../../util/mongoose');
const {multipleMongooseToObject} = require("../../util/mongoose");

class ProductController {

    // [GET] /category/:category
    showProductsInCategory(req, res, next) {
        Product.find({category: req.params.category})
            .then(products => {
                res.render('./products/showProductsInCategory', { products: multipleMongooseToObject(products) });
            })
            .catch(next)
    }

    // [GET] /category/:category/product/:name/:_id
    showProductDetails(req, res, next) {
        Product.findOne({_id: req.params._id})
            .then(product => {
                res.render('./products/showProductDetails', { product: mongooseToObject(product) });
            })
            .catch(next)
    }
}

module.exports = new ProductController;
