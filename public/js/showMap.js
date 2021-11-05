mapboxgl.accessToken = mapToken
const camp = JSON.parse(campgroundData)
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: camp.coordinates,
  zoom: 10
})

map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker()
  .setLngLat(camp.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${camp.title}</h4><p>${camp.location}</p>`
    )
  )
  .addTo(map)
