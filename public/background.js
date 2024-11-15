chrome.tabs.onUpdated.addListener(updateBadge);
chrome.tabs.onCreated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);

function updateBadge() {
  chrome.tabs.query({}, (tabs) => {
    const tabCount = tabs.length.toString();
    chrome.action.setBadgeText({ text: tabCount });
    chrome.action.setBadgeTextColor({ color: "#ffffff" });
    chrome.action.setBadgeBackgroundColor({ color: '#0000cc' });
  });
}
