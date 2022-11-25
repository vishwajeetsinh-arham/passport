const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./models/user')

// route
const userRoutes = require('./routes/users')

const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

// user router



// for passport 
const passport = require('passport')
const LocalStrategy = require('passport-local')


const sessionConfig = {
    secret: 'thisshouldbebeabettersecret',
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session(session))
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// for mongoose 
// const uri = "mongodb+srv://vishwajeet:vishwajeet@quizzapp.8cryywh.mongodb.net/test"
const uri = "mongodb://0.0.0.0/passportTest"
async function connect(){
    try{
        await mongoose.connect(uri)
        console.log('connected to online MDB')
    }catch(error){
        console.log(error)
    }
}
connect()

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open',() =>{
    console.log('dababase connected :)')
})


app.use('/', userRoutes)

app.get('/', (req,res) => {
    res.send(`hello `)
})

app.get('/fakeuser', async(req,res) => {
    const user = new User({email: 'test@gmail.com', username: 'testtt'})
    const newUser = await User.register(user, '123')
    res.send(newUser)
})

app.listen(port, ()=> {
    console.log(`your app is running on http://localhost:${port}`)
})