// background.js
function updateTabCount() {
    chrome.tabs.query({}, (tabs) => {
      const tabCount = tabs.length.toString();
      // Set badge text to show tab count
      chrome.action.setBadgeText({ text: tabCount });
      chrome.action.setBadgeBackgroundColor({ color: '#4688F1' }); // Optional: Set badge color
    });
  }
  
  // Initial update on startup
  updateTabCount();
  
  // Update the badge whenever a tab is created or removed
  chrome.tabs.onCreated.addListener(updateTabCount);
  chrome.tabs.onRemoved.addListener(updateTabCount);
  