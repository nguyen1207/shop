const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');
const { requireAuth, checkVerificationLink, checkCurrentUser, blockAuthenicateSides } = require('../app/middlewares/authenticateMiddleware');


router.get('/sign-in', blockAuthenicateSides, accountController.signIn);
router.get('/sign-up', blockAuthenicateSides, accountController.signUp);
router.post('/sign-up', accountController.storeAccount);
router.get('/sign-up/verify/:_id', accountController.verify);
router.get('/verify/:token', checkVerificationLink, accountController.verifySuccess);
router.post('/sign-in', accountController.checkAccount);
router.get('/sign-out', accountController.signOut);
router.get('/forgot-password', blockAuthenicateSides, accountController.forgotPassword);
router.put('/forgot-password', accountController.checkForgotPassword);
router.get('/reset/:token', blockAuthenicateSides,accountController.resetPassword);
router.put('/reset/:token', accountController.checkResetPassword);
router.get('/personal-information/:_id', requireAuth, checkCurrentUser, accountController.personalInformation);
router.put('/personal-information/:_id', accountController.updateProfile);
router.get('/payment-methods/:_id', requireAuth, checkCurrentUser, accountController.paymentMethods);
router.get('/security&sign-in/:_id', requireAuth, checkCurrentUser, accountController.securityAndSignIn);
router.put('/security&sign-in/:_id', accountController.changePassword);
router.get('/purchase-history/:_id', requireAuth, checkCurrentUser, accountController.purchaseHistory);

module.exports = router;