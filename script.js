document.addEventListener('DOMContentLoaded', () => {

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

  document.getElementById('search').addEventListener('click', (e) => {
    e.preventDefault();
    let city = document.getElementById('city').value.split(' ');
    city = city.join('_');
    let state = document.getElementById('states').value
    getBreweries(city, state)
  });

  function getBreweries(city, state) {
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=20&page=1`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }


});