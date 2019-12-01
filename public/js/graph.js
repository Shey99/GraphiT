const addField = document.querySelector('.addField');
const submitFields = document.querySelector('.submitFields');
const form = document.querySelector('form');
const graphName = document.querySelector('.graphName').innerHTML

addField.addEventListener('click', () => {
  const field = document.querySelectorAll('.field');
  let lastField = field[field.length - 1];
  lastField.insertAdjacentHTML(
    'afterend',
    '<div class="row field"><div class="input-field col s6"><input type="text" class="input"><label>Input</label></div><div class="input-field col s6"><input type="text" class="value"><label>Value</label></div></div>')
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
