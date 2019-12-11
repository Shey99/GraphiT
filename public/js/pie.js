const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML;
const cancel = document.querySelectorAll('.cancel');
const download = document.querySelector('.download');
const del = document.querySelector('.delete')

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

  const dims = {
    height: 500,
    width: 500,
    radius: 250
  };
  const cent = {
    x: (dims.width / 2 + 5),
    y: (dims.height / 2 + 5)
  };

  const svg = d3.select('.canvas')
    .append('svg')
      .attr('width', dims.width + 200)
      .attr('height', dims.height + 50)

  const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y + 25})`)

  const pie = d3.pie()
    .sort(null)
    .value(d => Number(Object.values(d)[0]))

  const angles = pie(data);

  const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 3)

  const color = d3.scaleOrdinal(d3['schemeSet1'])

  color.domain(data.map(d => Object.keys(d)[0]));

  const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width + 40}, 25)`)

  const legend = d3.legendColor()
    .shape('circle')
    .scale(color)

  legendGroup.call(legend)
  legendGroup.selectAll('text')
    .attr('fill', 'white')

  const paths = graph.selectAll('path')
    .data(pie(data));
      paths.enter()
        .append('path')
          .attr('class', 'arc')
          .attr('d', arcPath)
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
          .attr('fill', d => color(Object.keys(d.data)[0]));

}
generateGraph()

$(document).ready(function(){
      $('.modal').modal();
    });

// Embed Code
document.querySelector('.graphCode').textContent = document.querySelector('.canvas').innerHTML

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
