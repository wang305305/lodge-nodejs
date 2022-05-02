const mongoose = require('mongoose');

const Lodge = require('../models/lodge.model')

module.exports.createLodge = async (req, res, next) => {
    let lodge = new Lodge();
    lodge.lodgeName = req.body.lodgeName;
    lodge.streetAddress = req.body.streetAddress;
    lodge.municipality = req.body.municipality;
    lodge.province = req.body.province;
    lodge.country = req.body.country;
    lodge.startingPrice = req.body.startingPrice;
    lodge.flyIn = req.body.flyIn;
    lodge.owner = req.body.owner
    console.log(lodge)
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

module.exports.getAllLodges = async (req, res, next) => {
    console.log("getAllLodges")
    try {
        const lodges = await Lodge.find({}).exec();
        if (!lodges) return res.status(400).send({ message: "Cannot find all lodges "});
        console.log(lodges)
        res.status(200).json({ lodges: lodges });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.getLodges = async (req, res, next) => {
    console.log("getLodges")
    try {
        const lodges = await Lodge.find(req.query).exec();
        if (!lodges) return res.status(400).send({ message: "Cannot find lodge that satisfies" + req.query });
        console.log(lodges)
        res.status(200).json({ lodges: lodges });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

module.exports.searchLodges = async (req, res, next) => {
    console.log("searchLodges")
    let input = req.query.input

    let condition = { $or: [{ lodgeName: {$regex : input} }] }
    console.log(condition)
    try {
        const lodges = await Lodge.find(condition).exec();
        if (!lodges) return res.status(400).send({ message: "Cannot find lodge that satisfies" + req.query });
        console.log(lodges)
        res.status(200).json({ lodges: lodges });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}
// module.exports.getLodgeByName = async (req, res, next) => {
//     console.log("getLodgebyName")
//     try {
//         const lodge = await Lodge.findOne({ lodgename: req.query.lodgename }).exec();
//         if (!lodge) return res.status(400).send({ message: "Cannot find lodge profile with lodgename " + req.body.lodgename });
//         console.log(lodge)
//         res.status(200).json({ lodge: lodge });
//     } catch (err) {
//         return res.status(500).json({ message: err.toString() });
//     }
// }

// module.exports.getLodgeByOwner = async (req, res, next) => {
//     console.log("getLodgebyowner")
//     try {
//         const lodge = await Lodge.findOne({ lodgename: req.query.owner }).exec();
//         if (!lodge) return res.status(400).send({ message: "Cannot find lodge profile with owner " + req.body.owner });
//         console.log(lodge)
//         res.status(200).json({ lodge: lodge });
//     } catch (err) {
//         return res.status(500).json({ message: err.toString() });
//     }
// }
