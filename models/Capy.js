const mongoose = require('../db/conn')
const {Schema} = mongoose

const Capy = mongoose.model(
    'Capy',
    new Schema(
        {
            name: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            images: {
                type: Array,
                required: true
            },
            available: {
                type: Boolean,
            },
            user: Object,
            adopter: Object
        }, 
    {timestamps: true})
)

module.exports = Capy