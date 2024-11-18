

chrome.tabs.query({}, (tabs) => {
  const tabCount = tabs.length.toString();
  chrome.action.setBadgeText({ text: tabCount });
  chrome.action.setBadgeTextColor({color:"#ffffff"})
  chrome.action.setBadgeBackgroundColor({ color: '#0000cc' });
});


