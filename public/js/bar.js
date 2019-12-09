const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML;
const cancel = document.querySelectorAll('.cancel');
const download = document.querySelector('.download');


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

const x = d3.scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.05)
  .paddingOuter(0.2)

// Create axes group
const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g')

// Create and call axis
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y)

// Update axes text
xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'white')
yAxisGroup.selectAll('text')
  .attr('fill', 'white')

// Update Function
const update = (data) => {

  // Update scale domains
  const xDomain = data.map(item => Object.keys(item)[0])
  const max = d3.max(data, d => Number(Object.values(d)[0]))

  y.domain([0, d3.max(data, d => Number(Object.values(d)[0]))])
  x.domain(xDomain)

  // Join data to rects
  const rects = graph.selectAll('rect')
    .data(data)

  // Remove Exit Selection
  rects.exit().remove()

  // Update Current Selection In DOM
  rects.attr('width', x.bandwidth)
    .attr('height', (d, i) => { return graphHeight - y(d[xDomain[i]])})
    .attr('fill', 'teal')
    .attr('x', d => x((Object.keys(d)[0])))
    .attr('y', (d, i) => y(d[xDomain[i]]))

  // Append the enter selection to DOM
  rects.enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', (d, i) => {return graphHeight - y(d[xDomain[i]])})
    .attr('fill', 'teal')
    .attr('x', d => x((Object.keys(d)[0])))
    .attr('y', (d, i) => y(d[xDomain[i]]))

  // Call Axes
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

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
        graphName: graphName
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
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
