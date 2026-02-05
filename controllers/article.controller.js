const joi = require('joi');

const ArticleModel = require('../models/article.model.js');

// Creating a new article
const postArticle = async (req, res, next) => {
    const articleSchema = joi.object({
        title: joi.string().min(5).required(),
        content: joi.string().min(20).required(),
        author: joi.string().optional().default("Guest"),
    });
    const {error, value} = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            error,
        });
    }
    try {
        const {title, content, author} = value;
        const newArticle = new ArticleModel({
            title,
            content,
            author: author || "Guest"
        });
        await newArticle.save();

        return res.status(200).json({
            message: 'Article created successfully',
            data: newArticle
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Getting all articles
const getAllArticle = async (req, res, next) => {
    const {limit = 10, page = 1} = req.query;

    const skip = (page - 1) * limit;

    try {
        const articles = await ArticleModel.find({}).sort({createdAt: -1})
            .limit(limit)
            .skip(skip)   ;
        return res.status(200).json({
            message: "Articles fetched",
            data: articles
        });
    } catch (error) {
        next(error);
    }
};

// Getting article by ID
const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: `Article with ${req.params.id} not found`
            });
        }
        return res.status(200).json({
            message: "Article fetched successfully",
            data: article
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Updating article by ID
const updateArticleById = async (req, res, next) => {

      const articleSchema = joi.object({
        title: joi.string().min(5).optional(),
        content: joi.string().min(20).optional(),
        author: joi.string().optional(),
    });
    const {error, value} = articleSchema.validate(req.body);
     if (error) {
        return res.status(400).json("Please provide article title and content");
    }
    
    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            {...value},
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedArticle) {
            return res.status(404).json({message: "article not found"
            });
        }

        return res.status(200).json({
            message: "Article updated successfully",
            data: updatedArticle
        });


    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Deleting article by ID
const deleteArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: 'Article not found'
            });
        }

        res.status(200).json({
            message: 'Article deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById
};
