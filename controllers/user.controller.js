const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const User = require('../models/user.model');
const { use } = require('bcrypt/promises');
let apiUrl

if (process.env.NODE_ENV === 'development') {
    apiUrl = 'http://localhost:3000'
}

if (process.env.NODE_ENV === 'production') {
    apiUrl = "https://api.lodgeexp.com"
}

module.exports.register = async (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = req.body.password;
    user.lodgeOwner = req.body.lodgeOwner;
    user.verificationToken = Math.random().toString(36).slice(2, 7)
    user.emailVerified = false

    // check unique username and email 
    const username_result = await User.findOne({ username: req.body.username }).exec();
    if (username_result) return res.status(400).send({ message: "Duplicate username" });
    const email_result = await User.findOne({ email: req.body.email }).exec();
    if (email_result) return res.status(400).send({ message: "Duplicate email" });

    await user.save(async err => {
        if (err) {
            console.log(err)
            res.status(400).send(err);
        } else {
            // const Users  = await User.find({});
            // console.log(Users);
            emailData = {
                username: user.username,
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                verificationToken: user.verificationToken,
            }
            let emailInfo = sendVerificationEmail(emailData)
            console.log(emailInfo)

            cookie = await user.generateJWT(req, res);
            return cookie
                .status(200)
                .json({
                    user: user,
                    token: jwt.sign(
                        {
                            username: req.body.username
                        },
                        'PrivKey',
                        { expiresIn: "100m" }
                    )
                });
            //
        }
    });

}

module.exports.login = async (req, res, next) => {
    console.log("login")
    try {
        const user = await User.findOne({ username: req.body.username }).exec();
        if (!user) return res.status(400).send({ message: "Invalid username" });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            cookie = await user.generateJWT(req, res);
            return cookie
                .status(200)
                .json({
                    user: user,
                    token: jwt.sign(
                        {
                            username: req.body.username
                        },
                        'PrivKey',
                        { expiresIn: "100m" }
                    )
                });
        } else {
            return res.status(400).send({ message: "Incorrect password" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.logout = async (req, res, next) => {
    console.log("logout")
    res.clearCookie("token");
    res.clearCookie("user");
    res.status(200)
        .json({ success: true });
};

module.exports.getUserProfile = async (req, res, next) => {
    console.log("getUserProfile")
    try {
        const user = await User.findOne({ username: req.query.username }).exec();
        if (!user) return res.status(400).send({ message: "Cannot find user profile with username " + req.body.username });
        console.log(user)
        res.status(200).json({ user: user });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.updateUserProfile = async (req, res, next) => {
    console.log("updateUserProfile")
    console.log(req.body)
    try {
        const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, { username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName }, { new: true }).exec();
        if (!updatedUser) return res.status(400).send({ message: "Cannot find or update user profile with username " + req.body.username });
        console.log(updatedUser)
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.welcome = async (req, res, next) => {
    console.log("welco")
    res.send({ message: "welcomeeeeeeeeeeeeeeeee" });
};

module.exports.addToWishList = async (req, res, next) => {
    console.log("addToWishList")
    console.log(req.body)
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.body.username },
            { $push: { "wishList": req.body.lodgeName } },
            { safe: true, upsert: true, new: true }).exec();
        if (!updatedUser) return res.status(400).send({ message: "Cannot add to wish list" });
        console.log(updatedUser)
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
};

module.exports.deleteFromWishList = async (req, res, next) => {
    console.log("deleteFromWishList")
    console.log(req.body)
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.body.username },
            { $pull: { "wishList": req.body.lodgeName } },
            { safe: true, upsert: true, new: true }).exec();
        if (!updatedUser) return res.status(400).send({ message: "Cannot delete from wish list" });
        console.log(updatedUser)
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
};

module.exports.isLodgeInWishList = async (req, res, next) => {
    console.log("isLodgeInWishList")
    console.log(req.body)
    try {
        let result = await User.find({ wishList: req.body.lodgeName, username: req.body.username }).exec();
        res.status(200).json({ added: result.length });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
};

module.exports.reservePayment = async (req, res, next) => {
    console.log("reservePayment")
    console.log(req.body)
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.body.username },
            { deposit: true },
            { safe: true, upsert: true, new: true }).exec();
        if (!updatedUser) return res.status(400).send({ message: "Cannot update deposit info" });
        console.log(updatedUser)
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
};

sendVerificationEmail = async (data) => {
    console.log("sendVerificationEmail")
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        name: "https://www.lodgeexp.com/",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "major.becker2@ethereal.email", // generated ethereal user
            pass: "eknTqqwTCY1gtEpz2Y", // generated ethereal password
        },
    });
    const url = apiUrl + `/verifyEmail?token=${data.verificationToken}&username=${data.username}`
    console.log(url)
    let info = await transporter.sendMail({
        from: `"Email verification" <wang305305@gmail.com>`,
        to: data.email,
        subject: 'Email Verification',
        html: `<html>
        <body><h1>Hi ${data.firstname} ${data.lastname},</h1> <br>
      <p>Please click the link to verify your email with Lodge Experience</p>
       ${url} </body>
       </html>`
    }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent!');
        }
    })

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
};

module.exports.verifyEmail = async (req, res, next) => {
    console.log("verifyEmail")
    try {
        const username = req.query.username;
        console.log(username)
        const user = await User.findOne({ username: username}).exec();
        if (!user) return res.status(400).send({ message: "Invalid username" });
        if (user.verificationToken == req.query.token) {
            console.log("verification token match")
            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                { emailVerified: true },
                { safe: true, upsert: true, new: true }).exec();
            if (!updatedUser) return res.status(400).send({ message: "Cannot update emailVerified field" });
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).send({ message: "invalid verification token" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
};