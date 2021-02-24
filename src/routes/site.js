const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const checkSessionIdStripe = require('../app/middlewares/checkSessionIdStripe');
const { requireAuth } = require('../app/middlewares/authenticateMiddleware');

router.get('/', siteController.index);
router.get('/add-to-cart/:_id', siteController.addToCart);
router.get('/remove/:_id', siteController.removeFromCart);
router.get('/checkout', requireAuth, siteController.checkout);
router.post('/purchase', siteController.purchase);
router.get('/purchase-success', checkSessionIdStripe, siteController.purchaseSuccess);

module.exports = router;