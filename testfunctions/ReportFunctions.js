const { ReduceNetworkData,
        GetIntersection,
        GetUnion,
        CreateNetwrokTypeArrayForComparisonReport,
        GetComparisonObject } = require('../framework/AuxiliaryFunction');
const ReportObject = require('../framework/ReportObject')
/**
 * 
 * Function analyzes network data and creates a comparison report
 * 
 * Example on excepted data structure 
 * { type: {<Network.request.type>: {count: <Number>, requestIds: String[]}}, 
 *   status: {<Network.responce.status>: {count: <Number>, requestIds: String[]}},
 *   requests: {<Netwrok.request.requestId>: Object[]},
 *   time: {first: <Number>, last: <Number>},
 *   urls: {<websiteName>: <Number>}}
 * 
 * @param {String[]} browsersName browser's name [<first>, <second>]
 * @param {Object} firstBrowserData First browser's data
 * @param {Object} secondBrowserData First browser's data 
 * @param {String=} websiteName on which website the comparison was made (optional) 
 */
function CreateNetworkComparison(browsersNames, firstBrowserData, secondBrowserData, websiteName=null){
    let finalResutls = []
    const comparison_type = `${browsersNames[0]} vs ${browsersNames[1]}: Network analysis ${ websiteName ? `(${websiteName})` : ""}`
    const groupIntersection = GetIntersection(ReduceNetworkData(firstBrowserData.requests), ReduceNetworkData(secondBrowserData.requests));
    const firstGroupDissimilarNum = Object.keys(firstBrowserData.requests).length - groupIntersection.length
    const secondGroupDissimilarNum = Object.keys(secondBrowserData.requests).length - groupIntersection.length
    const typeObject = CreateNetwrokTypeArrayForComparisonReport(comparison_type, 'Media type', firstBrowserData.type, secondBrowserData.type)
    const websitesUnited = GetUnion(Object.keys(firstBrowserData.urls), Object.keys(secondBrowserData.urls))
    
    const websiteList = websitesUnited.map((website) => {
                return {...GetComparisonObject(comparison_type, 'Websites', website, false), 
                        browser1: firstBrowserData.urls[website] || '0', 
                        browser2: secondBrowserData.urls[website] || '0'}});
    const generalList = [{...GetComparisonObject(comparison_type, 'General', 'Time to load', false),
                        browser1: `${(firstBrowserData.time.last - firstBrowserData.time.first).toFixed(1)}s`, 
                        browser2: `${(secondBrowserData.time.last - secondBrowserData.time.first).toFixed(1)}s`},
                        {...GetComparisonObject(comparison_type, 'General', 'Total number of requests', false),
                        browser1: Object.keys(firstBrowserData.requests).length, 
                        browser2: Object.keys(secondBrowserData.requests).length},
                        {...GetComparisonObject(comparison_type, 'General', 'Total number of dissimilar requests', false),
                        browser1: firstGroupDissimilarNum, 
                        browser2: secondGroupDissimilarNum},
                        {...GetComparisonObject(comparison_type, 'General', 'Total number of unresolved requests', false),
                        browser1: typeObject.total_unres_b1, 
                        browser2: typeObject.total_unres_b2}]
    finalResutls.push(...generalList);
    finalResutls.push(...typeObject.data);
    finalResutls.push(...websiteList);
    CreateComparisonReport(browsersNames, finalResutls);
};
/**
 * 
 * Function creates a comparison report using ReportObject
 * 
 * @param {String[]} browsersName browser's name [<first>, <second>]
 * @param {Object[]} data an Objects array (i.g {comparison_type: <String>,
 *                                              group: <Sting>,
 *                                              label: <String>,
 *                                              third_level: <Boolean>,
 *                                              total_of_label_b_1: <Any>,
 *                                              total_of_label_b_2: <Any>,
 *                                              browser1: <Any>,
 *                                              browser2: <Any>})
 */
function CreateComparisonReport(browsersNames, data){
    const reportName = `NetworkComparison_${browsersNames[0]}_${browsersNames[1]}`;
    let reportObj = new ReportObject(reportName);
    const comparisonTypeHeader = (Report, data) => {
        Report.print(data.comparison_type, {fontSize: 16, bold: true, align: "left"});
        Report.newLine(1);
        Report.band([
            {data: '', width: Report.maxX()-200},
            {data: browsersNames[0], width: 70, align: "center"},
            {data: browsersNames[1], width: 70, align: "center"}
        ], {x: 0});
        Report.bandLine(1);
    };
    const reportHeader = (Report) => {
        Report.print('Comparison Report', {fontSize: 22, bold: true, underline:true, align: "center"});
        Report.newLine(2); 
    };
    const reportFooter = (Report) => {
        Report.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
    };
    const reportDetails = (Report, data) => {
        Report.band([
            {data: !data.third_level ? data.label : data.sublabel, width: Report.maxX()-240, align: "left"},
            {data: data.browser1, width: 70,align: "center"},
            {data: data.browser2, width: 70, align: "center"}
        ], {x: 40, padding: 1})
    }
    const groupHeader = (Report, data) => {
        Report.fontBold();
        Report.band([
            {data: data.group, width: 240,fontBold: true }
        ], {x: 20});
        Report.fontNormal();
    };
    const labelHeader = (Report, data) => {
        if (data.third_level){
            Report.band([
                {data: data.label, width: 230}
            ], {x: 30});
            Report.fontNormal();
        }
    };
    const labelFooter = (Report, data) => {
        if (data.third_level){
            Report.band([
                {data: data.label+' Total:', width: 100, align: "right"},
                {data: data.total_of_label_b_1, width: 70, align: "center"},
                {data: data.total_of_label_b_2, width: 70, align: "center"}
            ], {x: Report.maxX()-300});
            Report.fontNormal();
            Report.bandLine([1])
        }
    };
    reportObj.AddGrouping('comparison_type', comparisonTypeHeader);
    reportObj.AddGrouping('group', groupHeader);
    reportObj.AddGrouping('label', labelHeader, labelFooter)
    reportObj.SetReportTitle(reportHeader);
    reportObj.SetFooter(reportFooter);
    reportObj.SetDetailFunction(reportDetails);
    reportObj.CreateReport(data);
};

module.exports = { CreateNetworkComparison }