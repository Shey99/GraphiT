const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML
const cancel = document.querySelectorAll('.cancel')


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
  let data = Object.keys(generateData())
  console.log(data);


  const svg = d3.select('svg');

    const y = d3.scaleLinear()
      .domain([0, 40])
      .range([0, 500]);

    const x = d3.scaleBand()
      .domain(Object.keys())
      .range([0,500])
      .paddingInner(0.2)
      .paddingOuter(0.2)

    const rects = svg.selectAll('rect')
      .data(data)

    rects.attr('width', 20)
      .attr('height', d => 30)
      .attr('fill', 'teal')
      .attr('x', d => 5)

    // append the enter selection to the DOM
    rects.enter()
      .append('rect')
      .attr('width', 20)
      .attr('height', d => 30)
      .attr('fill', 'teal')
      .attr('x', (d, i) => i*20 )

    // console.log();
}
generateGraph()

addField.addEventListener('click', () => {
  let newInput = document.querySelector('.newInput').value;
  let newValue = document.querySelector('.newValue').value;
  console.log(newInput);
  console.log(newValue);
  if (newInput != '' && newValue != '') {
    const each = document.querySelectorAll('.each');
    let lastEach = each[each.length - 2];
    lastEach.insertAdjacentHTML(
      'afterend',
      '<div class="row field"><div class="input-field col s6"><input type="text" class="input"><label>Input</label></div><div class="input-field col s6"><input type="text" class="value"><label>Value</label></div></div>')
  }
})

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
