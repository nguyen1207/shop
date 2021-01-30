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
    password: { 
        type: String, 
        required: [true, 'Please enter a password'], 
        minlength: [6, 'Password must be at least 6 characters'],
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
        throw Error('Wrong password. Try again or click Forgot password to reset it.');
    }
    throw Error('Your password or email do not match. Please try again or Reset Your Password.');
}

module.exports = mongoose.model('User', User);
