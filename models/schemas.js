const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const Schema = mongoose.Schema;

/* create UserSchema */
const userSchema = new Schema({
    pseudo:{
        type: String,
        required: true,
        lowercase: true,
        minLength: 3,
        maxLength: 130,
        unique: true
    },
    email:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 255,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 1024
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    }],
    articles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    }],
    com :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    avatar: {
        type: String,
        enum: ['admin.png', 'user.png'],
        default: 'user.png'
    },
    role:{
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true});

/* create articleSchema */
const articleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    picture:{
        type: String
    },
    content:{
        type: String,
        required: true
    },
    reading:{
        type: Number,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    likers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {timestamps: true});

/* create commentSchema */
const commentSchema = new Schema({
    msg:{
        type: String,
        require: true,
        maxLength: 200
    },
    user:{
    	type: Schema.Types.ObjectId, 
    	ref:'user'
    },
    article:{
    	type: Schema.Types.ObjectId,
    	ref:'article'
    }
}, {timestamps: true});


// GETTERS
articleSchema.path('createdAt')
.get(function(dateFormat){
    const intl = new Intl.DateTimeFormat("fr-FR", {
        hour12: false,
        day: "numeric",
        month: "long"
    });

    return intl.format(dateFormat);
})

articleSchema.path('updatedAt')
.get(function(dateFormat){
    const intl = new Intl.DateTimeFormat("fr-FR", {
        hour12: false,
        day: "numeric",
        month: "long"
    });

    return intl.format(dateFormat);
})

userSchema.path('createdAt')
.get(function(dateFormat){
    const intl = new Intl.DateTimeFormat("fr-FR", {
        hour12: false,
        day: "numeric",
        month: "long",
        year: 'numeric'
    });

    return intl.format(dateFormat);
})

userSchema.path('updatedAt')
.get(function(dateFormat){
    const intl = new Intl.DateTimeFormat("fr-FR", {
        hour12: false,
        day: "numeric",
        month: "long",
        year: 'numeric'
    });

    return intl.format(dateFormat);
})

commentSchema.path('createdAt')
.get(function(dateFormat){
    const intl = new Intl.DateTimeFormat("fr-FR", {
        hour12: false,
        day: "numeric",
        month: "long"
    });

    return intl.format(dateFormat);
})

// SETTERS
// MIDDLEWARES
articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title, { lower: true, strict: true})
    }
    if (this.content) {
        this.sanitizedHtml= dompurify.sanitize(marked(this.content))
    }
    next()
});


const User = mongoose.model('user', userSchema);
const Article = mongoose.model('article', articleSchema);
const Comment = mongoose.model('comment', commentSchema);

module.exports = {
    User,
    Article,
    Comment
}
