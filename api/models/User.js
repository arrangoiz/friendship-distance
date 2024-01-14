monggoose = require('mongoose');
const Schema = monggoose.Schema;

const UserSchema = new monggoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name']
    },
    email: {
        type: String,
        required: [true, 'Please enter the name']
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = monggoose.model('User', UserSchema);