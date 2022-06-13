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
  let count

  states.forEach((element) => {
    const newState = document.createElement('option');
    newState.textContent = element;
    document.getElementById('states').append(newState);
  });

  document.getElementById('search').addEventListener('click', (e) => {
    count = 1;
    page=1
    e.preventDefault();
    document.getElementById('breweries-list').innerHTML = '';
    breweries = []
    city = document.getElementById('city').value.split(' ');
    city = city.join('_');
    state = document.getElementById('states').value
    getBreweries(city, state, page)
  });

  function getBreweries(city, state, page) {
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=20&page=${page}`)
      .then((res) => res.json())
      .then((data) => breweryListMaker(data))
  }

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
  function moreInfo(info) {
    document.getElementById(`m${info}`).style.display='block'
  }


  function breweryListMaker(breweries) {
    breweries[0] == undefined ? document.getElementById('error').style.display='block' : document.getElementById('error').style.display='none'
    page < 1 ? document.getElementById('next').style.display='none' : document.getElementById('next').style.display='block'
    page < 2 ? document.getElementById('previous').style.display='none' : document.getElementById('previous').style.display='block'
    breweries.forEach((element) => {
      const newBrew = document.createElement('li')
      let address, website, phone
      element.street === null ? address = '' : address = `${element.street}, ${element.city}`
      element.website_url === null ? website = '' : website = `${element.website_url}`
      element.phone === null ? phone = '' : phone = `${element.phone}`
      newBrew.innerHTML = `
        <p id=${count}>${element.name}</P>
        <div class='breweries' id=m${count}>
          <h3>${element.name}</h3>
          <h4>${address}</h4>
          <h4>${phone}</h4>
          <a href=${website}>${website} </a>
        </div>
      `
      // newBrew.setAttribute('class', 'currentList');
      newBrew.setAttribute('id', count)
      document.getElementById('breweries-list').append(newBrew);
      document.getElementById(`m${count}`).style.display='none'
      newBrew.addEventListener('click', (e) => moreInfo(e.target.id))
      createBrews(element)
      count++
    })
  }

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