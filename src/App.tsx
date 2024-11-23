import { useEffect, useState } from "react";

interface TabInfo {
  id: number;
  url: string;
  title: string | undefined;
  audible:boolean
}

function App() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<TabInfo[]>([]);
  const [tabCount, setTabCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [activeTabId, setActiveTabId] = useState<number>();

  

  useEffect(() => {
    chrome.tabs.query({}, (tabs) => {
      const tabsInfo: TabInfo[] = tabs.map((tab) => ({
        id: tab.id as number,
        url: tab.url || "",
        title:tab.title,
        audible:tab.audible as boolean
      }));
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        const activeTab = tabs[0];
        setActiveTabId(activeTab.id);
        console.log(activeTabId);
      })
      setTabs(tabsInfo);
      setFilteredTabs(tabsInfo);
      setTabCount(tabsInfo.length);
    });
  }, []);

  const activateTab = (tabId: number) => {
    chrome.tabs.update(tabId, { active: true });
    setActiveTabId(tabId);
  };

  const handleChange = (val: string) => {
    setSearch(val);
  
    const foundTabs = tabs
      .filter((tab) =>
        tab.url.toLowerCase().includes(val.toLowerCase()) || 
        tab.title?.toLowerCase().includes(val.toLowerCase())
      )

  
    setFilteredTabs(foundTabs);
  };
  

  

  return (
    <div className="flex flex-col items-center p-6 bg-zinc-900 text-white min-h-screen min-w-80 w-auto h-auto ">
     <div className="sticky top-0 w-full  text-center">
     <h1 className="text-2xl font-semibold mb-4">Opened Tabs: {tabCount}</h1>
      <input
      autoFocus
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        placeholder="Search for tabs"
        className="w-full border border-gray-500 bg-zinc-800 text-white p-2 rounded-md mb-4"
        value={search}
      />
     </div>
      <div className="flex flex-col space-y-2 w-full max-w-md ">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              activateTab(tab.id);
            }}
            className={`flex flex-col w-full text-start ${activeTabId===tab.id? "bg-transparent":"bg-zinc-950"} rounded-lg p-2 text-sm text-gray-100 cursor-pointer  hover:text-blue-500  `}
          >
           <span className="truncate w-full"> {tab.title}</span>
            <span className="text-[10px] truncate w-full text-gray-400 italic">{tab.url}</span>
            {tab.audible && <span>audible</span>}
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
