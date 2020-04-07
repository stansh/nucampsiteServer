const mongoose = require('mongoose');
const Schema = mongoose.Schema; // not necessary, to simplify



const favoriteSchema = new Schema({ //schema defined
 
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },

    campsites:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Campsite' 

    }]
}, {
    timestamps: true
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;