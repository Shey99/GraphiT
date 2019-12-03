const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML;
const cancel = document.querySelectorAll('.cancel');
const download = document.querySelector('.download');

var generateData = () => {
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

var generateGraph = () => {
  let data = generateData()

  const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 700)
    .attr('height', 600)

  // Create margins and dimensions
  const margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
  }
  const graphWidth = 700 - margin.left - margin.right
  const graphHeight = (600 - margin.top - margin.bottom)

  const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)
  const yAxisGroup = graph.append('g')


  const rects = graph.selectAll('rect')
    .data(data)

  let xDomain = [];
  for (let i = 0; i < data.length; i++) {
    xDomain.push((Object.keys(data[i])[0]));
  }

  const min = d3.min(data, d => Number(Object.values(d)[0]))
  const max = d3.max(data, d => Number(Object.values(d)[0]))

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Number(Object.values(d)[0]))])
    .range([graphHeight, 0]);

  const x = d3.scaleBand()
    .domain(xDomain)
    .range([0, graphWidth])
    .paddingInner(0.05)
    .paddingOuter(0.2)

  rects.attr('width', x.bandwidth)
    .attr('height', (d, i) => {
      return graphHeight - y(d[xDomain[i]])
    })
    .attr('fill', 'teal')
    .attr('x', d => x((Object.keys(d)[0])))
    .attr('y', (d, i) => y(d[xDomain[i]]))

  rects.enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', (d, i) => {
      return graphHeight - y(d[xDomain[i]])
    })
    .attr('fill', 'teal')
    .attr('x', d => x((Object.keys(d)[0])))
    .attr('y', (d, i) => y(d[xDomain[i]]))

  // Create and call axis
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)


  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

}
generateGraph()




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
  console.log(arr);
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
  const canvas = document.querySelector('.canvas').innerHTML
  console.log(canvas);
  fetch('/graphs/download', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        svg: canvas
      })
    })
    .then(res => {
      if (res.ok) return res.json()
    }).
  then(data => {
    console.log(data)
    // window.location.reload(true)
  })
})
