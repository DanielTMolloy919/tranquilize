console.log('background script loaded')
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.includes('reddit.com')) {
    console.log('webpage is reddit!')
    chrome.tabs.sendMessage(tabId, { type: 'REDDIT', url: tab.url })
  }
})
