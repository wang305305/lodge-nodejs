const mongoose = require('mongoose');
const { Schema } = mongoose;

const lodgeSchema = new Schema({
    lodgeName: {
        type: String,
        required: 'Lodgename cannot be empty'
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
    flyIn: {
        type: Boolean
    }
}
);


module.exports = mongoose.model('Lodge', lodgeSchema, 'lodges')