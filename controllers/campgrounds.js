const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')

const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

const index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds', { campgrounds })
}

const newForm = (req, res) => {
  res.render('campgrounds/new')
}

const createCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    })
    .send()
  const campground = new Campground(req.body.campground)
  campground.geometry = geoData.body.features[0].geometry
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }))
  campground.author = req.user._id
  await campground.save()
  console.log(campground)
  req.flash('success', 'Successfully created a new campground.')
  res.redirect(`/campgrounds/${campground._id}`)
}

const showCampground = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
    .populate({
      path: 'reviews',
      populate: 'author'
    })
    .populate('author')
  if (!campground) {
    req.flash('error', 'Cannot find that campground.')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
}

const editForm = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground.')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

const updateCampground = async (req, res) => {
  const { id } = req.params
  const { deleteImages, campground } = req.body
  const updatedCampground = await Campground.findByIdAndUpdate(id, campground, {
    runValidators: true,
    new: true
  })
  updatedCampground.images.push(
    ...req.files.map((f) => ({
      url: f.path,
      filename: f.filename
    }))
  )
  updatedCampground.save()
  if (deleteImages) {
    for (let filename of deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await updatedCampground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } }
    })
  }
  req.flash('success', 'Successfully updated campground.')
  res.redirect(`/campgrounds/${id}`)
}

const deleteCampground = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground.')
  res.redirect('/campgrounds')
}

module.exports = {
  index,
  newForm,
  showCampground,
  createCampground,
  editForm,
  updateCampground,
  deleteCampground
}
