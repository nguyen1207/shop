const express = require('express');
const router = express.Router();
const Product = require('../app/models/Product');
const productController = require('../app/controllers/ProductController');
const pagination = require('../app/middlewares/pagination');

router.get('/:category', pagination(Product), productController.showProductsInCategory);
router.get('/:category/:name/:_id', productController.showProductDetails);


module.exports = router;