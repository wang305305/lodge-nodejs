const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user.model')

module.exports.register = async (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = req.body.password;
    user.lodgeOwner = req.body.lodgeOwner;
    await user.save(async err => {
        if (err) {
            console.log(err)
            res.status(400).send(err);
        } else {
            // const Users  = await User.find({});
            // console.log(Users);
            res.send(user)
        }
    });
}

module.exports.login = async (req, res, next) => {
    console.log("login")
    try {
        const user = await User.findOne({ username: req.body.username }).exec();
        if (!user) return res.status(400).send({ message: "Invalid username" });
        console.log(user)
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            cookie = await user.generateJWT(req, res);
            return cookie
                .status(200)
                .json({ user: user });
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