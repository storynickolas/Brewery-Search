document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('next').style.display='none' 
  document.getElementById('previous').style.display='none' 

  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  let breweries = []
  let page
  let city
  let state

  //Establish map at geographic center of US
  let map = L.map('map').setView([39.8283, -98.5795], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  //Add list of states to selection
  states.forEach((element) => {
    const newState = document.createElement('option');
    newState.textContent = element;
    document.getElementById('states').append(newState);
  });

  //Search for breweries by city + state
  document.getElementById('search').addEventListener('click', (e) => {
    page=1
    e.preventDefault();
    document.getElementById('breweries-list').innerHTML = '';
    breweries = []
    city = document.getElementById('city').value.split(' ');
    city = city.join('_');
    state = document.getElementById('states').value
    getBreweries(city, state, page)
  });

  //Retrieve breweries from search
  function getBreweries(city, state, page) {
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=20&page=${page}`)
      .then((res) => res.json())
      .then((data) => breweryListMaker(data))
  }

  //Fill breweries array from API data
  class brewery{
    constructor(name, latitude, longitude, street, zip, url, phone){
      this.name = name
      this.latitude = latitude,
      this.longitude = longitude,
      this.street = street,
      this.zip = zip,
      this.url = url,
      this.phone = phone
    }
  }

  function createBrews(place) {
    breweries.push(
      new brewery(
        place.name, 
        place.latitude, 
        place.longitude,
        place.street,
        place.postal_code,
        place.website_url,
        place.phone
      ))
  }

  //Click on brewery name for additional info
  function moreInfo(info) {
    document.getElementById(`m${info}`).style.display='block'
  }

  //populate brewery list or show error message
  function breweryListMaker(breweries) {
    let count = 1;
    let lat = []
    let long = []
    let geo = []
    breweries[0] == undefined ? document.getElementById('error').style.display='block' : document.getElementById('error').style.display='none'
    page < 1 || breweries.length !== 20 ? document.getElementById('next').style.display='none' : document.getElementById('next').style.display='block'
    page < 2 ? document.getElementById('previous').style.display='none' : document.getElementById('previous').style.display='block'
    breweries.forEach((element) => {
      const newBrew = document.createElement('li')
      let address, website, phone
      element.street === null ? address = '' : address = `${element.street}, ${element.city}`
      element.website_url === null ? website = '' : website = `${element.website_url}`
      element.phone === null ? phone = '' : phone = `(${element.phone.slice(0,3)})-${element.phone.slice(3,6)}-${element.phone.slice(6,10)}`
      newBrew.innerHTML = `
        <p id=${count}>${element.name}</P>
        <div class='breweries' id=m${count}>
          <h3>${element.name}</h3>
          <h4>${address}</h4>
          <h4>${phone}</h4>
          <a href=${website}>${website} </a>
        </div>
      `
      if (typeof element.longitude === 'string') {
        lat.push(element.latitude)
        long.push(element.longitude)
        geo.push({
          name: element.name, 
          latitude: element.latitude, 
          longitude: element.longitude
        })
      }
      newBrew.setAttribute('id', count)
      document.getElementById('breweries-list').append(newBrew);
      document.getElementById(`m${count}`).style.display='none'
      newBrew.addEventListener('click', (e) => moreInfo(e.target.id))
      createBrews(element)
      count++
    })
    console.log(breweries)
    if(breweries[0].longitude !== null) {
      updateMap(long, lat, geo)
    }
  }

  //Move map to new location based on first brewery with coordinates
  function updateMap(lat, long, geo) {
    map.off()
    map.remove()
    map = L.map('map').setView([long[0], lat[0]], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    geo.forEach(element => {
      L.marker([element.latitude, element.longitude]).addTo(map).on('click', () => alert(element.name)).addTo(map)
    })
  }

  //Add functionality to next/previous buttons if results have more than 20 breweries
  document.getElementById('next').addEventListener('click', () => next())
  document.getElementById('previous').addEventListener('click', () => previous())

  function next() {
    page++
    document.getElementById('breweries-list').innerHTML=''
    getBreweries(city, state, page)
  }

  function previous() {
    page--
    document.getElementById('breweries-list').innerHTML=''
    getBreweries(city, state, page)
  }
})