const mongoose = require('mongoose');

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