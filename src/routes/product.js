const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');

router.get('/:category', productController.showProductsInCategory);
router.get('/:category/:name/:_id', productController.showProductDetails);


module.exports = router;