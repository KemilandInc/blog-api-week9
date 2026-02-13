const express = require('express');

const {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles // Added the new search function from the controller
  }  = require('../controllers/article.controller.js');

  const requireAuth = require('../middlewares/requireAuth.js');

const router = express.Router();

router.post('/articles', requireAuth, postArticle);

router.get('/articles', requireAuth, getAllArticle);

//  BONUS QUESTION 5: SEARCH ROUTE 
// Must be ABOVE the /:id route so it doesn't get confused for an ID
router.get('/articles/search', searchArticles);

router.get('/articles/:id', requireAuth, getArticleById);

router.put('/articles/:id', requireAuth, updateArticleById);

router.delete('/articles/:id', requireAuth, deleteArticleById);

module.exports = router;
