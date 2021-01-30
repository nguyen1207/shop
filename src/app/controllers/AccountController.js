const User = require('../models/User')
const createToken = require('../../util/createToken');
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

const handleErrors = (err) => {
    
    let errors = {email: '', password: ''};
    console.log(err.message, err.code);

    // Incorrect email 
    if(err.message === 'Your password or email do not match. Please try again or Reset Your Password.') {
        errors.email = 'Your password or email do not match. Please try again or Reset Your Password.';
    }

    // Incorrect password 
    if(err.message === 'Wrong password. Try again or click Forgot password to reset it.') {
        errors.password = 'Wrong password. Try again or click Forgot password to reset it.';
    }

    // Duplicate error
    if(err.code === 11000) {
        errors.email = 'Email has already been used';
        return errors;
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
        res.render('sign-in');
    }

    // [GET] /account/sign-up
    signUp(req, res, next) {
        res.render('sign-up');
    }

    // [GET] /account/:_id
    myAccount(req, res, next) {
        res.send('myAccount');
    }

    // [POST] /account/sign-up
    async storeAccount(req, res, next) {
        try {
            // Create new user       
            const user = await User.create(req.body);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: THREE_DAYS });
            
            res.status(201).json({user: user._id});
        }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }

        
    }

    // [POST] /sign-in
    async checkAccount(req, res, next) {
        const {email, password} = req.body;
        try {
            const user = await User.signIn(email, password);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: THREE_DAYS });
            res.status(200).json({user: user._id});
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
}

module.exports = new AccountController;