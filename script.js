document.addEventListener('DOMContentLoaded', () => {

  const previous = document.getElementById('previous')
  const next = document.getElementById('next')
  const mapNA = document.getElementById('mapNa')

  next.style.display='none' 
  previous.style.display='none' 
  mapNA.style.display='none' 

  //Add list of states to selection
  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  states.forEach((element) => {
    const newState = document.createElement('option');
    newState.textContent = element;
    document.getElementById('states').append(newState);
  });

  let page
  let city
  let state
  let map
  let mapOn = true

  function resetMap(lat, long, zoom) {
    map = L.map('map').setView([lat, long], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
  }


  //Establish map at geographic center of US
  let defaultMap = [39.8283, -98.5795, 4]
  resetMap(defaultMap[0], defaultMap[1], defaultMap[2])


  //Add functionality to next/previous buttons if results have more than 7 breweries
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

  //Search for breweries by city + state
  document.getElementById('search-bar').addEventListener('submit', (e) => {
    page=1
    e.preventDefault();
    document.getElementById('brews').innerHTML = '';
    city = document.getElementById('city').value.split(' ');
    city = city.join('_');
    state = document.getElementById('states').value
    getBreweries(city, state, page)
  });

  //Retrieve breweries from search
  function getBreweries(city, state, page) {
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=7&page=${page}`)
      .then((res) => res.json())
      .then((data) => breweryListMaker(data))
  }

  //populate brewery list or show error message
  function breweryListMaker(breweries) {
    let count = 1;
    let geo = []
    const error = document.getElementById('error').style

    //Show error if fetch returns no results
    breweries[0] ? error.display = 'none' : error.display = 'block'

    //Hide or show next/previous buttons
    breweries.length < 7 ? next.style.display = 'none' : next.style.display = 'block'
    page > 1 ? previous.style.display='block' : previous.style.display = 'none' 

    //Populate table
    breweries.forEach((element) => {
      const newBrew = document.createElement('tr')
      let address, website, phone

      address = element.street ? `${element.street}, ${element.city}` : 'Not Available'
      website = element.website_url ? `${element.website_url}` : ''
      phone = element.phone ? `(${element.phone.slice(0,3)})-${element.phone.slice(3,6)}-${element.phone.slice(6,10)}` : ''
      

      newBrew.innerHTML = `
        <tr >
          <td id=${count}>${element.name}</td>
          <td id='col2'>${address}</td>
          <td id='col3'>${phone}</td>
          <td><a href=${website}>${element.name} </a></td>
        </tr>
    `
      if (element.longitude) {
        geo.push({
          name: element.name, 
          latitude: element.latitude, 
          longitude: element.longitude
        })
      }
      newBrew.setAttribute('id', element.name)
      newBrew.setAttribute('class', 'brew123')
      document.getElementById('brews').append(newBrew);

   
      count++
    })
    if(geo.length > 0) {
      mapNA.style.display='none' 
      updateMap(geo)
    }
    else {
      if(mapOn){
        map.off()
        map.remove()
      }
      mapOn = false
      mapNA.style.display='block' 
      
    }
  }

  //Move map to new location based on first brewery with coordinates
  function updateMap(geo) {
    if(mapOn){
      map.off()
      map.remove()
    }
    
    resetMap(geo[0].latitude, geo[0].longitude, 10)

    geo.forEach(element => {
      let nMarker = L.marker([element.latitude, element.longitude]).addEventListener('click', () => {
        let arr = [...document.getElementsByClassName('brew123')]
        arr.forEach( element =>
          element.style.backgroundColor = 'white'
        )
        document.getElementById(element.name).style.backgroundColor = 'rgb(192,192,192)'
      })
      nMarker.bindPopup(element.name);
      nMarker.addEventListener('mouseover', function (e) {
          this.openPopup();
      });
      nMarker.addEventListener('mouseout', function (e) {
          this.closePopup();
      });
      nMarker.addTo(map)
    })
    mapOn = true;
  }
})