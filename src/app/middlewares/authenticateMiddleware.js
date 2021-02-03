const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');

// Check user sign in
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check json web token exists and is verified
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/account/sign-in');
            } else {
                next();
            }
        });
    } 
    else {
        res.redirect('/account/sign-in');
    }
};

// Check current user to render user's profile page
const checkCurrentUser = (req, res, next) => {
    const idSlug = req.params._id;
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err);
                res.redirect('/');
            }
            else if(idSlug === decodedToken.id) {
                next();
            }
            else {
                res.send('404 NOT FOUND');
            }
        })
    }
    else {
        res.send('404 NOT FOUND');
    }
    
};

// Check verification link when user sign up
const checkVerificationLink = (req, res, next) => {
    const token = req.params.token;
    if(token) {
        jwt.verify(token, process.env.ACCOUNT_VERIFICATION_KEY, async (err, decodedToken) => {
            if(err) {
                console.log(err);
                res.send('404 NOT FOUND');
            }
            else {
                const user = await User.findById(decodedToken._id);
                if(!user) {
                    res.send('User not found');
                }
                else {
                    await user.updateOne({isActivated: true});
                    next();
                }
            }
        });
        
    }
    else {
        res.send('404 NOT FOUND');
    }
}


// Render user to views
const renderUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
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
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, err => {
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



module.exports = { requireAuth, checkCurrentUser, checkVerificationLink, renderUser, blockAuthenicateSides };