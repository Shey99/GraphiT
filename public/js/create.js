const graphOptionsWrap = document.querySelector('.graphOptionsWrap');
const createWrap = document.querySelector('.createWrap');
const option = document.querySelectorAll('.option');
let graphType = document.querySelector('.graphType');
let graphName = document.querySelector('.graphName');
const createBtn = document.querySelector('.createBtn');
const cancelBtn = document.querySelector('.cancelBtn');

for (let i = 0; i < option.length; i++) {
  option[i].addEventListener('click', () => {
    graphOptionsWrap.style.opacity = '0.5';
    createWrap.style.display = 'block';
    graphType.innerHTML = `${option[i].innerHTML}`;
  })
}

cancelBtn.addEventListener('click', () => {
  graphOptionsWrap.style.opacity = '1';
  createWrap.style.display = 'none';
})

createBtn.addEventListener('click', () => {
  fetch('createGraph', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            graphName: graphName.value,
            graphType: graphType.innerHTML
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
