const Joi = require('joi');
const AppError=require('./AppError')
const userSchema = Joi.object({
    id: Joi.string().optional(),
    email: Joi.string().required(),
    
   // rating: Joi.number().min(0).max(5).required(),
    
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        throw new AppError(message, 400); // or respond with res.status(400).send(message)
    } else {
        next();
    }
};


module.exports=validateUser;