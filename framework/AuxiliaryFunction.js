var dateFormat = require('dateformat');
/**
 * Function blocks running for a specific time
 * 
 * 
 * @param {integer} milliseconds 
 */
function Sleep(milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}
/**
 * Function returns a string date by the specify format
 * 
 * @param {string} fromat should be supported by dateformat module
 * @returns {string}
 */
function GetTimeStampString(fromat){
  let now = new Date();
  return dateFormat(now, fromat);

};
/**
 * Function gets website name extracted from the url
 * Uses regex
 *
 * @param {String} url url (i.g. https://www.github.com/benmalka)
 * @returns {String} website name (i.g. www.github.com) or 'Not a url name' incase there's no matching
 */
function GetWebsiteNameFromUrl(url){
  let pattern = new RegExp(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
  let res = pattern.exec(url);
  if (res) return res[1];
  return 'Not a url request'
}
/**
 * Function unites two arrays togther with no overlapings
 * 
 * 
 * @param {Array} array1 
 * @param {Array} array2
 * @returns {Array} array1 ∪ array2
 */
function GetUnion(array1, array2){ 
  return Object.values({...array1, ...array2});
}
/**
 * Function intersects two arrays
 *
 * 
 * @param {Array} array1
 * @param {Array} array2 
 * @returns {Array} array1 ∩ array2
 */
function GetIntersection(array1, array2){ 
  return array1.filter((item) => {
    return array2.indexOf(item) !== -1;
  });
}
/**
 * Function reduces Netwrok Object to a specfic structure
 * 
 * @param {Object} networkData BrowserObject.networkData
 * @returns {Object[]} with specific new strcture 
 */
function ReduceNetworkData(networkData){
  return Object.keys(networkData).reduce((acc, key) => {
    const responseData = networkData[key][0];
    const newValue = {type: responseData.type, url: responseData.url};
    return acc.concat(JSON.stringify(newValue)); 
  }, []);
}
/**
 * Function gets the basic structure for Comparison object
 * 
 * 
 * @param {String} compTypeKey comparison type (i.e. 'Chrome vs Opera: Network analysis' )
 * @param {String} groupeKey group of item (i.e. 'General')
 * @param {String} label label under group (i.e. 'Time to load')
 * @param {Boolean} third_level if true it tells the reports that there's a third level on this specific label
 * @returns {Object} 
 */
function GetComparisonObject(compTypeKey, groupeKey, label, third_level){
  return {comparison_type: compTypeKey,
          group: groupeKey,
          label: label,
          third_level: third_level}
}
/**
 * 
 * @param {String} compTypeKey 
 * @param {String} typeKey 
 * @param {Object} firstBrowserDataObject 
 * @param {Object} secondBrowserDataObject
 * @returns {Object}
 */
function CreateNetwrokTypeArrayForComparisonReport(compTypeKey, groupeKey, firstBrowserDataObject, secondBrowserDataObject){
  let total_unres_b_1 = 0; total_unres_b_2 = 0;
  const runnerArray = GetUnion(Object.keys(firstBrowserDataObject), Object.keys(secondBrowserDataObject))
  return {data: runnerArray.reduce((acc, reqType) => {
            const initialObject = {count: 0, status: {}};
            let firstObject = firstBrowserDataObject[reqType] || initialObject,
            secondObject = secondBrowserDataObject[reqType] || initialObject;

            const secondRunnerArray = GetUnion(Object.keys(firstObject.status), Object.keys(secondObject.status));
            let statusArray = secondRunnerArray.map((key) => {
              let first = firstObject.status[key] || {count: 0},
              second = secondObject.status[key] || {count: 0}
              return {...GetComparisonObject(compTypeKey, groupeKey, reqType, true),
                      total_of_label_b_1: Math.max(firstObject.req_count, firstObject.res_count) || 0,
                      total_of_label_b_2: Math.max(secondObject.req_count, secondObject.res_count) || 0, 
                      sublabel: key,
                      browser1: first.count, 
                      browser2: second.count}
            });
            const unres_b_1 = firstObject.req_count - firstObject.res_count
            const unres_b_2 = secondObject.req_count - secondObject.res_count
            if (unres_b_1 > 0 || unres_b_2 > 0){
              total_unres_b_1 += unres_b_1;
              total_unres_b_2 += unres_b_2;
              statusArray.push({...GetComparisonObject(compTypeKey, groupeKey, reqType, true),
                                total_of_label_b_1: Math.max(firstObject.req_count, firstObject.res_count) || 0,
                                total_of_label_b_2: Math.max(secondObject.req_count, secondObject.res_count) || 0,
                                sublabel: 'Unresolved',
                                browser1: unres_b_1, 
                                browser2: unres_b_2})
            }
            return acc.concat(statusArray);
  }, []), total_unres_b1: total_unres_b_1, total_unres_b2: total_unres_b_2}
}
/**
 * Function calculates the average of all the numbers in the array
 * 
 * @param {Number[]} numbers
 * @param {Number=} numOfdecimals amount of number after the decimal point, default 2
 * @returns {Number} 
 */
function GetAverage(numbers, numOfdecimals=2){
    return (GetSum(numbers)/numbers.length).toFixed(numOfdecimals);
}
/**
 * Function calculates the sum of all the numbers in the array
 * 
 * @param {Number[]} numbers
 * @param {Number}
 */
function GetSum(numbers){
  return numbers.reduce((acc, number) => {
              return acc+number
          }, 0)
}

module.exports = {  Sleep, 
                    GetTimeStampString,
                    ReduceNetworkData, 
                    GetIntersection, 
                    CreateNetwrokTypeArrayForComparisonReport,
                    GetWebsiteNameFromUrl,
                    GetUnion,
                    GetComparisonObject,
                    GetAverage};