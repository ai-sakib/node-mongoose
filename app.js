const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findById('6341af09ed3fea3514d28734')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

const port = 3000
mongoose
    .connect(
        'mongodb+srv://mern_stack:OHYq2jFfxE91wYg2@cluster0.yqodw.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(result => {
        return User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Sakib',
                    email: 'sakib@test.com',
                    cart: {
                        items: [],
                    },
                })
                user.save()
            }
        })
    })
    .then(result => {
        app.listen(port, () =>
            console.log(`Example app listening on port ${port}!`)
        )
    })
    .catch(err => {
        console.log(err)
    })
