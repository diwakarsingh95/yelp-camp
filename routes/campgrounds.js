const express = require('express')
const multer = require('multer')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const campgroundController = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router
  .route('/')
  .get(catchAsync(campgroundController.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundController.createCampground)
  )

router.get('/new', isLoggedIn, campgroundController.newForm)

router
  .route('/:id')
  .get(catchAsync(campgroundController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundController.deleteCampground)
  )

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.editForm)
)

module.exports = router
