chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === 'REDDIT') {
    hideReddit();
  }
})

function hideReddit() {
  const subgrid = document.getElementsByClassName('subgrid-container')
  if (subgrid.length) {
    subgrid[0].style.display = 'none'
  }
}
