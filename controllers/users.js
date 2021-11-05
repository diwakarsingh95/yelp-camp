const User = require('../models/user')

const registerForm = (req, res) => {
  res.render('users/register')
}

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
      if (err) return next(err)
      req.flash('success', 'Welcome to Yelp Camp!')
      res.redirect('/campgrounds')
    })
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('register')
  }
}

const loginForm = (req, res) => {
  res.render('users/login')
}

const login = (req, res) => {
  req.flash('success', 'Welcome back!')
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo
  res.redirect(redirectUrl)
}

const logout = (req, res) => {
  req.logout()
  req.flash('success', 'Goodbye!')
  res.redirect('/login')
}

module.exports = {
  registerForm,
  register,
  loginForm,
  login,
  logout
}
