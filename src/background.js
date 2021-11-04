/*
 * Oh no you didn't!
 * Automatically reload crashed ("aw, snap") tabs
 * Fork of: https://github.com/unclespode/ohnoyoudidnt/tree/master
 */

function reloadCrashedTabs(tabs) {
  for (const tab of tabs) {
    if (tab.status !== "unloaded") {
      continue;
    }

    chrome.tabs.executeScript(tab.id, { code: "null;" }, (result) => {
      if (
        result === undefined &&
        typeof chrome.runtime.lastError === "object" &&
        chrome.runtime.lastError.message === "The frame was removed."
      ) {
        console.info("Reloading crashed tab", tab.id, tab.title);

        chrome.tabs.reload(tab.id);
      }
    });
  }
}

setInterval(function () {
  chrome.tabs.query({}, reloadCrashedTabs);
}, 1000);
