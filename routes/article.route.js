const express = require('express');

const {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles // Added the new search function from the controller
  }  = require('../controllers/article.controller.js');

const router = express.Router();

router.post('/articles', postArticle);

router.get('/articles', getAllArticle);

// --- BONUS QUESTION 5: SEARCH ROUTE ---
// This must be ABOVE the /:id route so it doesn't get confused for an ID
router.get('/articles/search', searchArticles);

router.get('/articles/:id', getArticleById);

router.put('/articles/:id', updateArticleById);

router.delete('/articles/:id', deleteArticleById);

module.exports = router;
