
const { GetWebDriverObject, 
        CreateNetworkEventListener,
        CreatePageEventListener,
        CloserBrowser,
        ControllTracking, 
        NavigateToUrl,
        UpdateNetworkData} = require('../testfunctions/WebDriverFunctions');
const { CreateRequestNetworkData,
        CreateResponseNetworkData } = require('../testfunctions/GeneralFunctions');
const { CreateNetworkComparison } = require('../testfunctions/ReportFunctions')
const { browser1_port, browser2_port} = require('../data/global_parameters.json')


describe('Browser Comparison', function() {
    describe('DOM Comparison between Opera and Chrome', function() {
        let opera, chrome;
        this.timeout(10000);
        before(async () => {
            try{
                [opera, chrome] = await Promise.all([GetWebDriverObject('opera', browser2_port), GetWebDriverObject('chrome', browser1_port)])
            }
            catch(error){
                throw new Error(error);
            }
        });
        it('Network comparison on https://www.wired.com/',(done) => {
            let count = 0;
            CreateNetworkEventListener(chrome, 'requestWillBeSent', (params) => {
                UpdateNetworkData(chrome, CreateRequestNetworkData(params));
            });
            CreateNetworkEventListener(chrome, 'responseReceived', (params) => {
                UpdateNetworkData(chrome, CreateResponseNetworkData(params));
            });
            CreateNetworkEventListener(opera, 'requestWillBeSent', (params) => {
                UpdateNetworkData(opera, CreateRequestNetworkData(params));
            });
            CreateNetworkEventListener(opera, 'responseReceived', (params) => {
                UpdateNetworkData(opera, CreateResponseNetworkData(params));
            });
            CreatePageEventListener(opera, 'loadEventFired').then(() => {
                Promise.all([ControllTracking(opera, 'Network', false), ControllTracking(opera, 'Page', false)]).then(() => {
                    if (count > 0){
                        CreateNetworkComparison(['Chrome', 'Opera'], chrome.networkData, opera.networkData, 'www.wired.com')
                        done();
                    }
                    count++;
                }).catch((err) => {
                    done(err);
                });
            });
            CreatePageEventListener(chrome, 'loadEventFired').then(() => {
                Promise.all([ControllTracking(chrome, 'Network', false), ControllTracking(chrome, 'Page', false)]).then(() => {
                    if (count > 0){
                        CreateNetworkComparison(['Chrome', 'Opera'], chrome.networkData, opera.networkData, 'www.wired.com')
                        done();
                    }
                    count++;
                }).catch((err) => {
                    done(err);
                });
            });
            Promise.all([ControllTracking(opera, 'Network', true), ControllTracking(opera, 'Page', true)]).then(() => NavigateToUrl(opera, 'https://www.wired.com/'))
            .catch((err) => done(err));
            Promise.all([ControllTracking(chrome, 'Network', true), ControllTracking(chrome, 'Page', true)]).then(() => NavigateToUrl(chrome, 'https://www.wired.com/'))
            .catch((err) => done(err));
        }).timeout(60000);
        after(() => {
            chromeFunction = chrome ? CloserBrowser : () => {return};
            operaFunction = opera ? CloserBrowser : () => {return};
            Promise.all([chromeFunction(chrome),operaFunction(opera)]);
        });
    })
})


 
