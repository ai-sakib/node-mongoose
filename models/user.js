// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb

// const ObjectId = mongodb.ObjectId
// class User {
//     constructor(name, email, id, cart) {
//         this._id = id ? new ObjectId(id) : null
//         this.name = name
//         this.email = email
//         this.cart = cart
//     }

//     save() {
//         const db = getDb()
//         return db
//             .collection('users')
//             .insertOne(this)
//             .then(result => {
//                 console.log('dbOp', result)
//             })
//             .catch(err => console.log(err))
//     }

//     addToCart(product) {
//         let updatedCartItems = []
//         let updatedItem

//         if (this.cart?.items.length > 0) {
//             updatedCartItems = [...this.cart.items]
//         }
//         const cartProductIndex = updatedCartItems?.findIndex(cartProduct => {
//             return cartProduct.productId.toString() === product._id.toString()
//         })

//         let newQty = 1

//         if (cartProductIndex >= 0) {
//             newQty = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQty
//         } else {
//             updatedItem = {
//                 productId: new ObjectId(product._id),
//                 quantity: newQty,
//             }
//             updatedCartItems.push(updatedItem)
//         }

//         const updatedCart = {
//             items: updatedCartItems,
//         }

//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             )
//     }

//     static get() {
//         const db = getDb()
//         return db.collection('users').find().toArray()
//     }

//     static find(productId) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .findOne({ _id: new ObjectId(productId) })
//             .then(user => {
//                 console.log(user)
//                 return user
//             })
//             .catch(err => console.log(err))
//     }

//     static delete(productId) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .deleteOne({ _id: new ObjectId(productId) })
//             .then(() => {
//                 console.log('Deleted User !')
//             })
//             .catch(err => console.log(err))
//     }

//     getCart() {
//         let productIds = []
//         if (this.cart?.items.length > 0) {
//             productIds = this.cart.items.map(item => {
//                 return item.productId
//             })
//         }

//         console.log('productIds', productIds)

//         const db = getDb()
//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 console.log('mapped', products)
//                 return products.map(p => {
//                     const foundItem = this.cart?.items?.find(i => {
//                         return i.productId.toString() === p._id.toString()
//                     })
//                     const quantity = foundItem ? foundItem.quantity : 0
//                     console.log('foundItem', foundItem)
//                     return {
//                         ...p,
//                         quantity: quantity,
//                     }
//                 })
//             })
//             .catch(err => console.log(err))
//     }

//     deleteCartItem(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString()
//         })

//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } }
//             )
//     }

//     addOrder() {
//         const db = getDb()
//         return this.getCart()
//             .then(products => {
//                 return {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name,
//                     },
//                 }
//             })
//             .then(order => {
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(result => {
//                 this.cart = { items: [] }
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     )
//             })
//     }

//     getOrders() {
//         const db = getDb()
//         return db
//             .collection('orders')
//             .find({ 'user._id': new ObjectId(this._id) })
//             .toArray()
//     }
// }

// module.exports = User
