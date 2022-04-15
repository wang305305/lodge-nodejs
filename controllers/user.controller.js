const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user.model')

module.exports.register = async (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = req.body.password;
    user.lodgeOwner = req.body.lodgeOwner;
    await user.save(async err => {
        if (err) {
            console.log(err)
            res.send(handleError(err));
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
        if (!user) return res.status(400).send("Invalid username");
        console.log(user)
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            await user.generateJWT(req, res).send();
        } else {
            return res.status(400).send("Incorrect password");
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }
}

module.exports.logout = async (req, res, next) => {
    res.clearCookie("token");
    res.send({ success: true });
  };