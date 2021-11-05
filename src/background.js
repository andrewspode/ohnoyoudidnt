/*
 * Oh no you didn't!
 * Automatically reload crashed ("aw, snap") tabs
 * Fork of: https://github.com/unclespode/ohnoyoudidnt/tree/master
 */

const errorMessages = ["The frame was removed.", "The tab was closed."];

function reloadCrashedTabs(tabs) {
  for (const tab of tabs) {
    if (tab.status !== "unloaded") {
      continue;
    }

    chrome.tabs.executeScript(tab.id, { code: "null;" }, (result) => {
      if (
        result === undefined &&
        typeof chrome.runtime.lastError === "object" &&
        errorMessages.includes(chrome.runtime.lastError.message)
      ) {
        console.info(
          `Reloading crashed tab (ID: ${tab.id}, Title: "${tab.title}")`
        );

        chrome.tabs.reload(tab.id);
      }
    });
  }
}

setInterval(() => {
  console.log("Checking tabs...");
  chrome.tabs.query({}, reloadCrashedTabs);
}, 1000);
