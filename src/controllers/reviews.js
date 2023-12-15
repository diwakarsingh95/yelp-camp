const Campground = require('../models/campground')
const Review = require('../models/review')

const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  const newReview = new Review(req.body.review)
  newReview.author = req.user._id
  campground.reviews.push(newReview)
  await newReview.save()
  await campground.save()
  req.flash('success', 'Successfully added review!')
  res.redirect(`/campgrounds/${campground._id}`)
}

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  await Review.findByIdAndDelete(reviewId)
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  req.flash('success', 'Successfully deleted review!')
  res.redirect(`/campgrounds/${id}`)
}

module.exports = { createReview, deleteReview }
