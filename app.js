const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')

const User = require('./models/user')

const app = express()
const mongoConnect = require('./util/database').mongoConnect

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.find('6341684e1447690e689a2f92')
        .then(user => {
            req.user = new User(user.name, user.email, user._id, user.cart)
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

const port = 3000
mongoConnect(() => {
    app.listen(port)
    console.log(`...Listening on port ${port}`)
})
