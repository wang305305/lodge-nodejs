const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
    email: {
        type: String,
        required: 'Email cannot be empty'
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: 'Password cannot be empty'
    },
    lodgeOwner: {
        type: Boolean
    }
}
);

userSchema.pre('save', async function save(next) {
    try {
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
    next();
})


module.exports = mongoose.model('User', userSchema, 'users' )