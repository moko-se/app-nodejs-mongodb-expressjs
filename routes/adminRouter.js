//Appel des modules
const express = require('express');
const router = express.Router();
const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/upload/post')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine});
//Use adminController
const adminController = require('../controllers/adminController');
const { User } = require('../models/schemas');
const { authUser, userRole } = require('../config/basicAuth');
//Appel GET 
//tableau de bord
router.get('/dashboard', authUser, userRole('admin'), adminController.dashboard);
router.get('/add', authUser, userRole('admin'), adminController.getAddArticle);
router.get('/edit/:id', authUser, userRole('admin'), adminController.getEditArticle);
router.get('/allarticles', authUser, userRole('admin'), adminController.getAllArticles);
router.get('/allusers', authUser, userRole('admin'), adminController.getAllUsers);

//Appel POST
router.post('/add', upload.single('picture'), authUser, userRole('admin'), adminController.postAddArticle, saveArticleAndRedirect('add'));
router.put('/edit/:id', upload.single('picture'), authUser, userRole('admin'), adminController.putEditArticle, saveArticleAndRedirect('edit'));

// Appel DELETE 
router.delete('/:id',authUser, userRole('admin'), adminController.deleteArticle);


// Appel function 
function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.picture = req.file.filename
        article.content = req.body.content
        article.reading = req.body.reading
        article.user = req.user.id

        try {
            const user = await User.findOne(article.user, '-password');
            await article.save((err, docs) => {
                if (err) {
                    return err.stack
                }else{
                    let articleID = docs.id;

                    user.articles.push(articleID);
                    user.save();
                    res.redirect(`/article/${article.slug}`);
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    }
}
module.exports = router;