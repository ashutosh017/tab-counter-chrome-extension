import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import { LuAudioLines } from "react-icons/lu";
interface TabInfo {
  id: number;
  url: string;
  title: string | undefined;
  audible: boolean;
}

function App() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<TabInfo[]>([]);
  const [tabCount, setTabCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [activeTabId, setActiveTabId] = useState<number>();

  useEffect(() => {
    chrome.tabs.query({}, (tabs) => {
      const tabsInfo: TabInfo[] = tabs.map((tab) => {
        // const processId = chrome.processes
        console.log("typeof chrome: ", typeof chrome);
        const something = {
          id: tab.id as number,
          url: tab.url || "",
          title: tab.title,
          audible: tab.audible as boolean,
        };
        return something;
      });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        setActiveTabId(activeTab.id);
        console.log(activeTabId);
      });
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

    const foundTabs = tabs.filter(
      (tab) =>
        tab.url.toLowerCase().includes(val.toLowerCase()) ||
        tab.title?.toLowerCase().includes(val.toLowerCase())
    );

    setFilteredTabs(foundTabs);
  };

  return (
    <div className="flex flex-col items-center  bg-black text-white min-h-screen min-w-80 w-auto h-auto ">
      <div className="sticky top-0 w-full bg-black text-center px-4 pt-4 pb-2">
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
      <div className="flex flex-col space-y-2 w-full max-w-md px-4 pb-4 pt-0 ">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              activateTab(tab.id);
            }}
            className={`flex w-full text-start  ${
              activeTabId === tab.id ? "bg-gray-300 text-black font-bold" : "bg-zinc-900 hover:bg-zinc-800"
              // "bg-transparent"
            } rounded-lg p-2 text-sm  cursor-pointer justify-between items-center   `}
          >
            <div className="flex flex-col flex-1   truncate  ">
              <span className="truncate w-full  ">
                {" "}
                {tab.title}
              </span>
              <span className="text-[10px] truncate w-full  italic  ">
                {tab.url}
              </span>
            </div>
            {tab.audible && (
            <div className="flex space-x-0.5 items-center px-2"> 
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-green-700 rounded"
                animate={{ height: [2,10,2] }} 
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2, 
                }}
              />
            ))}
          </div>
            )}
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
