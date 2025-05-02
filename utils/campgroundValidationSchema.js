const Joi = require('joi');
const AppError=require('./AppError')
const campgroundSchema = Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    image: Joi.string().uri().optional()
});

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        throw new AppError(message, 400); // or respond with res.status(400).send(message)
    } else {
        next();
    }
};


module.exports=validateCampground
