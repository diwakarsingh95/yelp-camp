const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const userController = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')

router
  .route('/register')
  .get(userController.registerForm)
  .post(catchAsync(userController.register))

router
  .route('/login')
  .get(userController.loginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login'
    }),
    userController.login
  )

router.get('/logout', userController.logout)

module.exports = router
