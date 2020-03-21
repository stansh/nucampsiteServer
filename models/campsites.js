const mongoose = require('mongoose');
const Schema = mongoose.Schema; // not necessary, to simplify

require('mongoose-currency').loadType(mongoose); // handles money values
const Currency = mongoose.Types.Currency; // shorthand

const commentSchema = new Schema({ //schema defined
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});




const Campsite = mongoose.model('Campsite', campsiteSchema); // model created fot campsites collection with the created schema; 'Campsite' => campsites collection

module.exports = Campsite;