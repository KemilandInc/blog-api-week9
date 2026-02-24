const Joi = require('joi');

const CreateArticleSchema = Joi.object ({
    title: Joi.string().min(200).required().trim(),
    content: Joi.string().min(20).required(),
})

const validateArticle = (req, res, next) => {
    console.log(req.body)
    const {error} = CreateArticleSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }

    next();
};

const   UpdateArticleSchema = Joi.object({
      title: Joi.string().min(5).max(200).trim(),
    content: Joi.string().min(20).trim(),
});

const validateUpdateArticle = (req, res, next) => {
    const {error} = UpdateArticleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    
    }
}