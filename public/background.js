// Function to update the badge with the current tab count
function updateBadgeCount() {
  chrome.tabs.query({}, (tabs) => {
    const tabCount = tabs.length.toString();
    chrome.action.setBadgeText({ text: tabCount });
    chrome.action.setBadgeTextColor({ color: "#ffffff" });
    chrome.action.setBadgeBackgroundColor({ color: '#0000cc' });
  });
}

// Listen for new tabs being created
chrome.tabs.onCreated.addListener(() => {
  updateBadgeCount();
});

// Listen for tabs being removed
chrome.tabs.onRemoved.addListener(() => {
  updateBadgeCount();
});

// Initialize badge count on extension load
updateBadgeCount();

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: "index.html",
    type: "popup",
    width: 400,
    height: 500
  });
});

