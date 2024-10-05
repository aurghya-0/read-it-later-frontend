import mongoose from 'mongoose';

const apiKeysSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User model
        ref: 'User',
        required: true,
    },
    apiKey: {
        type: String,
        required: true,
    },
    keyName: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true  // Automatically manage createdAt and updatedAt fields
});

// Create the model from the schema
const APIKeys = mongoose.model('APIKeys', apiKeysSchema);

export default APIKeys;
