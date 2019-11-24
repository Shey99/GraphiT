const del = document.querySelector('.del');
const name = document.querySelector('.name').innerHTML;
const addJson = document.querySelector('.addJson');

addJson.addEventListener('click', () => {
  const jsonFile = document.querySelector('.jsonInput').value
  fetch('add', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user': name,
      'file': jsonFile
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
  })
})

del.addEventListener('click', () => {
  fetch('delete', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user': name
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
  })
})
