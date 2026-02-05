const joi = require('joi');
const ArticleModel = require('../models/article.model.js');

// Creating a new article
const postArticle = async (req, res, next) => {
    const articleSchema = joi.object({
        title: joi.string().min(5).required(),
        content: joi.string().min(20).required(),
        author: joi.string().optional().default("Guest"),
        // Added Joi validation for the new backend fields
        tags: joi.array().items(joi.string()).optional(),
        status: joi.string().valid("draft", "published", "archived").optional()
    });

    const {error, value} = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        // Spread the value to include title, content, author, tags, and status
        const newArticle = new ArticleModel({ ...value });
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

// Getting all articles (Updated with filtering logic)
const getAllArticle = async (req, res, next) => {
    const { limit = 10, page = 1, status, tag } = req.query;
    const skip = (page - 1) * limit;

    try {
        // Build a filter object for status or tags if they exist in the URL
        const filter = {};
        if (status) filter.status = status;
        if (tag) filter.tags = tag;

        const articles = await ArticleModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        return res.status(200).json({
            message: "Articles fetched",
            results: articles.length,
            data: articles
        });
    } catch (error) {
        next(error);
    }
};

// --- BONUS QUESTION 5: SEARCH FUNCTION ---
const searchArticles = async (req, res, next) => {
    try {
        const { q } = req.query; // Captures the keyword from ?q=keyword

        if (!q) {
            return res.status(400).json({ message: "Search query 'q' is required" });
        }

        // Uses the $text index we created in the model
        const articles = await ArticleModel.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } } // Optional: tracks relevance score
        ).sort({ score: { $meta: "textScore" } }); // Sorts by most relevant match

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
        // Improvement: We increment the readCount every time an article is fetched by ID
        const article = await ArticleModel.findByIdAndUpdate(
            req.params.id, 
            { $inc: { readCount: 1 } }, 
            { new: true }
        );

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
        next(error);
    }
};

// Updating article by ID
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
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            { ...value },
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: "article not found" });
        }

        return res.status(200).json({
            message: "Article updated successfully",
            data: updatedArticle
        });
    } catch (error) {
        next(error);
    }
};

// Deleting article by ID
const deleteArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
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
    searchArticles // Don't forget to export the new search function!
};
