const {multipleMongooseToObject} = require("../../util/mongoose")
var Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

class SiteController {

    // [GET] /
    index(req, res, next) { 
        res.render('home');
    
    }

    // [GET] /search
    search(req, res, next) {
        const products = res.paginatedResults.models;
        const keywords = req.query.q;
        const {maxPage, nextPage, previousPage} = res.paginatedResults;
        res.render('search', {products: multipleMongooseToObject(products), q: keywords, maxPage: maxPage, nextPage: nextPage, previousPage: previousPage});
        
    }

    // [GET] /add-to-cart/:_id
    addToCart(req, res, next) {
        const productID = req.params._id;
        const productQuantity = parseInt(req.query.quantity);

        var cart = new Cart(req.session.cart ? req.session.cart : {});
        Product.findById(productID, function (err, product) {
            if(err) return next(err);
            if(product) { 
                cart.add(product, product._id, productQuantity);
                req.session.cart = cart;
                res.redirect(`/category/${product.category}`);
            }
        })
        
    }

    // [GET] /change-quantity/:_id
    changeQuantity(req, res, next) {
        const productId = req.params._id;
        const quantity = parseInt(req.query.quantity);
        var cart = new Cart(req.session.cart);
        Product.findById(productId, function (err, product) {
            if(err) {
                return next(err);
            }
            if(product) {
                cart.changeQuantity(product, productId, quantity);
                req.session.cart = cart;
                res.redirect('back');
            }
        })

    }

    // [GET] /remove/:_id
    removeFromCart(req, res, next) {
        const productID = req.params._id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.remove(productID);
        req.session.cart = cart;
        res.redirect('back');
    }

    // [GET] /checkout
    checkout(req, res, next) {
        if(!req.session.cart) {
           return res.render('checkout', {products: null});
        }
        var cart = new Cart(req.session.cart);
        res.render('checkout', {layout: 'mainBodyOnly', products: cart.generateArray(), totalQuantity: cart.totalQuantity, totalPrice: cart.totalPrice, stripePublicKey: stripePublicKey});
    }
    
    // [POST] /purchase
    async purchase(req, res, next) {
        const products = req.body.items;
        var orders = [];
        for(var i = 0; i < products.length; i++) {
            const quantity = products[i].quantity
            const product = await Product.findById(products[i].id);
            if(!product) {
                res.json({message: 'product not found'});
                return;
            }
            orders.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: quantity,
            })

        }
       
        const session = await stripe.checkout.sessions.create({           
            payment_method_types: ['card'],
            line_items: orders,
            mode: 'payment',
            customer_email: res.locals.user.email,
            success_url: 'http://localhost:3000/purchase-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/checkout',
        })
        
        res.json({ id: session.id });
        
    }

    async purchaseSuccess(req, res, next) {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        
        if(session.payment_status === 'paid') {
            
            const order = await Order.create({
                id: session.payment_intent,
                customerEmail: session.customer_email,
                price: session.amount_total,
                items: req.session.cart.items,
            });
            req.session.cart = {};
            res.render('purchase-success', {layout: 'mainBodyOnly'});
        }
        
    }

}   

module.exports = new SiteController;