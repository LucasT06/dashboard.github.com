const hourBtn = document.querySelector('.hour-btn');
const weekBtn = document.querySelector('.week-btn');
const yearBtn = document.querySelector('.year-btn');

let formattedTime;
let minutCheck;

let minutesCheck = [
  "05:00",
  "10:00",
  "15:00",
  "20:00",
  "25:00",
  "30:00",
  "35:00",
  "40:00",
  "45:00",
  "50:00",
  "55:00"
];



setInterval(updateTime, 1000);
setInterval(timeChecken, 1000);

//hier haal die de nieuwse prijs op van render-token
async function fetchRenderPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=render-token&vs_currencies=eur');
  let renderData = await response.json();
  let prijs = renderData['render-token'].eur;
  return prijs;
}

//hier maakt die de tijd van nu aan
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  formattedTime = `${hours}:${minutes}:${seconds}`;
  minutCheck = `${minutes}:${seconds}`;
}

//hier kijkt die of de tijd gelijk is aan de array dat is om de 5 minuten 
function timeChecken() {
  for (let i = 0; i < minutesCheck.length; i++) {
    if (minutCheck === minutesCheck[i]) {
      addPrijs();
    }
  }
}

//de prijs en de tijd die gestuurd word door de update time en de fetch prijs word naar de database gestuurd
function addPrijs() {
  fetchRenderPrice().then(prijs => {
    (async () => {
      try {
        const rawResponse = await fetch('/add-render-prijs', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prijs: prijs, tijd: formattedTime })
        });

        const content = await rawResponse.json();
        //hij laat weten als die door is gestuurt of niet
        if (content.addPrijs) {
          console.log('prijs is toegevoegd');
        } else {
          console.log('Er ging iets mis bij het toevoegen');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  });
}


let hour = true
let week = false
let year = false

//als je op de hour button klinkt gaat die de chard maken
hourBtn.addEventListener('click', function(){
  hour = true
  week = false
  year = false
  checkChard()
})

weekBtn.addEventListener('click', function(){
  hour = false
  week = true
  year = false  
  checkChard()
})

yearBtn.addEventListener('click', function(){
  hour = false
  week = false
  year = true 
  checkChard()
})

//hier kijkt welken true is geworden en gaat die het uit voeger
function checkChard(){
  if(hour == true){
    renderFetch()
  }
  if(week == true){
    fetchRenderWeek()
  }
  if(year == true){
    fetchRenderYear()
  }
}

renderFetch()
setInterval(renderPrijsFetch, 500);

//omdat de uur de echt prijs en tijd is gaat die hier elke halfe seconde kijken dat het tijd is en dan laat die hem met nieuwe data zien
function renderPrijsFetch() {
  for (let i = 0; i < minutesCheck.length; i++) {
    if (minutCheck === minutesCheck[i] && hour == true) {
      setTimeout(renderFetch, 1000)
    }
  }
}

//hier haalt die de data op van de api
function renderFetch(){
  fetch('/render-prijs-uur')
  .then((data) => data.json())
  .then((data) => addChartHour(data))
}

// hier maakt die de chart aan voor de uur tijd
function addChartHour(datas) {
  for (let i = 0; i < datas.length; i++) {
    //hier zet de data in een array voor de chart data
    let tijd = [datas[0].tijd, datas[1].tijd, datas[2].tijd, datas[3].tijd, datas[4].tijd, datas[5].tijd, datas[6].tijd, datas[7].tijd, datas[8].tijd, datas[9].tijd, datas[10].tijd]
    let prijs = [datas[0].prijs, datas[1].prijs, datas[2].prijs, datas[3].prijs, datas[4].prijs, datas[5].prijs, datas[6].prijs, datas[7].prijs, datas[8].prijs, datas[9].prijs, datas[10].prijs]
    const chart = document.querySelector('.line-chart');
    new Chart(chart, {
      type: 'line',
      data: {
        labels: tijd,
        datasets: [{
          label: 'uur',
          data: prijs,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
}

//hier haalt die de data op van de api
function fetchRenderWeek(){
  fetch('/render-prijs-week')
  .then((data) => data.json())
  .then((data) => addWeekChart(data))
}


// hier maakt die de chart aan voor de week tijd
function addWeekChart(datas){
  for (let i = 0; i < datas.length; i++) {
    //hier zet de data in een array voor de chart data
    let tijd = [datas[0].tijd, datas[1].tijd, datas[2].tijd, datas[3].tijd, datas[4].tijd, datas[5].tijd, datas[6].tijd]
    let prijs = [datas[0].prijs, datas[1].prijs, datas[2].prijs, datas[3].prijs, datas[4].prijs, datas[5].prijs, datas[6].prijs]
    const chart = document.querySelector('.line-chart');
    new Chart(chart, {
      type: 'line',
      data: {
        labels: tijd,
        datasets: [{
          label: 'week',
          data: prijs,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
}

//hier haalt die de data op van de api
function fetchRenderYear(){
  fetch('/render-prijs-jaar')
  .then((data) => data.json())
  .then((data) => addYearChart(data))
}

// hier maakt die de chart aan voor de jaar tijd
function addYearChart(datas){
  for (let i = 0; i < datas.length; i++) {
    //hier zet de data in een array voor de chart data
    let tijd = [datas[0].tijd, datas[1].tijd, datas[2].tijd, datas[3].tijd, datas[4].tijd, datas[5].tijd, datas[6].tijd,datas[7].tijd, datas[8].tijd, datas[9].tijd, datas[10].tijd, datas[11].tijd]
    let prijs = [datas[0].prijs, datas[1].prijs, datas[2].prijs, datas[3].prijs, datas[4].prijs, datas[5].prijs, datas[6].prijs, datas[7].prijs, datas[8].prijs, datas[9].prijs, datas[10].prijs, datas[11].prijs]
    const chart = document.querySelector('.line-chart');
    new Chart(chart, {
      type: 'line',
      data: {
        labels: tijd,
        datasets: [{
          label: 'week',
          data: prijs,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
}