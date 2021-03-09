const User = require('../models/User');
const Order = require('../models/Order');
const createToken = require('../../util/createToken');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const {mongooseToObject, multipleMongooseToObject} = require('../../util/mongoose');
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;


const handleErrors = (err) => {
    
    let errors = {email: '', password: ''};
    console.log(err.message, err.code);

    // SIGN IN: Incorrect email 
    if(err.message === 'Your password or email do not match. Please try again or Reset Your Password.') {
        errors.email = 'Your password or email do not match. Please try again or Reset Your Password.';
    }

    // SIGN IN: Incorrect password 
    if(err.message === 'Wrong password. Try again or Reset Your Password.') {
        errors.password = 'Wrong password. Try again or Reset Your Password.';
    }

    // SIGN IN, RESET: Password too short
    if(err.message === 'Password must be at least 6 characters') {
        errors.password = 'Password must be at least 6 characters';
    }

    // SIGN UP: Duplicate error
    if(err.code === 11000) {
        errors.email = 'Email has already been used';
        return errors;
    }

    // SIGN IN: Account not activated
    if(err.message === 'This account has not been activated please check the email for verification steps') {
        errors.email = 'This account has not been activated please check the email for verification steps';
    }

    // FORGOT PASSWORD: Invalid email
    if(err.message === 'This email does not exist') {
        errors.email = 'This email does not exist';
    }

    // RESET: Reset password link has been used but try to access
    if(err.message === 'You have used this link to reset your password or has been expired. Please try again.') {
        errors.password = 'You have used this link to reset your password or has been expired. Please try again.';
    }

    // CHANGE PASSWORD: Incorrect current password
    if(err.message === 'You entered incorrect password') {
        errors.password = 'You entered incorrect password';
    }

    // CHANGE PASSWORD: New password is the same as current password
    if(err.message === 'New password must be different from current password') {
        errors.password = 'New password must be different from current password';
    }

    // Validate errors
    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
            
        });
    }
    return errors;


}

class AccountController {
    // [GET] /sign-in
    signIn(req, res, next) {
        res.render('./authenticate/sign-in', {layout: 'mainBodyOnly'});
    }

    // [GET] /account/sign-up
    signUp(req, res, next) {
        res.render('./authenticate/sign-up', {layout: 'mainBodyOnly'});
    }

    // [GET] /account/personal-information/:_id
    async personalInformation(req, res, next) {
        
        try {
            const id = req.params._id;
            const user = await User.findById(id);
            res.render('./user/personal-information', {user: mongooseToObject(user)});
        }
        catch (err) {
            console.log(err);
        }
    }

    // [GET] /account/payment-method/:_id
    async paymentMethods(req, res, next) {
        
        try {
            const id = req.params._id;
            const user = await User.findById(id);
            res.render('./user/payment-methods', {user: mongooseToObject(user)});
        }
        catch (err) {
            console.log(err);
        }
    }

    // [GET] /account/security&sign-in/:_id
    async securityAndSignIn(req, res, next) {
        
        try {
            const id = req.params._id;
            const user = await User.findById(id);
            res.render('./user/security-sign-in', {user: mongooseToObject(user)});
        }
        catch (err) {
            console.log(err);
        }
    }

    // [PUT] /account/security&sign-in/:_id
    async changePassword(req, res, next) {
        try {
            const id = req.params._id;
            const user = await User.findById(id);
            if(!user) {
                throw Error('Cannot find user');
            }

            let currentPassword = req.body.currentPassword
            let newPassword = req.body.newPassword;
            console.log(currentPassword);
            console.log(newPassword);
            if(newPassword.length < 6) {
                throw Error('Password must be at least 6 characters');
            }
            if(newPassword === currentPassword) {
                throw Error('New password must be different from current password');
            }
            const auth = await bcrypt.compare(currentPassword, user.password);
            if(!auth) {
                throw Error('You entered incorrect password');
            } 

            const salt = await bcrypt.genSalt();
            newPassword = await bcrypt.hash(newPassword, salt);

            

            await user.updateOne({password: newPassword});
            res.status(200).json({user: user._id});
        }
        catch(err) {
            const errors = handleErrors(err);
            console.log(err);
            res.status(400).json({errors});
        }
    }

    // [PUT] /account/personal-information/:id
    async updateProfile(req, res, next) {
        try{
            const {firstName, lastName, phone, address} = req.body;
            const id = req.params._id;
            const user = await User.findById(id)

            await user.updateOne({firstName: firstName, lastName: lastName, phone: phone, address: address});
            res.status(200).json({user});
        }
        catch(err) {
            console.log(err)
            res.status(400).json({err});
        }
    }

