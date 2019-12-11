const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML;
const cancel = document.querySelectorAll('.cancel');
const download = document.querySelector('.download');
const del = document.querySelector('.delete');
let xAxisVal = document.querySelector('.xAxis').value;
let yAxisVal = document.querySelector('.yAxis').value;

// Select SVG container
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 700)
  .attr('height', 600)

// Create margins and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 }
const graphWidth = 700 - margin.left - margin.right
const graphHeight = (600 - margin.top - margin.bottom)

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Scales
const y = d3.scaleLinear()
  .range([graphHeight, 0]);

const x = d3.scalePoint()
  .range([0, graphWidth])

// Create axes group
const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g')

// Create axis
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y)

// x-axis label
var xAxisLabel = svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", graphWidth)
  .attr("y", 580)
  .attr('fill', 'white')

// y-axis label
var yAxisLabel = svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", 25)
  .attr("x", -150)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .attr('fill', 'white')


// Update Function
const update = (data) => {

  // Set scale domains
  const xDomain = data.map(item => Object.keys(item)[0])
  const yMax = d3.max(data, d => Number(Object.values(d)[0]))

  y.domain([0, yMax])
  x.domain(xDomain)

  // D3 line generator
  const line = d3.line()
    .x(function(d, i){return (graphWidth/(xDomain.length-1) * i)})
    .y(function(d, i){return y(d[xDomain[i]])})

  // Line Path Element
  const path = graph.append('path')

  path.data([data])
    .attr('fill', 'none')
    .attr('stroke', 'teal')
    .attr('stroke-width', '2')
    .attr('d', line)

  // Join data to circles
  const circles = graph.selectAll('circle')
    .data(data)


  // Append the enter selection to DOM
  circles.enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', 'white')
    .attr('cx', (d, i) => (graphWidth/(xDomain.length-1) * i))
    .attr('cy', (d, i) => y(d[xDomain[i]]))


  // Call Axes
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

  // Update axes text
  xAxisGroup.selectAll('text')
    .attr('fill', 'white')
  yAxisGroup.selectAll('text')
    .attr('fill', 'white')

  // Update Axes labels
  xAxisLabel.text(xAxisVal)
  yAxisLabel.text(yAxisVal)

}

const generateData = () => {
  let data = [];
  let inputs = document.querySelectorAll('.input');
  let value = document.querySelectorAll('.value');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value != '' && value[i].value != '') {
      let obj = {}
      obj[inputs[i].value] = value[i].value;
      data.push(obj)
    }
  }
  return data
}

update(generateData())

submitFields.addEventListener('click', () => {
  xAxisVal = document.querySelector('.xAxis').value
  yAxisVal = document.querySelector('.yAxis').value
  let table = document.querySelector('#table')
  let arr = [];
  let inputs = document.querySelectorAll('.input');
  let value = document.querySelectorAll('.value');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value != '' && value[i].value != '') {
      let obj = {}
      obj[inputs[i].value] = value[i].value;
      arr.push(obj)
    }
  }
  fetch('/graphs/changeGraph', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        graphInfo: arr,
        graphName: graphName,
        xAxis: xAxisVal,
        yAxis: yAxisVal
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      update(generateData())
      window.location.reload(true)
    })
})

for (let i = 0; i < cancel.length; i++) {
  cancel[i].addEventListener('click', () => {
    let inputs = document.querySelectorAll('.input');
    let value = document.querySelectorAll('.value');
    fetch('/graphs/deleteField', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: inputs[i].value,
          value: value[i].value,
          graphName: graphName
        })
      })
      .then(res => {
        if (res.ok) return res.json()
      }).
    then(data => {
      console.log(data)
      window.location.reload(true)
    })
  })
}

download.addEventListener('click', () => {
  const canvas = document.querySelector('.canvas');
  domtoimage.toPng(canvas, {
      quality: 0
    })
    .then(function(dataUrl) {
      var link = document.createElement('a');
      link.download = 'graph.png';
      link.href = dataUrl;
      link.click();
    });
})

del.addEventListener('click', () => {
  fetch('/graphs/deleteGraph', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        graphName: graphName
      })
    })
    .then(res => {
      if (res.ok) return res.json()
    }).
  then(data => {
    console.log(data)
    window.location.href = '/dashboard'
  })
})
