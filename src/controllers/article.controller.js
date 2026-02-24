const joi = require('joi');
const ArticleModel = require('../models/article.model.js');

// Creating a new article
const postArticle = async (req, res, next) => {
    const articleSchema = joi.object({
        title: joi.string().min(5).required(),
        content: joi.string().min(20).required(),
        author: joi.string().optional().default("Guest"),
        tags: joi.array().items(joi.string()).optional(),
        status: joi.string().valid("draft", "published", "archived").optional()
    });

    const {error, value} = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const newArticle = new ArticleModel({ 
            title: req.body.title,
            content: req.body.content,
            author: req.user._id // Automatically link the article to the logged-in user
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
    try {
        const articles = await ArticleModel.find().populate("author", "name _id email")
            
        return res.status(200).json({
            message: "Articles fetched",
            data: articles
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Search function
const searchArticles = async (req, res, next) => {
    try {
        const { q } = req.query; 
        if (!q) {
            return res.status(400).json({ message: "Search query 'q' is required" });
        }
        const articles = await ArticleModel.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        return res.status(200).json({
            message: `Search results for: ${q}`,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        next(error);
    }
};

// Getting article by ID
const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findByIdAndUpdate(
            req.params.id, 
            { $inc: { readCount: 1 } }, 
            { new: true }
        );

        if (!article) {
            return res.status(404).json({ message: `Article with ${req.params.id} not found` });
        }
        return res.status(200).json({
            message: "Article fetched successfully",
            data: article
        });
    } catch (error) {
        next(error);
    }
};

// Updating article by ID (With Ownership Check)
const updateArticleById = async (req, res, next) => {
    const articleSchema = joi.object({
        title: joi.string().min(5).optional(),
        content: joi.string().min(20).optional(),
        author: joi.string().optional(),
        tags: joi.array().items(joi.string()).optional(),
        status: joi.string().valid("draft", "published", "archived").optional()
    });

    const { error, value } = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json("Validation failed. Please check your input.");
    }
    
    try {
        // 1. Find the article first
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // 2. OWNERSHIP CHECK: Compare article author ID with the logged-in user's ID
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only edit your own articles" });
        }

        // 3. Update only if ownership is verified
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            { ...value },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Article updated successfully",
            data: updatedArticle
        });
    } catch (error) {
        next(error);
    }
};

// Deleting article by ID (With Ownership Check)
const deleteArticleById = async (req, res, next) => {
    try {
        // 1. Find the article first
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // 2. OWNERSHIP CHECK: Ensure user is the creator
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own articles" });
        }

        // 3. Delete only if ownership is verified
        await ArticleModel.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles
};