    // [GET] /account/purchase-history/:_id
    async purchaseHistory(req, res, next) {
        const orders = res.paginatedResults.models;
        const {maxPage, nextPage, previousPage} = res.paginatedResults;
        res.render('./user/purchase-history', {order: multipleMongooseToObject(orders), maxPage: maxPage, nextPage: nextPage, previousPage: previousPage});
        
    }



    // [POST] /account/sign-up
    async storeAccount(req, res, next) {
        try {
            // Create new user       
            const user = await User.create(req.body);
            
            res.status(201).json({user: user._id});
        }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }

        
    }

    // [GET] /account/sign-up/verify/:_id
    async verify(req, res, next) {
        try {
            const id = req.params._id;
            console.log(id);
            const user = await User.findById(id);
            console.log(user);
            if(user) {
                res.render('./authenticate/sign-up-verification', {layout: 'mainBodyOnly', user: mongooseToObject(user)});
                
                const token = jwt.sign({_id: user._id}, process.env.ACCOUNT_VERIFICATION_KEY);

                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                      user: 'nguyenhoangnguyen061102@gmail.com',
                      pass: process.env.GMAIL_PASSWORD
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'nguyenhoangnguyen061102@gmail.com',
                    subject: 'Account verification',
                    text: 'To activate your account please click on the link below or copy/paste into browser address bar\n\n' +
                    'http://' + req.headers.host + '/account/verify/' + token + '\n\n' +
                    `Name: ${user.firstName} ${user.lastName}\n` +
                    `Email: ${user.email}\n` + '\n' +
                    'Thanks\n' +
                    'Dev team\n'
                };
                smtpTransport.sendMail(mailOptions, function() {
                    console.log('verification mail sent');
                });
            }
            else {
                throw Error('404 NOT FOUND')
            }
            
        }
        catch (err) {
            res.send('404 NOT FOUND');
        }
    }

    // [GET] /account/verify/:token
    verifySuccess(req, res, next) {
        res.render('./authenticate/verify-success', {layout: 'mainBodyOnly'});
    }

    // [POST] /sign-in
    async checkAccount(req, res, next) {
        const {email, password} = req.body;
        try {
            const user = await User.signIn(email, password);
            if(user.isActivated) {
                const token = createToken(user._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: THREE_DAYS });
                res.status(200).json({user: user._id});
            }
            else {
                throw Error('This account has not been activated please check the email for verification steps');
            }
            
        }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
        
        
        
    }

    // [POST] /sign-out
    signOut(req, res, next) {
        res.cookie('jwt', '', {maxAge: 1});
        res.redirect('/');
    }

    // [GET] /account/forgot-password
    forgotPassword(req, res, next) {
        res.render('./authenticate/forgot-password', {layout: 'mainBodyOnly'});
    }

    // [PUT] /account/forgot-password
    async checkForgotPassword(req, res, next) {
        try {
            const {email} = req.body;
            const user = await User.findOne({email: email});
            if(!user) {
                throw Error('This email does not exist');
            }
            const token = jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '15m'});
            await user.updateOne({resetPasswordToken: token})
            
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: 'nguyenhoangnguyen061102@gmail.com',
                  pass: process.env.GMAIL_PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'nguyenhoangnguyen061102@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/account/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function() {
                console.log('forgot password mail sent');
            });
            res.status(200).json({user: user._id});
        }
        catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
    }

    // [GET] /account/reset/:token
    resetPassword(req, res, next) {
        const token = req.params.token;
        console.log('token ' + token);
        jwt.verify(token, process.env.RESET_PASSWORD_KEY, function (err){
            if(err) {
                res.status(400).json({error: 'This link is invalid or has been expired'});
            }
            res.render('./authenticate/reset',{layout: 'mainBodyOnly'});
        })
        
    }

    // [PUT] /account/reset/:token
    async checkResetPassword(req, res, next) {
        try {
            const token = req.params.token;
            const user = await User.findOne({resetPasswordToken: token});
            if(!user) {
                throw Error('You have used this link to reset your password or has been expired. Please try again.');
            }

            let newPassword = req.body.password;
            
            if(newPassword.length < 6) {
                throw Error('Password must be at least 6 characters');
            }

            const salt = await bcrypt.genSalt();
            newPassword = await bcrypt.hash(newPassword, salt);

            

            await user.updateOne({password: newPassword, resetPasswordToken: ''});
            res.status(200).json({user: user._id});
        }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
    }


}

module.exports = new AccountController;