const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');

// Check user sign in
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check json web token exists and is verified
    if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
        console.log(err.message);
        res.redirect('/account/sign-in');
        } else {
        next();
        }
    });
    } else {
    res.redirect('/account/sign-in');
    }
};

// Render user to views
const renderUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = mongooseToObject(user);
                next();
                
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}

// Check if user has already signed in but still try to access authenticate sides 
const blockAuthenicateSides = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, err => {
            if(err) {
                next();
            }
            else {
                res.redirect('/');
            }
        });
    }
    else {
        next();
    }
}

module.exports = { requireAuth, renderUser, blockAuthenicateSides };