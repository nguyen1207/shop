const Product = require('../models/Product');
const {multipleMongooseToObject} = require("../../util/mongoose")

class CategoryController {

    // [GET] /:categories
    showProductsInCategory(req, res, next) {
        Product.find({category: req.params.category})
            .then(products => {
                res.render('./categories/showProductsInCategory', { products: multipleMongooseToObject(products) });
            })
            .catch(next)
    }
}

module.exports = new CategoryController;