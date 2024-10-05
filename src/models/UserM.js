import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    userLevel: {
        type: String,
        enum: ['user', 'admin'],  // ENUM equivalent in Mongoose
        default: 'user',
        required: true,
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt timestamps
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;
