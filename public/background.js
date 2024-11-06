// background.js
function updateTabCount() {
    chrome.tabs.query({}, (tabs) => {
      const tabCount = tabs.length.toString();
      // Set badge text to show tab count
      chrome.action.setBadgeText({ text: tabCount });
      chrome.action.setBadgeTextColor({color:"#ffffff"})
      chrome.action.setBadgeBackgroundColor({ color: '#0000cc' }); // Optional: Set badge color
    });
  }
  
  // Initial update on startup
  updateTabCount();
  
  // Update the badge whenever a tab is created or removed
  chrome.tabs.onCreated.addListener(updateTabCount);
  chrome.tabs.onRemoved.addListener(updateTabCount);
  