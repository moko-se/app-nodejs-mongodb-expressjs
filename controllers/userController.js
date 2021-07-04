const bcrypt = require('bcryptjs');
const passport = require('passport');

//Load models
const {User} = require('../models/schemas');

const signInGet = async (req, res) => {
    try {
        res.render('auth/login', {layout: './layouts/account_layout', title: "Se connecter" });
    } catch (err) {
        res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' });
    }
}

const signUpGet = async (req, res) => {
    try {
        res.render('auth/register', {layout: './layouts/account_layout', user: req.user, title: "S'inscrire" });
    } catch (err) {
        res.status(500).render('errorHandler', {layout: './layouts/account_layout', title: 'page error' })
    }
    
}

const signUpPost = async (req, res) => {
    const { pseudo, email, password, password2 } = req.body;
    let errors = [];

    if (!pseudo || !email || !password || !password2){
        errors.push({msg: 'Veuillez renseignez tous les champs'});
    }
    if (email) {
        var expressionReguliere = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
        if (!expressionReguliere.test(email)) {
            errors.push({msg: 'Cet email est incorrect !'});
        }
    }
    if (password !== password2) {
        errors.push({msg: 'Les mots de passe ne correspondent pas !'});
    }
    if (password) {
        if (password.length < 6) {
            errors.push({msg: 'Les mots de passe doivent contenir au moins 8 caractères !'});
        }
    }

    if (errors.length > 0) {
        res.render('auth/register', {layout: './layouts/account_layout', errors, pseudo, email, password, password2, user: req.user, title: 'Page de création de compte erdcinfo'});
    }else{
        User.findOne({email: email}).then(user => {
            if (user) {
                errros.push({msg: "Cet email existe déja !"});
                res.render('auth/register', {errors, pseudo, email, password, password2, title: 'Page de création de compte erdcinfo'});
            }else{
                const newUser = new User({
                    pseudo,
                    email,
                    password 
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            req.flash(
                                'success_msg',
                                'Vous êtes maintenant inscris et pouvez vous connecter'
                            );
                            res.redirect('signin');
                        })
                        .catch(err => err);
                    });
                });
            }
        });
    }
}

const signInPost = async (req, res, next) => {

    const { email, password } = req.body;
    let errors = [];

    if ( !email || !password ){
        errors.push({msg: 'Veuillez renseignez tous les champs'});
    }
    if ( errors.length > 0 ){
        res.render('auth/login', { layout: './layouts/account_layout', errors,title: "Se connecter" })
    } else {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/signin',
            failureFlash: true
        })(req, res, next);
    }
}

const logout = async (req, res) => {
    req.logout();
    req.flash('success_msg', 'A bientôt pour des nouvelles actualités!');
    res.redirect('/');
}

module.exports = {
    signInGet,
    signUpGet,
    signUpPost,
    signInPost,
    logout
}