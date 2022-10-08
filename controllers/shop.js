const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
            })
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            })
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
            })
        })
        .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        })
    })
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts,
            })
        })
        .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId

    req.user
        .removeFromCart(prodId)
        .then(response => {
            console.log('CART ITEM DELETED')
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            return orders.map(order => {
                return {
                    id: order._id,
                    products: order.products.map(p => {
                        return {
                            title: p.product.title,
                            price: p.product.price,
                            quantity: p.quantity,
                        }
                    }),
                    totalPrice: order.products.reduce((total, prod) => {
                        return total + prod.quantity * prod.product.price
                    }, 0),
                }
            })
        })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders,
            })
        })

        .catch(error => console.log(error))
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items.map(cp => {
                return {
                    product: {
                        productId: cp.productId._id,
                        title: cp.productId.title,
                        price: cp.productId.price,
                    },
                    quantity: cp.quantity,
                }
            })

            const order = new Order({
                products: cartProducts,
                user: {
                    name: req.user.name,
                    email: req.user.email,
                    userId: req.user,
                },
                items: user.cart.items,
            })

            return order.save()
        })
        .then(order => {
            return req.user.clearCart()
        })
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    })
}
