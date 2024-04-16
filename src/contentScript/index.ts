chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === 'REDDIT') {
    hideReddit(message.url);
  }
})

function hideReddit(url: string) {
  if (url.includes('comments')) return;

  const subgrid = document.getElementsByClassName('subgrid-container')
  if (subgrid.length) {
    (subgrid[0] as HTMLElement).style.display = 'none'
  }
}
