const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editMode: false,
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
    )
    product.save().then(() => {
        res.redirect('/admin/products')
    })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }

    const productId = req.params.productId
    Product.find(productId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editMode,
                product: product,
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const product = new Product(title, price, description, imageUrl, id)
    product
        .save()
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId
    Product.delete(id)
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product.get()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            })
        })
        .catch(err => console.log(err))
}
