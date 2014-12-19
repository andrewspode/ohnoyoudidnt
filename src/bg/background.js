/* Oh no you didn't! 
 * Automatic reload of crashed tabs
 * https://github.com/unclespode/ohnoyoudidnt/tree/master
 */

var calledTabs = [];
var callsOut = 0;
var callsIn = 0;
var callsComplete = {};
var tabSuccessCount = {};
var tabFailCount = {};

function checkActive(tabs) {

    /*Before Checking Again, Did it work last time? */

    if (callsOut !== callsIn) {
        var callsLength = calledTabs.length;

        while (callsLength--) {
            var thisCall = calledTabs[callsLength];

            //don't restart if it hasn't had at least ONE successful callback
            if (!callsComplete[thisCall.id] && thisCall.status == "complete" && tabSuccessCount[thisCall.id] > 0) {
                tabFailCount[thisCall.id] = tabFailCount[thisCall.id] || 0;
                tabFailCount[thisCall.id]++;

                console.log("Fail number " + tabFailCount[thisCall.id], thisCall.title);
                
                //Needs to have failed 10 times in a row
                if (tabFailCount[thisCall.id] >= 10) {
                    console.log("Reloading: ", thisCall.title);
                    tabSuccessCount[thisCall.id] = 0;
                    chrome.tabs.reload(thisCall.id); //reload it
                 }
            }
        }
    }

    /*Reset our metrics*/
    callsOut = 0;
    callsIn = 0;
    callsComplete = {};
    calledTabs = [];

    var tabsLength = tabs.length;
    while (tabsLength--) {
        /*It's in a function to create a closure*/
        (function() {
            var thisTab = tabs[tabsLength];

            //Only check tabs that have finished loading and are http / https
            if (thisTab.url.substring(0, 4) == "http" && thisTab.status == "complete") {

                callsOut++;
                calledTabs.push(thisTab);

                //Perform a NOOP and hopefully get a callback
                chrome.tabs.executeScript(thisTab.id, {
                    code: "null;",
                    /*runAt: "document_start"*/
                }, function() {
                    callsIn++;
                    callsComplete[thisTab.id] = true;

                    tabSuccessCount[thisTab.id] = tabSuccessCount[thisTab.id] || 0;
                    tabSuccessCount[thisTab.id]++;
                    tabFailCount[thisTab.id] = 0; //reset fails count
                });
            }
        }).call();
    }
}

/*Check once a second to make sure tabs are still responding*/

setInterval(function() {
    /*Get all the tabs and check them*/

    chrome.tabs.query({},
        function(tabs) {
            checkActive(tabs);
        });
}, 1000);

//If the tab reloads, reset stats
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tabSuccessCount[tabId] = 0;
    tabFailCount[tabId] = 0;
});