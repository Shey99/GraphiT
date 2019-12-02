const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML;
const cancel = document.querySelectorAll('.cancel');

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

  let xDomain = [];
  for (let i = 0; i < data.length; i++) {
    xDomain.push(Object.keys(data[i])[0]);
  }

  console.log(xDomain);

  let maxY = 0;
  for (let i = 0; i < data.length; i++) {
    if (parseInt((Object.values(data[i])[0])) > maxY) {
      maxY = (Object.values(data[i])[0])
    }
  }

  console.log(maxY);

  const svg = d3.select('svg');

  const y = d3.scaleLinear()
    .domain([0, maxY * 1.4])
    .range([0, 500]);

  const x = d3.scaleBand()
    .domain(xDomain)
    .range([0, 600])
    .paddingInner(0.05)
    .paddingOuter(0.2)


  const rects = svg.selectAll('rect')
    .data(data)


  rects.attr('width', x.bandwidth)
    .attr('height', (d, i) => {
      return y(d[xDomain[i]])
    })
    .attr('fill', 'teal')
    .attr('x', d => x((Object.keys(d)[0])))

  rects.enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', (d, i) => {
      return y(d[xDomain[i]])
    })
    .attr('fill', 'teal')
    .attr('x', d => x((Object.keys(d)[0])))

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
