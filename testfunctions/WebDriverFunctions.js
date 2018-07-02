const BrowserObject = require('../framework/WebDriverObject');
const { Sleep } = require('../framework/AuxiliaryFunction');
/**
 * Gets WebTools object by BrowserType
 * 
 * @param {string} browserType The type of browser {opera, chrome}
 * @param {string} portNumebr The port number for Remote Debugging Protocol [3000 - 9222]
 * @returns {BrowserObject}
 */
async function GetWebDriverObject(browserType, portNumebr) {
    var Browser = new BrowserObject(browserType, portNumebr);
    await Browser.RunBrowser();
    Sleep(1000);
    await Browser.CreateWebDriver();
    return Browser;
};
/**
 * Function starts a Network Event listner using BrowserObject
 * 
 * @param {BrowserObject} browserObject a BrowserObject
 * @param {string} eventType the specific event
 * @param {callback} callback callback function to be fire on event call
 * @returns {Promise}
 */
function CreateNetworkEventListener(browserObject, eventType, callback){
    switch (eventType){
        case 'requestWillBeSent': return browserObject.CreateNetworkRequestWillBeSentEvent(callback);
        case 'responseReceived': return browserObject.CreateNetworkResponseReceivedEvent(callback);
        default: return;
    }
};
/**
 * Function starts a Page Event listner using BrowserObject
 * 
 * @param {BrowserObject} browserObject a BrowserObject
 * @param {string} eventType the specific event
 * @returns {Promise}
 */
function CreatePageEventListener(browserObject, eventType){
    switch (eventType){
        case 'loadEventFired': return browserObject.CreateOnPageLoadEvent();
        default: return;
    }
};
/**
 * Function fires CloseBrowser function at aBrowserObject
 * 
 * @param {BrowserObject} browserObject a BrowserObject
 * @returns {Promise}
 */
function CloserBrowser(browserObject){
    return browserObject.CloseBrowser();
};
/**
 * Function enables or disables tracking on a specific domain
 * 
 * @param {BrowserObject} browserObject a BrowserObject
 * @param {string} domain a specific domin within WebTools
 * @param {boolean} enable if true it enables tracking, if fasle it disables it.
 * @returns {Promise}
 */
function ControllTracking(browserObject, domain, enable){
    switch (domain){
        case 'Network': return browserObject.NetworkTracking(enable);
        case 'Page': return browserObject.PageTracking(enable);
        default: return;
    }
};
/**
 * Function uses BrowserObject.Navigate to make a navigation request 
 * 
 * @param {BrowserObject} browserObject 
 * @param {String} url 
 */
function NavigateToUrl(browserObject, url){
    browserObject.Navigate(url);
}
/**
 * Function updates network data at BrowserObject using BrowserObject.UpdateNetworkData
 * 
 * @param {BrowserObject} browserObject 
 * @param {Object} data 
 */
function UpdateNetworkData(browserObject, data){
    browserObject.UpdateNetworkData(data);
}

module.exports = {  GetWebDriverObject, 
                    CreateNetworkEventListener,
                    CreatePageEventListener,
                    CloserBrowser,
                    ControllTracking, 
                    NavigateToUrl,
                    UpdateNetworkData};