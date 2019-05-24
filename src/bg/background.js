/* Oh no you didn't!
 * Automatic reload of crashed tabs
 * https://github.com/unclespode/ohnoyoudidnt/tree/master
 */

/*
Copy this into a javascript console in a tab to crash it.
var memoryEater = "nom"; while(true) {memoryEater = memoryEater += "nom";}
*/

function checkActive(tabs) {

    var tabsLength = tabs.length;

    while (tabsLength--) {
        /*It's in a function to create a closure*/
        (function () {
            var thisTab = tabs[tabsLength];

            //Only check tabs that have finished loading and are http / https
            //This basically lets it ignore tabs like chrome://
            if ((thisTab.url.substring(0, 4) == "http" || thisTab.url.substring(0, 4) == "file") && thisTab.status == "complete") {

                //Perform a no-op
                chrome.tabs.executeScript(thisTab.id, {
                    code: "null;"
                }, function (result) {
                    //We will get a callback no matter what (unlike when I first released this)

                    //If it reports it's closed, then it's crashed, because a genuine close fires an event. A crashed tab does not.
                    if (chrome.runtime.lastError && chrome.runtime.lastError.message == "The tab was closed.") {
                        console.log("Crashed, reloading: ", thisTab.title, thisTab.id);
                        chrome.tabs.reload(thisTab.id); //reload it
                    }
                });
            }
        }).call();
    }
}

/*Check once a second to make sure tabs are still responding*/
setInterval(function () {
    chrome.tabs.query({}, checkActive);
}, 1000);