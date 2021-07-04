const ObjectID = require('mongoose').Types.ObjectId;
//Load models
const {User, Article, Comment} = require('../models/schemas');


const dashboard = async (req, res) => {
    try {
        const allusers = await User.find({}).estimatedDocumentCount();
        const allarticles = await Article.find({}).estimatedDocumentCount();
        
        const users = await User.find({}).sort('desc').limit(3).select('-password');
        const articles = await Article
        .find().limit(3).sort({'_id':-1})
        .populate("user", "pseudo")
        .populate({
            path: 'comments',
            select: 'msg',
            populate:{
                path: 'user',
                select: 'pseudo'
            }
        });
        res.render('admin/dashboard',{layout: './layouts/admin_layout',allusers, allarticles, users, articles, title:"Votre espace adminitrateur de erdcinfo"});
    } catch (err) {
        res.render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
    }
}

const getAddArticle = async (req, res) => {
    try {
        res.render('admin/add', {layout: './layouts/admin_layout', article: new Article(), title: "Créer un nouveau article"});
    } catch (err) {
        res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' })
    }
    
}

const getEditArticle = async (req, res) => {

    const articleId = req.params.id;

    if (!ObjectID.isValid(articleId))
        return res.status(404).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
    else try {
        await Article.findById(articleId, (err, article) => {
            if (!err) return res.render('admin/edit', {layout: './layouts/admin_layout', article, title: "Mondifier l'article"});
            else return res.status(404).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
        });
         
    } catch (error) {
        res.render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
    }
}

const getAllArticles = async (req, res) => {
    try {
        const articles = await Article
        .find().sort({'_id':-1})
        .populate("user", "pseudo")
        .populate({
            path: 'comments',
            select: 'msg',
            populate:{
                path: 'user',
                select: 'pseudo'
            }
        });

        res.render('admin/allarticles', {layout: './layouts/admin_layout', articles, title: 'Page de tous les articles'});
    } catch (err) {
        res.render('errorHandler', {err: err});
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({'_id':-1});
        res.render('admin/allusers', {layout: './layouts/admin_layout', users, title: 'Page de tous les utilisteurs'});
    } catch (err) {
        res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
    }
}

const postAddArticle = async (req, res, next) => {
    req.article = new Article();
    next()
};

const putEditArticle = async (req, res, next) => {
    const articleId = req.params.id;

    req.article = await Article.findById(articleId);
    next();
}

const deleteArticle = async (req, res) => {

    const userId = req.user.id;
    const articleId = req.params.id;

    if (!ObjectID.isValid(articleId))
        return res.redirect('errorHandler');
    else try {
        await Article.findByIdAndDelete(articleId, async (err, docs) => {

            if (err) return res.status(400).json(err);
            else await User.findOneAndUpdate(userId,
                {
                    $pull: {articles: articleId}
                }, 
                {new: true},
                (err, docs) => {
                    if (err) return res.status(400).json(err);
                }
            ).select('-password');  
            return res.redirect('/admin/allarticles');
        });

    } catch (error) {
        res.redirect('errorHandler', {error});
    }
}

const deleteUser = async (req, res) => {

    const userId = req.user.id

    if (!ObjectID.isValid(userId))
        return res.redirect(404, 'errorHandler');

    else try {
        await User.findByIdAndDelete(userId, (err, docs) => {
            if (!err) return res.redirect('../admin/allusers');
            else return res.redirect('errorHandler');
        });

    } catch (error) {
        res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
    }
}

module.exports = {
    dashboard,
    getAddArticle,
    getEditArticle,
    getAllArticles,
    getAllUsers,
    postAddArticle,
    putEditArticle,
    deleteArticle,
    deleteUser
}