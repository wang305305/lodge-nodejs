const mongoose = require('mongoose');
const { Schema } = mongoose;

const lodgeSchema = new Schema({
    lodgeName: {
        type: String,
        required: 'Lodgename cannot be empty'
    },
    owner: {
        type: String,
        required: 'owner cannot be empty'
    },
    streetAddress: {
        type: String,
        required: 'streetAddress cannot be empty'
    },
    municipality: {
        type: String,
        required: 'municipality cannot be empty'
    },
    province: {
        type: String,
        required: 'province cannot be empty'
    },
    country: {
        type: String,
        required: 'country cannot be empty'
    },
    startingPrice: {
        type: Number,
        required: 'starting price cannot be empty'
    },
    flyIn: {
        type: Boolean
    },
    reviews: [{
        type: String
    }],
    ratings: {
        attributes: [{
            type: Map,
            of: String
        }]
    }
}
);


module.exports = mongoose.model('Lodge', lodgeSchema, 'lodges')