const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/CategoryController');
const productController = require('../app/controllers/ProductController');

router.get('/:category', categoryController.showProductsInCategory);
router.get('/:category/:name/:_id', productController.showProductDetails);

module.exports = router;