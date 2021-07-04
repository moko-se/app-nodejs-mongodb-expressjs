const ObjectID = require('mongoose').Types.ObjectId;
//Load models
const {User, Article, Comment} = require('../models/schemas');


const index = async (req, res) => {
    try{
		const article_featured = await Article.find().sort({'_id':-1}).limit(1).populate("user", "pseudo");
		const articles = await Article.find().sort({createdAt: '-1'}).limit(2).populate("user", "pseudo");
		res.render('index', {layout: './layouts/index_layout', article_featured, articles, title:'Votre page d\'accueil erdcinfo - entreprendre en République Démocratique du Congo' });
	}catch(error){
    	res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
	}
}

const getArticle = async (req, res) => {

    try{
		const article = await Article
		.findOne({slug: req.params.slug})
		.populate("user", "-password")
		.populate ({
			path: 'comments',
			populate:({
				path: 'user',
				select: '-password'
			})
		});
		
		if (article !== null) {
			const articles = await Article.find().sort({ creatdAt:'desc'}).populate("user", "-password").limit(5);
			res.render('show/article', { layout: './layouts/account_layout', article, articles, title: 'Page view de erdcinfo'});	
		} else return res.status(404).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' })
	}catch(error){
		res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' } );
	}
}

const getAllArticles = async (req, res) => {
    try{
		const articles = await Article.find().sort({creatdAt: 'desc'});
  		res.render('show/allarticles', {layout: './layouts/account_layout', articles, title: "Tous les articles d'entreprendre en République Démocratique du Congo (RDC) "});
	}catch(err){
		res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
	}
}

const commentArticle = async (req, res) => {
	const user = req.user;

	try {	
		const article = await Article.findOne({slug: req.params.slug});
		if (article) {
			
			const newCom = new Comment({
				msg: req.body.msg,
				user: user.id,
				article: article.id
			});

			const com = await newCom.save();

			await User.findOneAndUpdate(user.id,
			{ $addToSet: { com: com.id } },
			{new: true},
			(err, docs) => {
				if (err) res.status(404).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
			});
		
			await Article.findOneAndUpdate({slug: req.params.slug},	
			{ $addToSet: { comments: com.id } },
			{new: true},
			(err, docs) => {
				if (err) return res.status(404).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
			});

			// req.flash('success_msg', 'Votre commentaire à bien été enregistrée');
			res.redirect(301, `/article/${article.slug}`);
		}

	} catch (error) {
		res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
	}
}

const likeArticle = async (req, res) => { 
	const user = req.user;

	try {

		const article = await Article.findOne({slug: req.params.slug});

		if (article) {

			let isLiked = false;
			for (let a = 0; a < article.likers.length; a++) {
				let liker = article.likers[a];

				if (liker._id.toString() == user._id.toString()) {
					isLiked = true;
					break;
				}
			}

			if (isLiked) {

				await Article.findOneAndUpdate(
					{slug: req.params.slug},
				{
					$pull: {likers: user.id}
				},
				{ new: true },
				(err, docs) => {
					if (err) return res.status(400).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
				})

				await User.findOneAndUpdate(
					user.id,
				{
					$pull: {likes: article.id}
				},
				{ new: true },
				(err, docs) => {
					if (err) return res.status(400).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
					else return res.redirect(301, `/article/${article.slug}`);
				})

			} else {

				await Article.findOneAndUpdate(
					{slug: req.params.slug},
				{
					$addToSet: {likers: user.id}
				},
				{ new: true },
				(err, docs) => {
					if (err) return res.status(400).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
				})
				
				await User.findOneAndUpdate(
					user.id,
				{
					$addToSet: {likes: article.id}
				},
				{ new: true },
				(err, docs) => {
					if (err) return res.status(400).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
					else return res.redirect(301, `/article/${article.slug}`);
				})
			}
		}

	} catch (err) {
		res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
	}
}

module.exports = {
	index, 
   	getArticle,
   	getAllArticles,
	commentArticle,
	likeArticle
}
