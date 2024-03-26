// lack of navigation api requires message passing
// TLDR: If URL changed we send a message to content_script to be handled
function on_msg_send_error(error) {
  console.log(`Error: ${error}`);
}

function on_update(_tabId, changeInfo, _tabInfo) {
  console.log(changeInfo);
  let active_tab = browser.tabs.query({
    currentWindow: true,
    active: true,
  });
  active_tab.then((tabs) => {
    let port = browser.tabs.connect(tabs[0].id, {
      name: "reddit_tabs",
    });
    port.postMessage({ tabs: "reddit tab url updated" });
  }, on_msg_send_error);
  console.log("Message sent to content script");
}

const filter = {
  urls: ["*://www.reddit.com/*"],
  properties: ["url"],
};

browser.tabs.onUpdated.addListener(on_update, filter);
