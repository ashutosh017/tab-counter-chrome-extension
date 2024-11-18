import { useEffect, useState } from "react";

interface TabInfo {
  id: number;
  url: string;
  title: string | undefined;
}

function App() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<TabInfo[]>([]);
  const [tabCount, setTabCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [activeTabId, setActiveTabId] = useState<number>();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  

  useEffect(() => {
    chrome.tabs.query({}, (tabs) => {
      const tabsInfo: TabInfo[] = tabs.map((tab) => ({
        id: tab.id as number,
        url: tab.url || "",
        title:tab.title
      }));
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        const activeTab = tabs[0];
        // console.log(activateTab.);
        // const title = activateTab.title;
        // console.log(activeTab.id)
        setActiveTabId(activeTab.id);
        console.log(activeTabId);
      })
      setTabs(tabsInfo);
      setFilteredTabs(tabsInfo); // Initialize filtered tabs with all tabs
      setTabCount(tabsInfo.length);
    });
  }, []);

  const activateTab = (tabId: number) => {
    chrome.tabs.update(tabId, { active: true });
    setActiveTabId(tabId);
  };

  const handleChange = (val: string) => {
    setSearch(val);
    const foundTabs = tabs.filter((tab) =>
      tab.url.toLowerCase().includes(val.toLowerCase()) || tab.title?.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredTabs(foundTabs);
  };

  useEffect(() => {
    // Set the active tab to the first one in the list initially
    // setActiveTabId(filteredTabs[0]?.id);

    const handleKeyDown = (e:any) => {
      if (e.key === "ArrowDown") {
        // Move down the list
        setSelectedTabIndex((prevIndex) => (prevIndex + 1) % filteredTabs.length);
      } else if (e.key === "ArrowUp") {
        // Move up the list
        setSelectedTabIndex((prevIndex) => 
          (prevIndex - 1 + filteredTabs.length) % filteredTabs.length
        );
      } else if (e.key === "Enter") {
        // Activate the selected tab when pressing Enter
        const selectedTab = filteredTabs[selectedTabIndex];
        if (selectedTab) {
          activateTab(selectedTab.id);
          setActiveTabId(selectedTab.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredTabs, selectedTabIndex, activateTab]);

  return (
    <div className="flex flex-col items-center p-6 bg-zinc-950 text-white min-h-screen w-80 ">
      <h1 className="text-2xl font-semibold mb-4">Opened Tabs: {tabCount}</h1>
      <input
      autoFocus
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        placeholder="Search for tabs"
        className="w-full border border-gray-500 bg-zinc-800 text-white p-2 rounded-md mb-4"
        value={search}
      />
      <div className="flex flex-col space-y-2 w-full max-w-md ">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              activateTab(tab.id);
            }}
            className={`w-full text-start bg-zinc-900 ${activeTabId===tab.id&& "border border-yellow-300"} rounded-lg p-2 text-sm text-gray-100 truncate cursor-pointer  border border-black hover:text-sky-400  `}
          >
            {tab.title}
          </button>
        ))}
        {filteredTabs.length === 0 && (
          <p className="text-gray-400 text-sm">No tabs found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
