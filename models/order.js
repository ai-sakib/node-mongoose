const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    products: [
        {
            product: {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    user: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
})

module.exports = mongoose.model('Order', orderSchema)
