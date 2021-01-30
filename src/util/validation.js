// Validation
const Joi = require('@hapi/joi');

const signUpValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required(),
    
    });

    return schema.validate(data);
}

const signInValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}

module.exports.signUpValidation = signUpValidation;
module.exports.signInValidation = signInValidation;
