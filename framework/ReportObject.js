const Report = require('fluentreports');
const { report_dir } = require('../data/global_parameters.json');
const { GetTimeStampString } = require('./AuxiliaryFunction');



class ReportObject{
    /**
     * returns ReportObject
     * 
     * @param {String} reportName report file name
     * @returns {ReportObject}
     */
    constructor(reportName){
        this.reportName = reportName;
        this.reportTitleHeader = "";
        this.reportPageHeader = [];
        this.reportFooter = "";
        this.reportDetailFunction = null;
        this.reportModule = new Report.Report(this._GetReportName()).margins(20)
    }
    /**
     * Fuction gets report name
     * 
     * Example: ./ReportDirectory/1992-01-06-14-30_Example.pdf
     * 
     */
    _GetReportName(){
        return `${report_dir}/${GetTimeStampString('yyyymmdd-HHMMss')}_${this.reportName}.pdf`
    }
    /**
     * Function creates a report using fluentreport module
     * 
     * @param {Object[]} data please take a look at fluentreport's api
     */
    CreateReport(data){ 
        this.reportModule
            .titleHeader(this.reportTitleHeader)
            .pageHeader(this.reportPageHeader)
            .pageFooter(this.reportFooter)        
            .data(data)
            .detail(this.reportDetailFunction)
            .render();  
    }
    /**
     * Function sets the report's title
     * 
     * @param {(String|Function|String[])} title please take a look at fluentreport's api
     */
    SetReportTitle(title){
        this.reportTitleHeader = title;
    }
    /**
     * 
     * Function sets each page's title
     * 
     * @param {String} title title to set 
     * @param {Number} pageNumber page number
     */
    SetPageTitle(title, pageNumber){
        this.reportPageHeader[pageNumber-1] = title
    }
    /**
     * 
     * Function sets the report's footer 
     * 
     * @param {(String|Function|String[])} title please take a look at fluentreport's api 
     */
    SetFooter(title){
        this.reportFooter = title;
    }
    /**
     * Function sets the report's detail function
     * 
     * @param {Function} callback please take a look at fluentreport's api 
     */
    SetDetailFunction(callback){
        this.reportDetailFunction = callback;
    }
    AddGrouping(groupKey, headerFunction=null, footerFunction=null){
        this.reportModule.groupBy(groupKey)
                        .header(headerFunction)
                        .footer(footerFunction)
    }
}

module.exports = ReportObject;