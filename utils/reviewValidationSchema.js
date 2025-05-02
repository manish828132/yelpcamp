const Joi = require('joi');
const AppError=require('./AppError')
const reviewSchema = Joi.object({
    id: Joi.string().optional(),
    text: Joi.string().required(),
    
    rating: Joi.number().min(0).max(5).required(),
    
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        throw new AppError(message, 400); // or respond with res.status(400).send(message)
    } else {
        next();
    }
};


module.exports=validateReview;