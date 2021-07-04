const express = require('express');
const router = express.Router();
// const createError = require('http-errors');
const { authUser } = require('../config/basicAuth');
// const FormatDate = require('../config/formater');

const indexController = require('../controllers/indexController');

/* differentes load */

//Appel GET
router.get('/', indexController.index);
router.get('/article/:slug', indexController.getArticle);
router.get('/allarticles', indexController.getAllArticles);

//Appel POST
router.put('/article/:slug/toggleLikeArticle', authUser, indexController.likeArticle );
router.post('/:slug', authUser, indexController.commentArticle);    

module.exports = router;
