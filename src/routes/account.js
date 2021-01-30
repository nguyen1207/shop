const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');
const { requireAuth, blockAuthenicateSides } = require('../app/middlewares/authenticateMiddleware');


router.get('/sign-in', blockAuthenicateSides, accountController.signIn);
router.get('/sign-up', blockAuthenicateSides, accountController.signUp);
router.post('/sign-up', accountController.storeAccount);
router.post('/sign-in', accountController.checkAccount);
router.get('/sign-out', accountController.signOut);
router.get('/:_id', requireAuth,accountController.myAccount);

module.exports = router;