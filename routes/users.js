const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')

router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register',async (req,res) => {
    const {email, username, password} = req.body
    const user = new User({email,username})
    const registerUser = await User.register(user, password)
    console.log(registerUser)
    res.send('login seccues')
})



router.get('/login', (req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res) => {
    res.redirect('/')
})

module.exports = router