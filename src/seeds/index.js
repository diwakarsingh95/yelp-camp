const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '618490146af46ddc8cc3478f',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dykjsx7mz/image/upload/v1636523803/YelpCamp/t8ycj5o0gdrz9c0s5s9t.jpg',
          filename: 'YelpCamp/t8ycj5o0gdrz9c0s5s9t'
        },
        {
          url: 'https://res.cloudinary.com/dykjsx7mz/image/upload/v1636154825/YelpCamp/xwyxnugiey0dt3o97gb3.jpg',
          filename: 'YelpCamp/xwyxnugiey0dt3o97gb3'
        }
      ],
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      }
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
