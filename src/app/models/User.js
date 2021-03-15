const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const User = new Schema({
    firstName: { 
        type: String, 
        required: true,
    },
    lastName: { 
        type: String, 
        required: true,
    },
    email: { 
        type: String, 
        required: true, 
        required: [true, 'Please enter an email'], 
        validate: [isEmail, 'Please enter a valid email'], 
        unique: true, 
        lowercase: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    password: { 
        type: String, 
        required: [true, 'Please enter a password'], 
        minlength: [6, 'Password must be at least 6 characters'],
    },
    resetPasswordToken: {
        type: String,
        default: undefined,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    wishList: {
        type: Array,
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
});


// Hash password
User.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login user
User.statics.signIn = async function(email, password) {
    const user = await this.findOne({ email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        } 
        if(password.length < 6) {
            throw Error('Password must be at least 6 characters');
        }
        throw Error('Wrong password. Try again or Reset Your Password.');
    }
    throw Error('Your password or email do not match. Please try again or Reset Your Password.');
}

module.exports = mongoose.model('User', User);
