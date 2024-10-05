import mongoose from 'mongoose';
import User from './User.js';  // Assuming you have a User model defined in Mongoose

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    classification: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publish_date: {
        type: Date,
        required: true,
    },
    article_text: {
        type: String,
        required: true,
    },
    article_summary: {
        type: String,  // Can be null, hence no required constraint
    },
    article_link: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referencing the User model
        required: true,
    }
}, {
    timestamps: true  // Automatically manage `createdAt` and `updatedAt`
});

// Create the model based on the schema
const Article = mongoose.model('Article', articleSchema);

export default Article;
