import { useEffect, useState } from "react";

function App() {
  const [tabCount, setTabCount] = useState(0);

  const getTabCount = () => {
    // Check if the Chrome tabs API is available
    if (chrome && chrome.tabs) {
      chrome.tabs.query({}, (tabs) => {
        setTabCount(tabs.length);
      });
    }
  };

  useEffect(() => {
    // Initial tab count fetch
    getTabCount();

    // Listen for updates when a tab is created or removed
    chrome.tabs.onCreated.addListener(getTabCount);
    chrome.tabs.onRemoved.addListener(getTabCount);

    // Clean up event listeners on component unmount
    return () => {
      chrome.tabs.onCreated.removeListener(getTabCount);
      chrome.tabs.onRemoved.removeListener(getTabCount);
    };
  }, []);

  return (
    <div>
      <p>{`Tab Count: ${tabCount}`}</p>
    </div>
  );
}

export default App;
