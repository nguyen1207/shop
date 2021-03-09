const Product = require('../models/Product');
const Cart = require('../models/Cart');
const {mongooseToObject} = require('../../util/mongoose');
const {multipleMongooseToObject} = require("../../util/mongoose");

class ProductController {

    // [GET] /category/:category
    showProductsInCategory(req, res, next) {
        const category = req.params.category;
        const products = res.paginatedResults.models;
        const {maxPage, nextPage, previousPage} = res.paginatedResults;
        res.render('./products/showProductsInCategory', {products: multipleMongooseToObject(products),category: category, maxPage: maxPage, nextPage: nextPage, previousPage: previousPage});
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
