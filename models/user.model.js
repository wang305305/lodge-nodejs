const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    username: {
        type: String,
        required: 'Username cannot be empty'
    },
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
    },
    wishList: [String],
    deposit: {
        type: Boolean
    },
    verificationToken: {
        type: String
    },
    emailVerified: {
        type: Boolean
    },
    resetToken: {
        token: {
            type: String
        },
        timeStamp: {
            type: Number
        }
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

userSchema.methods.generateJWT = function (req, res) {
    console.log(this.username)

    const JWT = jwt.sign(
        {
            username: req.body.username
        },
        'PrivKey',
        { expiresIn: "100m" }
    );
    console.log(JWT)
    return res.cookie("token", JWT, {
        secure: false,
        httpOnly: false,
    })
};

module.exports = mongoose.model('User', userSchema, 'users')