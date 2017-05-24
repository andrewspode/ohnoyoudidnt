/* Oh no you didn't! 
 * Automatic reload of crashed tabs
 * https://github.com/unclespode/ohnoyoudidnt/tree/master
 */

 /*
Copy this into a javascript console in a tab to crash it.
var memoryEater = "nom"; while(true) {memoryEater = memoryEater += "nom";}
*/

//Track how many times our no-op was a success
var tabSuccessCount = {};

function checkActive(tabs) {

    var tabsLength = tabs.length;

    while (tabsLength--) {
        /*It's in a function to create a closure*/
        (function() {
            var thisTab = tabs[tabsLength];

            //Only check tabs that have finished loading and are http / https
            //This basically lets it ignore tabs like chrome://
            if (( thisTab.url.substring(0, 4) == "http" || thisTab.url.substring(0, 4) == "file" ) && thisTab.status == "complete") {

                //Perform a no-op
                chrome.tabs.executeScript(thisTab.id, {
                    code: "null;"
                }, function(result) {
                    //We will get a callback no matter what (unlike when I first released this)

                    //If it reports it's closed, then it's crashed, because a genuine close fires an event. A crashed tab does not.
                    if (chrome.runtime.lastError && chrome.runtime.lastError.message == "The tab was closed.") {
                        console.log("Crashed: ", thisTab.title, thisTab.id);
                        
                        //Only reload it if at least one sucessful no-op has occurred. 
                        //I'm not sure if this is needed anymore, but it's not a bad check to do
                        if (tabSuccessCount[thisTab.id] > 0) {
                            console.log("Reloading: ", thisTab.title, thisTab.id);
                            chrome.tabs.reload(thisTab.id); //reload it
                        }
                    } else {
                        //Sucessfully ran our no-op, so add it up
                        tabSuccessCount[thisTab.id] = tabSuccessCount[thisTab.id] || 0;
                        tabSuccessCount[thisTab.id]++;
                    }
                });
            }
        }).call();
    }
}

/*Check once a second to make sure tabs are still responding*/
setInterval(function() {
    chrome.tabs.query({}, checkActive);
}, 1000);

//If the tab reloads, reset stats
chrome.tabs.onUpdated.addListener(tabChanged);
chrome.tabs.onRemoved.addListener(tabChanged);

//If a tab is genuinely closed, or refreshed - then reset the number of sucesses
function tabChanged(tabId, changeInfo, tab) {
    console.log("Resetting Stats: ", tabId);
    tabSuccessCount[tabId] = 0;
}