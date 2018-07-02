const exec = require('child_process').exec;
const data = require("../data/global_parameters.json");
const CDP = require('chrome-remote-interface');
const { GetWebsiteNameFromUrl } = require('./AuxiliaryFunction');

/** Class repersnting a Broswer using RemoteDebuggingProtocol. 
 * @class
*/
class BrowserObject{
    /**
     * Creates BrowserObject
     * 
     * @param {string} browserType Broswer's vendor. currently supports only [chrome, opera]
     * @param {string} portNumber RemoteDebuggingProtocol's socket port number 
     */
    constructor(browserType, portNumber){
        this.browserType = browserType;
        this.portNumber = portNumber;
        this.errorHandler = null;
        this.networkData = {type: {}, requests: {}, time: {first: 0, last: 0}, urls: {}};
        this.open = false
        this.CDP = null;
    }
    /**
     * Creates a WebDriver instance using chrome-remote-interface
     * @async
     * @method CreateWebDriver
     */
    async CreateWebDriver(){
        try{       
            this.CDP = await CDP({"port": this.portNumber});
            this.open = true;
        }
        catch(error){
            throw new Error(error);
        }
    }
    /**
     *
     * Opens the browser by executing shell cmd (i.e. chrome.exe --remote-debugging-port=300 --user-data-dir="./")
     * @method RunBrowser
     * @returns {Promise}
     */
    RunBrowser(){
        return exec(`${data[`${this.browserType}_dir`]} --remote-debugging-port=${this.portNumber} --user-data-dir="${data[`${this.browserType}_debug_dir`]}"`)
    }
    /**
     * @method Navigate
     * @param {string} url url you wish to navigate to
     * 
     */
    Navigate(url){
        this.CDP.Page.navigate({'url': url})
    }
    /**
     * Pushes Network data object to networkData array
     * @method UpdateNetworkData
     * @param {object} data Network data object
     */
    UpdateNetworkData(data){
        let websiteName = GetWebsiteNameFromUrl(data.url);
        // Insert first message time
        if (this.networkData.time.first === 0){
            this.networkData.time.first = data.timestamp;
        }
        // Verify if websiteName exists
        if (this.networkData.urls[websiteName] === undefined){
            this.networkData.urls[websiteName] = 0;
        }
        // Verify if requestId exists
        if (this.networkData.requests[data.requestId] === undefined){
            this.networkData.requests[data.requestId] = [];
        }
        // Verify if type exists
        if (this.networkData.type[data.type] === undefined){
            this.networkData.type[data.type] = {req_count: 0, res_count: 0, requestIds: [], status: {}};
        }
        // Add status if exists in data (meaning its a response)
        if (data.status !== undefined){
            if (this.networkData.type[data.type].status[data.status.toString()] === undefined){
                this.networkData.type[data.type].status[data.status.toString()] = {count: 0, requestIds: []}
            }
            this.networkData.type[data.type].status[data.status.toString()].count++;
            this.networkData.type[data.type].res_count++;
            this.networkData.type[data.type].status[data.status.toString()].requestIds.push(data.requestId);
        }
        // not a response
        else{
            this.networkData.type[data.type].req_count++;
            this.networkData.urls[websiteName]++;
        }
        // Insert request to object
        this.networkData.requests[data.requestId].push(data);
        
        // Insert last message time 
        this.networkData.time.last = data.timestamp;
        
        // Insert requestId to type.<type>.requestIds[] and increase count by 1
        if (this.networkData.type[data.type].requestIds.indexOf(data.requestId) === -1){
            this.networkData.type[data.type].requestIds.push(data.requestId);
        }

    }
    /**
     * Function generant an event listner for WebTool.Network.requestWillBeSentEvent
     * @method CreateNetworkRequestWillBeSentEvent
     * @param {callback} callback callback function to be fire on event call
     * @returns {Promise}  
     */
    CreateNetworkRequestWillBeSentEvent(callback){
        return this.CDP.Network.requestWillBeSent(callback);
    }
    /**
     * Function generant an event listner for WebTool.Network.responseReceived
     * @method CreateNetworkResponseReceivedEvent
     * @param {callback} callback callback function to be fire on event call
     * @returns {Promise}  
     */
    CreateNetworkResponseReceivedEvent(callback){
        return this.CDP.Network.responseReceived(callback);
    }
    /**
     * Function generant an event listner for WebTool.Page.loadEventFired
     * @method CreateOnPageLoadEvent
     * @returns {Promise}
     */
    CreateOnPageLoadEvent(){
        return this.CDP.Page.loadEventFired();
    }
    /**
     * Function closes the browser
     * @method CloseBrowser
     */
    CloseBrowser(){
        if (this.open){
            this.CDP.Browser.close();
            this.open = false;
        }
        
    }
    /**
     * Function enables or disables network tracking on WebTool.Network
     * @method EnableNetworkTracking
     * @param {boolean} enable if true it enables tracking, if fasle it disables it.
     * @returns {Promise}
     */
    NetworkTracking(enable){
        if (enable)
            return new Promise((resolve, reject) => {
                try{
                    this.CDP.Network.enable()
                    resolve();
                }
                catch(err){
                    reject(err);
                }
            });
        else
            return this.CDP.Network.disable() 
    }
    /**
     * Function enables or disables page tracking on WebTool.Page
     * @method PageTracking
     * @param {boolean} enable if true it enables tracking, if fasle it disables it.
     * @returns {Promise}
     */
    PageTracking(enable){
        if (enable)
            return this.CDP.Page.enable()
        else
            return this.CDP.Page.disable() 
    }
}

module.exports = BrowserObject;