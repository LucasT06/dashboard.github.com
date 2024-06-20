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
async function fetchBitcoinPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur');
  let bitcoinData = await response.json();
  let prijs = bitcoinData.bitcoin.eur;
  return prijs;
}

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  formattedTime = `${hours}:${minutes}:${seconds}`;
  minutCheck = `${minutes}:${seconds}`;
}

function timeChecken() {
  for (let i = 0; i < minutesCheck.length; i++) {
    if (minutCheck === minutesCheck[i]) {
      addPrijs();
    }
  }
}

function addPrijs() {
  fetchBitcoinPrice().then(prijs => {
    console.log(prijs);
    console.log(formattedTime);
    (async () => {
      try {
        const rawResponse = await fetch('/add-bitcoin-prijs', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prijs: prijs, tijd: formattedTime })
        });

        const content = await rawResponse.json();
        if (content.addPrijs) {
          console.log('Prijs is toegevoegd');
        } else {
          console.log('Er ging iets mis bij het toevoegen');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  });
}

// Line chart
let hour = true
let week = false
let year = false

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

function checkChard(){
  if(hour == true){
    bitcoinFetch()
  }
  if(week == true){
    addChartWeek()
  }
  if(year == true){
    addChartYear()
  }
}

bitcoinFetch()
setInterval(bitcoinPrijsFetch, 500);

function bitcoinPrijsFetch() {
  for (let i = 0; i < minutesCheck.length; i++) {
    if (minutCheck === minutesCheck[i] && hour == true) {
      setTimeout(bitcoinFetch, 1000)
    }
  }
}

function bitcoinFetch(){
  fetch('/bitcoin-prijs')
  .then((data) => data.json())
  .then((data) => addChartHour(data))
}

function addChartHour(datas) {
  for (let i = 0; i < datas.length; i++) {
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

function addChartWeek(data){
  const chart = document.querySelector('.line-chart');
  new Chart(chart, {
    type: 'line',
    data: {
      labels: ['g','f'],
      datasets: [{
        label: 'week',
        data: [12,23],
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

function addChartYear(data){
  const chart = document.querySelector('.line-chart');
  new Chart(chart, {
    type: 'line',
    data: {
      labels: ['g','f','r'],
      datasets: [{
        label: 'jaar',
        data: [12,23,23],
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
