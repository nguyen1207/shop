const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

const checkSessionIdStripe = async (req, res, next) => {
    const sessionId = req.query.session_id;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
    }
    catch (err) {
        res.redirect('/');
        return;
    }
    
    
    next();
}

module.exports = checkSessionIdStripe;