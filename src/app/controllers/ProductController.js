const Product = require('../models/Product');
const {mongooseToObject} = require('../../util/mongoose');

class ProductController {
    // [GET] /product/:name/:_id
    showProductDetails(req, res, next) {
        Product.findOne({_id: req.params._id})
            .then(product => {
                //res.json(product);
                res.render('./products/showProductDetails', { product: mongooseToObject(product) });
            })
            .catch(next)
    }
}

module.exports = new ProductController;
