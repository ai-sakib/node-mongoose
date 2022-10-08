const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId
class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this._id = id ? new ObjectId(id) : null
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
        this.userId = userId
    }

    save() {
        const db = getDb()
        let dbOp
        if (this._id) {
            dbOp = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this })
        } else {
            dbOp = db.collection('products').insertOne(this)
        }

        return dbOp
            .then(result => {
                console.log('dbOp', result)
            })
            .catch(err => console.log(err))
    }

    static get() {
        const db = getDb()
        return db.collection('products').find().toArray()
    }

    static find(productId) {
        const db = getDb()
        return db
            .collection('products')
            .find({ _id: new ObjectId(productId) })
            .next()
            .then(product => {
                return product
            })
            .catch(err => console.log(err))
    }

    static delete(productId) {
        const db = getDb()
        return db
            .collection('products')
            .deleteOne({ _id: new ObjectId(productId) })
            .then(() => {
                console.log('Deleted Product !')
            })
            .catch(err => console.log(err))
    }
}

module.exports = Product
