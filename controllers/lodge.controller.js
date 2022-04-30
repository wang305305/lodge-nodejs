const mongoose = require('mongoose');

const Lodge = require('../models/lodge.model')

module.exports.createLodge = async (req, res, next) => {
    let lodge = new Lodge();
    lodge.lodgeName = req.body.lodgeName;
    lodge.streetAddress = req.body.streetAddress;
    lodge.municipality = req.body.municipality;
    lodge.province = req.body.province;
    lodge.country = req.body.country;
    lodge.flyIn = req.body.flyIn;
    await lodge.save(async err => {
        if (err) {
            console.log(err)
            res.status(400).send(err);
        } else {
            // const Lodges  = await Lodge.find({});
            // console.log(Lodges);
            res.send(lodge)
        }
    });
}
