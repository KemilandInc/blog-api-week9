const express = require('express');

const {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById
  }  = require('../controllers/article.controller.js');

const router = express.Router();

router.post('/articles', postArticle);

router.get('/articles', getAllArticle);

router.get('/articles/:id', getArticleById);

router.put('/articles/:id', updateArticleById);

router.delete('/articles/:id', deleteArticleById);
module.exports = router;