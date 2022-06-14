document.addEventListener('DOMContentLoaded', () => {

  const previous = document.getElementById('previous')
  const next = document.getElementById('next')


  next.style.display='none' 
  previous.style.display='none' 

  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  // let breweries = []
  let page
  let city
  let state
  let map

  //Establish map at geographic center of US
  function resetMap() {
    map = L.map('map').setView([39.8283, -98.5795], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
  }

  resetMap()

  //Add functionality to next/previous buttons if results have more than 20 breweries
  document.getElementById('next').addEventListener('click', () => nextBtn())
  document.getElementById('previous').addEventListener('click', () => previousBtn())

  function nextBtn() {
    page++
    document.getElementById('brews').innerHTML=''
    getBreweries(city, state, page)
  }

  function previousBtn() {
    page--
    document.getElementById('brews').innerHTML=''
    getBreweries(city, state, page)
  }

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
    // document.getElementById('breweries-list').innerHTML = '';
    // breweries = []
    city = document.getElementById('city').value.split(' ');
    city = city.join('_');
    state = document.getElementById('states').value
    getBreweries(city, state, page)
  });

  //Retrieve breweries from search
  function getBreweries(city, state, page) {
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=10&page=${page}`)
      .then((res) => res.json())
      .then((data) => breweryListMaker(data))
  }

  // //Click on brewery name for additional info
  // function moreInfo(info) {
  //   document.getElementById(`m${info}`).style.display='block'
  // }

  //populate brewery list or show error message
  function breweryListMaker(breweries) {
    let count = 1;
    let geo = []
    const error = document.getElementById('error').style

    breweries[0] ? error.display = 'none' : error.display = 'block'
    breweries.length < 10 ? next.style.display = 'none' : next.style.display = 'block'
    page > 1 ? previous.style.display='block' : previous.style.display = 'none' 

    breweries.forEach((element) => {
      const newBrew = document.createElement('tr')
      let address, website, phone

      address = element.street ? `${element.street}, ${element.city}` : ''
      website = element.website_url ? `${element.website_url}` : ''
      phone = element.phone ? `(${element.phone.slice(0,3)})-${element.phone.slice(3,6)}-${element.phone.slice(6,10)}` : ''
      

      newBrew.innerHTML = `
        <tr>
          <td id=${count}>${element.name}</td>
          <td>${address}</td>
          <td>${phone}</td>
          <td><a href=${website}>${element.name} </a><td>
        </tr>
    `
      if (element.longitude) {
        geo.push({
          name: element.name, 
          latitude: element.latitude, 
          longitude: element.longitude
        })
      }
      newBrew.setAttribute('id', count)
      document.getElementById('brews').append(newBrew);
      // document.getElementById(`m${count}`).style.display='none'
      // newBrew.addEventListener('click', (e) => moreInfo(e.target.id))
      count++
    })
    if(geo.length > 0) {
      updateMap(geo)
    }
    else {
      map.off()
      map.remove()
      resetMap()
    }
  }

  //Move map to new location based on first brewery with coordinates
  function updateMap(geo) {
    map.off()
    map.remove()
    map = L.map('map').setView([geo[0].latitude, geo[0].longitude], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    geo.forEach(element => {
      L.marker([element.latitude, element.longitude]).addTo(map).on('click', () => alert(element.name)).addTo(map)
    })
  }
})