const express = require('express');
const router = express.Router();
const Product = require('../app/models/Product');
const siteController = require('../app/controllers/SiteController');
const checkSessionIdStripe = require('../app/middlewares/checkSessionIdStripe');
const { requireAuth } = require('../app/middlewares/authenticateMiddleware');
const pagination = require('../app/middlewares/pagination');

router.get('/', siteController.index);
router.get('/add-to-cart/:_id', siteController.addToCart);
router.get('/remove/:_id', siteController.removeFromCart);
router.get('/checkout', requireAuth, siteController.checkout);
router.post('/purchase', siteController.purchase);
router.get('/purchase-success', checkSessionIdStripe, siteController.purchaseSuccess);
router.get('/change-quantity/:_id', siteController.changeQuantity);
router.get('/search', pagination(Product), siteController.search);
router.get('/wishlist', requireAuth, siteController.wishlist);
router.put('/add-to-wishlist', siteController.addToWishlist);
router.put('/remove-from-wishlist', siteController.removeFromWishlist);

module.exports = router;    