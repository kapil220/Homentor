const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', process.env.MONGO_URI ? 'Defined (length: ' + process.env.MONGO_URI.length + ')' : 'Undefined');
        
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined. Check if .env exists in ' + __dirname);
        }

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('SUCCESS: MongoDB Connected!');
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: Could not connect to MongoDB');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        process.exit(1);
    }
};

testConnection();
