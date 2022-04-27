const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Image = require('../models/image.model')

module.exports.uploadProfileImage = async (req, res, next) => {
    console.log("uploadProfileImage")

    try {

        image = new Image()

        image.name = req.file.originalname
        image.username = req.body.username
        image.img = {
            data: fs.readFileSync(path.join('./public/data/uploads/' + req.file.filename)),
            contentType: req.file.mimetype
        }

        // await image.save(async err => {
        //     if (err) {
        //         console.log(err)
        //         res.status(400).send(err);
        //     } else {
        //         const Images = await Image.find({});
        //         console.log(Images);
        //         res.send(image)
        //     }
        // });

        const result = await Image.deleteOne({ username: req.body.username }).exec();

        if (result.deletedCount != 1) return res.status(400).send({ message: "Cannot delete profile image with username " + req.body.username });
        console.log(result)
        await image.save(async err => {
            if (err) {
                console.log(err)
                res.status(400).send(err);
            } else {
                // const Images = await Image.find({});
                // console.log(Images);
                res.status(200).send(image)
            }
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.toString() });
    }
}


module.exports.getProfileImage = async (req, res, next) => {
    console.log("getProfileImage")

    try {
        console.log("req.query.username:" + req.query.username)
        Image.findOne({ username: req.query.username }, (err, item) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {

                res.json({ img64: item?.img?.data?.toString('base64') })
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
    // 
    //     const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, { username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName }, { new: true }).exec();
    //     if (!updatedUser) return res.status(400).send({ message: "Cannot find or update user profile with username " + req.body.username });
    //     console.log(updatedUser)
    //     res.status(200).json({ user: updatedUser });

}
