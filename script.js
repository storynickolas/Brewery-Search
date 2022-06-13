document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('next').style.display='none' 

  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  let breweries = []
  let page = 1
  let city
  let state

  states.forEach((element) => {
    const newState = document.createElement('option');
    newState.textContent = element;
    document.getElementById('states').append(newState);
  });

  document.getElementById('search').addEventListener('click', (e) => {
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
    constructor(name, latitude, longitude){
      this.name = name
      this.latitude = latitude,
      this.longitude = longitude
    }
  }

  function createBrews(place) {
    breweries.push(new brewery(place.name, place.latitude, place.longitude))
  }


  function breweryListMaker(breweries) {
    breweries[0] == undefined ? document.getElementById('error').style.display='block' : document.getElementById('error').style.display='none'
    breweries.length < 20 ? document.getElementById('next').style.display='none' : document.getElementById('next').style.display='block'
    breweries.forEach((element) => {
      const newBrew = document.createElement('li');
      newBrew.setAttribute('class', 'currentList');
      newBrew.textContent = element.name;
      newBrew.addEventListener('click', () => console.log(element.name));
      document.getElementById('breweries-list').append(newBrew);
      createBrews(element)
    })
  }

  document.getElementById('next').addEventListener('click', () => next())

  function next() {
    page++
    getBreweries(city, state, page)
  }
})