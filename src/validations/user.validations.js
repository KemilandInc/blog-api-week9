  const Joi = require('joi');
  const registerSchema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

     const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });


const validateRegister = (req, res, next) => {
    const {error} = registerSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const {error} = loginSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }

    next();
};

module.exports = { validateRegister, validateLogin };    

