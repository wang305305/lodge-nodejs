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
    lodge.owner = req.body.owner
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

module.exports.getAllLodge = async (req, res, next) => {
    console.log("getAllLodge")
    try {
        const lodges = await Lodge.find({}).exec();
        if (!lodges) return res.status(400).send({ message: "Cannot find all lodge " + req.body.lodgename });
        console.log(lodges)
        res.status(200).json({ lodges: lodges });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.getLodgeByName = async (req, res, next) => {
    console.log("getLodgebyName")
    try {
        const lodge = await Lodge.findOne({ lodgename: req.query.lodgename }).exec();
        if (!lodge) return res.status(400).send({ message: "Cannot find lodge profile with lodgename " + req.body.lodgename });
        console.log(lodge)
        res.status(200).json({ lodge: lodge });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.getLodgeByOwner = async (req, res, next) => {
    console.log("getLodgebyowner")
    try {
        const lodge = await Lodge.findOne({ lodgename: req.query.owner }).exec();
        if (!lodge) return res.status(400).send({ message: "Cannot find lodge profile with owner " + req.body.owner });
        console.log(lodge)
        res.status(200).json({ lodge: lodge });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}
