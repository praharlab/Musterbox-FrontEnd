import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  TOKEN = 'token';

  // countrymaster
  GETCOUNTRYDATA = 'countrymaster/v1/getalldata';

  // statemaster
  GETSTATEBYCOUNTRY = 'statemaster/v1/getbycountryid/';
  GETALLSTATE = 'statemaster/v1/getalldata';

  // citymaster
  GETCITYBYSTATE = 'citymaster/v1/getbgetCityBystateIdyid/';

  // professionataxmaster
  CREATEPT = 'professionataxmaster/v1/add';
  VIEWPT = 'professionataxmaster/v1/getbyid/';
  UPDATEPT = 'professionataxmaster/v1/updatebyid';
  getAllPT = 'professionataxmaster/v1/getalldata';
  DELETEPT = 'professionataxmaster/v1/deletebyid';
  PTSTATUSCHANGE = 'professionataxmaster/v1/statuschanges';

  // productmaster
  GETPRODUCTDATA = 'productmaster/v1/getalldata';
  CREATEPRODUCTDATA = 'productmaster/v1/add';
  VIEWPRODUCTDATA = 'productmaster/v1/getbyid/';
  UPDATEPRODUCTDATA = 'productmaster/v1/updatebyid';
  DELETEPRODUCTDATA = 'productmaster/v1/deletebyid';
  PRODUCTSTATUSCHANGES = 'productmaster/v1/statuschanges';

  // branchmaster
  GETBRANCH = 'branchmaster/v1/getalldata'; //NOT USED
  getAllBranchDataByCompanyId = 'branchmaster/v1/getAllBranchDataByCompanyId';
  CREATEBRANCH = 'branchmaster/v1/add';
  UPDATEBRANCH = 'branchmaster/v1/updatebyid';
  DELETEBRANCH = 'branchmaster/v1/deletebyid';
  VIEWBRANCH = 'branchmaster/v1/getbyid/';
  BRANCHSTATUSCHANGE = 'branchmaster/v1/statuschange';
  BRANCHBYCOMPANYDATA1 = 'branchmaster/v1/getbycompanyid/';
  BRANCHBYCOMPANYDATA2 = 'branchmaster/v1/getactivebranchbycompanyid/';
  UPLOADEXCELBRANCH = 'branchmaster/v1/uploadexcel';
  VALIDATEBRANCHEXCEL = 'branchmaster/v1/validateExcel';
  REVALIDATEBRANCHDATA = 'branchmaster/v1/revalidateBranch';
  ADDVALIDATEBRANCH = 'branchmaster/v1/addValidateBranch';
  GENERATEBRANCHDEMOEXCEL = 'branchmaster/v1/generateDemoExcel';

  // bankmaster
  GETBANKDATA = 'bankmaster/v1/getalldata';
  CREATEBANK = 'bankmaster/v1/add';
  UPDATEBANK = 'bankmaster/v1/updatebyid';
  DELETEBANK = 'bankmaster/v1/deletebyid';
  VIEWBANK = 'bankmaster/v1/getbyid/';
  BANKSTATUSCHANGES = 'bankmaster/v1/statuschange';

  // companymaster
  GETCOMPANYDATA = 'companymaster/v1/getalldata';
  GETALLCOMPANYBYID = 'companymaster/v1/getCompanyById';
  getCompanyByParentCompany = 'companymaster/v1/getCompanyByParentCompany';
  CREATECOMPANYDATA = 'companymaster/v1/add';
  UPDATEOMPANYDATA = 'companymaster/v1/updatebyid';
  DELETEOMPANYDATA = 'companymaster/v1/deletebyid';
  VIEWCOMPANYDATA = 'companymaster/v1/getbyid/';
  COMPANYSTATUSCHANGE = 'companymaster/v1/statuschange';
  DASHBOARDDATA = 'companymaster/v1/superadmin_dashboard';
  getCompanyByParentCompany2 = 'companymaster/v1/getCompanyByParentCompany2';
  GETCOMPANYANALYTICSDATA = 'companymaster/v1/getCompanyAnalyticsData';
  GETCOMPANYDATASUBADMIN = 'companymaster/v1/getCompanyDataSubAdmin';
  UPDATECUSTOMERPREFERENCE = 'companymaster/v1/postUpdateCustomerPreference';
  GETCOMPANYSUBSCRIPTIONPLANANALYTICSDATA =
    'companymaster/v1/getCompanySubscriptionPlanAnalyticsData';
  GETCOMPANYSUBSCRIPTIONPLANANALYTICSDATAPRODUCTWISE =
    'companymaster/v1/getCompanySubscriptionPlanAnalyticsDataProductWise';
  LISTCOMPANYSUBSCRIPTIONPLANANALYTICSDATA =
    'companymaster/v1/listCompanySubscriptionPlanAnalyticsData';
  GETCOMPANYTREE = 'companymaster/v1/getCompanyTree';
  GETUSER = 'companymaster/v1/getUser';
  getCompanyByParentCompany3 = 'companymaster/v1/getCompanyByParentCompany3';
  REMOVECOMPANYLOGOANDAUTHSIGN = 'companymaster/v1/removeCompanyLogoAndAuthSign';
  GETCOMPANYDATAV2 = 'companymaster/v2/getalldata';

  // companytype
  GETCOMPANYTYPEDATA = 'companytype/v1/getalldata';
  GETACTIVECOMPANYTYPEDATA = 'companytype/v1/getActiveCompanyType';
  CREATECOMPANYTYPEDATA = 'companytype/v1/add';
  UPDATECOMPANYTYPEDATA = 'companytype/v1/updatebyid';
  DELETEOMPANYTYPEDATA = 'companytype/v1/deletebyid';
  VIEWCOMPANYTYPEDATA = 'companytype/v1/getbyid/';
  COMPANYSTATUSCHANGES = 'companytype/v1/statuschanges';

  // professionaltaxsetup
  GETPROFESSIONAL = 'professionaltaxsetup/v1/getalldatapt';
  PTADD = 'professionaltaxsetup/v1/add';
  PTGET = 'professionaltaxsetup/v1/getbyid/';

  // esicsetup
  GETESIC = 'esicsetup/v1/getalldatapt';
  ESICGET = 'esicsetup/v1/getbyid/';
  ESICADD = 'esicsetup/v1/add';

  // formmaster
  CREATEFORM = 'formmaster/v1/add';
  GETPARENTFORM = 'formmaster/v1/getparentformdata';
  GETFORMDATA = 'formmaster/v1/getalldata';
  DELETEFORM = 'formmaster/v1/deletebyid';
  FORMSTATUSCHANGES = 'formmaster/v1/statuschanges';
  VIEWFORM = 'formmaster/v1/getbyid/';
  UPDATEFORM = 'formmaster/v1/updatebyid';
  VIEWFORMDATA = 'formmaster/v1/getforms';
  Menulist = 'formmaster/v1/getmenulist'; //NOT USED

  // hrsalaryfields
  GETHRSALARYFIELSBYID = 'hrsalaryfields/v1/getbyidactive/';
  GETCOMPANYPAYHEAD = 'hrsalaryfields/v1/getcompanypayhead';
  GETINDEX = 'hrsalaryfields/v1/getindex';
  GETHRSALARYFIELSBYID1 = 'hrsalaryfields/v1/getbyid/';
  CREATEHRFIELDS = 'hrsalaryfields/v1/add';
  UPDATEHRFIELDS = 'hrsalaryfields/v1/updatebyid';
  DELETEHRFIELD = 'hrsalaryfields/v1/deletebyid';
  HRFIELDSSTATUSCHANGE = 'hrsalaryfields/v1/statuschanges';
  GETHRFIELD = 'hrsalaryfields/v1/getbycompanyid';
  GETGRADEFORDRPDOWN = 'hrsalaryfields/v1/getbycompanyidfordropdown';

  // useraddress
  GETUSERADDRESS = 'useraddress/v1/getbyuserid/';
  CREATEUSERADDRESSDATA = 'useraddress/v1/add';
  UPDATEUSERADDRESSDATA = 'useraddress/v1/updatebyid';
  DELETEUSERADDRESSDATA = 'useraddress/v1/deletebyid';
  USERADDRESSDATASTATUSCHANGE = 'useraddress/v1/statuschanges';
  USERADDRESSVERIFYREQ = 'useraddress/v1/verifyreq';
  GETUSERADDRESSBYID = 'useraddress//v1/getbyid/';

  // userexperience
  GETUSEREXPRIANCE = 'userexperience/v1/getbyuserid/';
  CREATEUSEREXPERIENCE = 'userexperience/v1/add';
  UPDATEUSEREXPERIENC = 'userexperience/v1/updatebyid';
  DELETEUSEREXPERIENCE = 'userexperience/v1/deletebyid';
  EXPERIENCESTATUSCHANGE = 'userexperience/v1/statuschanges';
  EXPERIENCEVERIFYREQ = 'userexperience/v1/verifyreq';
  GETUSEREXPERIENCEBYID = 'userexperience/v1/getbyid/';

  // usereducation
  GETUSEREDUCATION = 'usereducation/v1/getbyuserid/';
  CREATEUSEREDUCATION = 'usereducation/v1/add';
  UPDATEUSEREDUCATION = 'usereducation/v1/updatebyid';
  DELETEUSEREDUCATION = 'usereducation/v1/deletebyid';
  EDUCATIONSTATUSCHANGE = 'usereducation/v1/statuschanges';
  EDUCATIONVERIFYREQ = 'usereducation/v1/verifyreq';
  GETUSEREDUCATIONBYID = 'usereducation/v1/getbyid/';

  // shift
  GETSHIFTDATA = 'shift/v1/getbycompanyid';
  CREATESHIFT = 'shift/v1/add';
  UPDATESHIFT = 'shift/v1/updatebyid';
  DELETESHIFT = 'shift/v1/deletebyid';
  VIEWSHIFT = 'shift/v1/getbyid/';
  SHIFTTATUSCHANGES = 'shift/v1/statuschanges';
  SHIFTBYCOMPANYDATA2 = 'shift/v1/getactiveshiftbycompanyid/';
  GETATTENDANCETRANS = 'shift/v1/getPaneltyData';
  REMOVEPENALTY = 'shift/v1/removePaneltyData';

  // documentlist
  GETDOCUMENTDATA = 'documentlist/v1/getalldata';
  CREATEDOCUMENT = 'documentlist/v1/add';
  UPDATEDOCUMENT = 'documentlist/v1/updatebyid';
  DELETEDOCUMENT = 'documentlist/v1/deletebyid';
  VIEWDOCUMENT = 'documentlist/v1/getbyid/';
  DOCUMENTSTATUSCHANGES = 'documentlist/v1/statuschanges';

  // userdocument
  GETUSERDOCUMENT = 'userdocument/v1/getbyuserid/';
  CREATEUSERDOCUMENT = 'userdocument/v1/add';
  UPDATEUSERDOCUMENT = 'userdocument/v1/updatebyid';
  DELETEUSERDocument = 'userdocument/v1/deletebyid';
  DocumentTATUSCHANGE = 'userdocument/v1/statuschanges';
  DOCVERIFYREQ = 'userdocument/v1/verifyreq';
  GETUSERDOCUMENTBYID = 'userdocument/v1/getbyid/';
  USEREXPIRYDOCUMENT = 'userdocument/v1/UserExpiryDocument';

  // gradestructure
  CREATEGRADE = 'gradestructure/v1/add';
  UPDATEGRADE = 'gradestructure/v1/updatebyid';
  DELETEGRADE = 'gradestructure/v1/deletebyid';
  GRADESTATUSCHANGE = 'gradestructure/v1/statuschanges';
  VIEWGrade = 'gradestructure/v1/getbyid/';
  GETGRADE = 'gradestructure/v1/getbycompanyid';
  GETGRADEDATA = 'gradestructure/v1/getcompany/';
  getptvaluebycompanystate = 'gradestructure/v1/getptvaluebycompanystate';
  GETSALARYBYGRADE = 'gradestructure/v1/getctcvalue';
  CHANGESALARYBYGRADE = 'gradestructure/v1/getctcvalue1';
  GETGRADEFORASSIGNSTRUCTURE = 'gradestructure/v1/getGradeForAssignStructure';

  //userskills
  GETUSERSKILL = 'userskills/v1/getbyuserid/';
  CREATEUSERSKILL = 'userskills/v1/add';
  UPDATEUSERSKILL = 'userskills/v1/updatebyid';
  DELETEUSERSKILL = 'userskills/v1/deletebyid';
  SKILLSTATUSCHANGE = 'userskills/v1/statuschanges';

  //reportto
  CREATEREPORTSTO = 'reportto/v1/add';
  VIEWREPORT = 'reportto/v1/getbyid/';
  GETREPORTINGEMPLOYEE = 'reportto/v1/getreportingemployees/';
  REPLACEANDDELETEREPORTTO = 'reportto/v1/updateallreportid';

  //empdepartment
  GETEMPLOYEEDEPARTMENT = 'empdepartment/v1/getbyuserid/';
  CREATEEMPLOYEEDEPARTMENT = 'empdepartment/v1/add';
  CREATEEMPLOYEEDEPARTMENT1 = 'empdepartment/v1/addbulk';
  UPDATEEMPLOYEEDEPARTMENT = 'empdepartment/v1/updatebyid';
  DELETEEMPLOYEEDEPARTMENT = 'empdepartment/v1/deletebyid';
  EMPLOYEEDEPARTMENTSTATUSCHANGE = 'empdepartment/v1/statuschanges';
  GETALLEMPLOYEEDEPARTMENT = 'empdepartment/v1/getEmployeeDepartment';
  GETCURRENTDEPARTMENT = 'empdepartment/v1/getcurrentdepartment'; //NOT USED

  //empdesignation
  GETUSERDESSIGNATIONSELECTED = 'empdesignation/v1/getbyuseridselecteds/';
  CREATEEMPLOYEEDESIGNATION1 = 'empdesignation/v1/addbulk';
  GETEMPLOYEEDESIGNATION = 'empdesignation/v1/getbyuserid/';
  CREATEEMPLOYEEDESIGNATION = 'empdesignation/v1/add';
  UPDATEEMPLOYEEDESIGNATION = 'empdesignation/v1/updatebyid';
  DELETEEMPLOYEEDESIGNATION = 'empdesignation/v1/deletebyid';
  EMPLOYEEDESIGNATIONSTATUSCHANGE = 'empdesignation/v1/statuschanges';
  GETALLEMPLOYEEDESIGNATION = 'empdesignation/v1/getEmployeeDesignation';

  //empholidaypolicy
  CREATEEMPLOYEEHOLIDAY1 = 'empholidaypolicy/v1/addbulk';
  HOLDAYBYCOMPANYDATA = 'empholidaypolicy/v1/getbyuserid/';
  CREATEEMPLOYEEHOLIDAY = 'empholidaypolicy/v1/add';
  UPDATEEMPLOYEHOLIDAY = 'empholidaypolicy/v1/updatebyid';
  DELETEEMPLOYEEHOLIDAY = 'empholidaypolicy/v1/deletebyid';
  GETALLEMPLOYEEDHOLIDAYPOLICY = 'empholidaypolicy/v1/getEmployeeHoliday';

  //empbranch
  CREATEEMPLOYEEBRANCH1 = 'empbranch/v1/addbulk';
  GETEMPLOYEEBRANCH = 'empbranch/v1/getbyuserid/';
  CREATEEMPLOYEEBRANCH = 'empbranch/v1/add';
  UPDATEEMPLOYEEBRANCH = 'empbranch/v1/updatebyid';
  DELETEEMPLOYEEBRANCH = 'empbranch/v1/deletebyid';
  EMPLOYEEBRANCHSTATUSCHANGE = 'empbranch/v1/statuschanges';
  GETALLEMPLOYEEBRANCH = 'empbranch/v1/getEmployeeBranch';
  GETCURRENTBRANCH = 'empbranch/v1/getcurrentbranch';

  //weekoffpolicy
  CREATEweekoffpolicy = 'weekoffpolicy/v1/add';
  GETWEEKOFBYCOMPANY = 'weekoffpolicy/v1/getbycompanyid';
  VIEWWEEKOFF = 'weekoffpolicy/v1/getbyid/';
  UPDATEWORKPOLICY = 'weekoffpolicy/v1/updatebyid';
  DELETWEEKOFF = 'weekoffpolicy/v1/deletebyid';
  WEEKOFFSTATUSCHANGES = 'weekoffpolicy/v1/statuschanges';
  WEEKOFFBYCOMPANYDATA2 = 'weekoffpolicy/v1/getactiveweekoffbycompanyid/';
  GETWEEKOFBYCOMPANY1 = 'weekoffpolicy/v1/getalldata';

  //holidayspolicy
  CREATEHOLIDAYPOLICY = 'holidayspolicy/v1/add';
  VIEWHOLIDAYPOLICY = 'holidayspolicy/v1/getbyid/';
  UPDATEHOLIDAYPOLICY = 'holidayspolicy/v1/updatebyid';
  GETHOLIDAYBYCOMPANY = 'holidayspolicy/v1/getalldata';
  DELETHOLIDAY = 'holidayspolicy/v1/deletebyid';
  HOLIDAYSTATUSCHANGES = 'holidayspolicy/v1/statuschanges';
  HOLIDAYBYCOMPANYDATA2 = 'holidayspolicy/v1/getactiveholidaypolicybycompanyid/';

  // empweekoff
  CREATEEMPLOYEEWEEKOFF1 = 'empweekoff/v1/addbulk';
  WEEKOFFBYCOMPANYDATA = 'empweekoff/v1/getbyuserid/';
  CREATEEMPLOYEEWEEKOFF = 'empweekoff/v1/add';
  UPDATEEMPLOYEEWEEKOFF = 'empweekoff/v1/updatebyid';
  DELETEEMPLOYEEWEEKOFF = 'empweekoff/v1/deletebyid';
  EMPLOYEEWEEKOFFSTATUSCHANGE = 'empweekoff/v1/statuschanges';
  GETALLEMPLOYEEDWEEKOFPOLICY = 'empweekoff/v1/getEmployeeWeekoff';

  //customer
  CREATECUSTOMER = 'customer/v1/add';
  VIEWCUSTOMER = 'customer/v1/getbyid/';
  UPDATECUSTOMER = 'customer/v1/updatebyid';
  getAllCUSTOMERDataByCompanyId = 'customer/v1/getbycompanyid';
  DELETECUSTOMER = 'customer/v1/deletebyid';
  CUSTOMERSTATUSCHANGE = 'customer/v1/statuschanges';
  UPLOADEXCELCUSTOMER = 'customer/v1/uploadexcel';
  GETCUSTOMERBYCOMPANY = 'customer/v1/getalldata';
  GETALLINDIACITY = 'customer/v1/getAllIndiaCityList';
  VALIDATECUSTOMEREXCEL = 'customer/v1/validateExcel';
  REVALIDATECUSTOMERDATA = 'customer/v1/revalidateCustomer';
  ADDVALIDATECUSTOMER = 'customer/v1/addValidateCustomer';
  GENERATECUSTOMERDEMOEXCEL = 'customer/v1/generateDemoExcel';

  // visitpurpose
  CREATEVISITPURPOSE = 'visitpurpose/v1/add';
  GETVISITPURPOSEDATA = 'visitpurpose/v1/getalldata';
  UPDATEVISITPURPOSEDATA = 'visitpurpose/v1/updatebyid';
  DELETEVISITPURPOSEDATA = 'visitpurpose/v1/deletebyid';
  VISITPURPOSEDATASTATUSCHANGES = 'visitpurpose/v1/statuschanges';
  VIEWVISITPURPOSEDATA = 'visitpurpose/v1/getbyid/';
  VISITPURPOSEBYCOMPANYDATA = 'visitpurpose/v1/getbycompanyid';
  UPLOADVISITPURPOSEEXCEL = 'visitpurpose/v1/uploadexcel';
  VALIDATEVISITPURPOSEEXCEL = 'visitpurpose/v1/validateExcel';
  REVALIDATEVISITPURPOSEDATA = 'visitpurpose/v1/reValidateVisitPurpose';
  ADDVALIDATEVISITPURPOSEDATA = 'visitpurpose/v1/addValidateVisitPurpose';

  //hrLeaveBal
  CREATELEAVEBAL = 'hrLeaveBal/v1/add'; //NOT USED
  GETLEAVEBAL = 'hrLeaveBal/v1/user';
  UPDATELEAVEBAL = 'hrLeaveBal/v1/update';
  ADDLEAVEBALANCE = 'hrLeaveBal/v1/addLeaveBalance';
  GETLEAVEBALANCEADDED = 'hrLeaveBal/v1/getLeavesAddedById/';
  EXPORTLEAVEOPENINGBALANCE = 'hrLeaveBal/v1/exportLeaveOpeningBalance';
  VALIDATELEAVEOPENINGBALANCE = 'hrLeaveBal/v1/validateExcel';
  ADDLEAVEOPENINGBALANCE = 'hrLeaveBal/v1/addLeaveOpeningBalance';
  GETADDEDLEAVEBALANCEBYUSER = 'hrLeaveBal/v1/getAddedLeaveBalanceByUser';

  //product
  CREATESIMPLEPRODUCTDATA = 'product/v1/add';
  GETSIMPLEPRODUCTDATA = 'product/v1/getalldata';
  UPDATESIMPLEPRODUCTDATA = 'product/v1/updatebyid';
  DELETESIMPLEPRODUCTDATA = 'product/v1/deletebyid';
  SIMPLEPRODUCTDATASTATUSCHANGES = 'product/v1/statuschanges';
  VIEWSIMPLEPRODUCTDATA = 'product/v1/getbyid/';
  GETSIMPLEPRODUCTDATABYCOMPANY = 'product/v1/getbycompanyid';
  GETALLPRODUCTBYPARENTCHILD = 'product/v1/getallbyparent/';
  UPLOADPRODUCTEXCEL = 'product/v1/uploadexcel';
  VALIDATEPRODUCTEXCEL = 'product/v1/validateExcel';
  REVALIDATEPRODUCTDATA = 'product/v1/reValidateProduct';
  ADDVALIDATEPRODUCT = 'product/v1/addValidateProduct';

  //visit
  CREATEVISIT = 'visit/v1/add';
  VIEWVISITBYASSIGN = 'visit/v1/getVisitByAssignID/';
  UPDATEVISIT = 'visit/v1/updatebyid';
  VIEWVISIT = 'visit/v1/getbyid/';
  GETVISITBYCOMPID = 'visit/v1/getbycompanyid';
  DELETEVISIT = 'visit/v1/deletebyid';
  VISITSTATUSCHANGES = 'visit/v1/statuschanges';
  GETVISITBYCOMPANY = 'visit/v1/VisitByCompanyId';
  MyTeamList = 'visit/v1/Team_Visit';
  GETVISITBYUSERID = 'visit/v1/getVisitByUserID';

  //gradesalarystructure
  GETGRADESALARYSTRUCTUREBYGRADEID = 'gradesalarystructure/v1/getsalarystructuredataBygradeId';

  //hrsalaryfieldchild
  FIELDEFFECT = 'hrsalaryfieldchild/v1/salaryfieldbyeffected/'; //NOT USED

  //compdoctype
  GETCOMPDOCUMENTDATA = 'compdoctype/v1/getalldata';
  DELETECOMPDOCUMENT = 'compdoctype/v1/deletebyid';
  COMPDOCUMENTSTATUSCHANGES = 'compdoctype/v1/statuschanges';
  VIEWCOMPDOCUMENT = 'compdoctype/v1/getbyid/';
  UPDATECOMPDOCUMENT = 'compdoctype/v1/updatebyid';
  CREATECOMPDOCUMENT = 'compdoctype/v1/add';

  //compdoc
  GETUSERCOMPDOCUMENT = 'compdoc/v1/getbyuserid/';
  CREATEUSERCOMPDOCUMENT = 'compdoc/v1/add';
  UPDATEUSERCOMPDOCUMENT = 'compdoc/v1/updatebyid';
  DELETEUSERCOMPDocument = 'compdoc/v1/deletebyid';
  COMPDocumentTATUSCHANGE = 'compdoc/v1/statuschanges';

  //announcement
  CREATEANNOUNCEMENT = 'announcement/v1/add';
  VIEWANNOUNCEMENT = 'announcement/v1/getbyid/';
  UPDATEANNOUNCEMENT = 'announcement/v1/updatebyid';
  GETANNOUNCEMENTBYCOMPID = 'announcement/v1/getbycompanyid';
  DELETEANNOUNCEMENT = 'announcement/v1/deletebyid';
  ANNOUNCEMENTSTATUSCHANGES = 'announcement/v1/statuschanges';
  GETNOTIFICATION = 'announcement/v1/getbyuserId';
  GETNOTIFICATIONCOUNT = 'announcement/v1/countUnreadAnnouncement';

  //empdigitalsign
  GETALLDIGITALSIGNATURE = 'empdigitalsign/v1/getbyuserid/';
  GETALLDIGITALS = 'empdigitalsign/v1/getbyuserids/'; //NOT USED
  CREATEDIGITALSIGNATURE = 'empdigitalsign/v1/add';
  UPDATEDIGITALSIGNATURE = 'empdigitalsign/v1/updatebyid';
  DIGITALSIGNATURETATUSCHANGE = 'empdigitalsign/v1/statuschanges';
  DELETEDIGITALSIGNATURE = 'empdigitalsign/v1/deletebyid';

  //usertracking
  GETCHECKTRACKING = 'usertracking/v1/check';
  CREATEEMPLOYEETRACKING = 'usertracking/v1/add';
  GETTRACKINGDATA = 'usertracking/v1/getbycompanyid';
  TRACKDISABLE = 'usertracking/v1/disable';
  UPDATEDEMPTRACKINGDATA = 'usertracking/v1/updatebyid';
  EDITEMPTRACKING = 'usertracking/v1/getbyid';

  //assetcategory
  GETASSETCATEGORYDATA1 = 'assetcategory/v1/getactiveassetcategorybycompanyid/';
  CREATEASSETCATEGORYDATA = 'assetcategory/v1/add';
  VIEWASSETCATEGORYDATA = 'assetcategory/v1/getbyid/';
  ASSETCATEGORYBYCOMPANYDATA = 'assetcategory/v1/getbycompanyid';
  UPDATEASSETCATEGORYDATA = 'assetcategory/v1/updatebyid';
  DELETEASSETCATEGORYDATA = 'assetcategory/v1/deletebyid';
  ASSETCATEGORYSTATUSCHANGES = 'assetcategory/v1/statuschanges';
  ASSETCATBYCOMPANY = 'assetcategory/v1/getbycompanyid';
  GETALLASSETDATA = 'assetcategory/v1/getalldata'; //NOT USED
  UPLOADASSETDATAEXCEL = 'assetcategory/v1/uploadAssetExcel';
  VALIDATEASSETCATEGORYEXCEL = 'assetcategory/v1/validateExcel';
  REVALIDATEASSETCATEGORYDATA = 'assetcategory/v1/reValidateAssetCategory';
  ADDVALIDATEASSETCATEGORY = 'assetcategory/v1/addValidateAssetCategory';

  //penalty
  GETPENALTYDATA1 = 'penalty/v1/getactivepenaltybycompanyid/';
  GETPENALTYBYID = 'penalty/v1/getbyid/';
  CREATEPENALTYDATA = 'penalty/v1/add';
  VIEWPENALTYDATA = 'penalty/v1/getbyid/';
  PENALTYBYCOMPANYDATA = 'penalty/v1/getbycompanyid/';
  UPDATEPENALTYDATA = 'penalty/v1/updatebyid';
  DELETEPENALTYDATA = 'penalty/v1/deletebyid';
  PENALTYSTATUSCHANGES = 'penalty/v1/statuschanges';

  //letterhead
  LETTERGET = 'letterhead/v1/getbycompanyid/';
  LETTERADD = 'letterhead/v1/add';

  // assignasset
  DELETEASSET = 'assignasset/v1/deletebyid';
  ASSETSTATUSCHANGE = 'assignasset/v1/statuschanges';
  CREATEEMPLOYEEASSIGN = 'assignasset/v1/add';
  UPDATEEMPLOYEEASSIGN = 'assignasset/v1/updatebyid';
  RETURNEMPLOYEEASSIGN = 'assignasset/v1/return';
  GETALLassignasset = 'assignasset/v1/getalldata';
  GETBYASSETCATEGORYID = 'assignasset/v1/GetbyAssetCategoryID';
  GETASSIGNASSETBYID = 'assignasset/v1/getbyid/';
  GETEMPLOYEEASSET = 'assignasset/v1/getbyUserID';
  UPLOADASSET = 'assignasset/v1/uploadExcel';
  EXPORTEMPLOYEEASSET = 'assignasset/v1/generateDemoExcel';

  //common
  commonview = 'common/v1/getview';

  //function
  commonfun = 'function/v1';

  //emppenalty
  CREATEPENALTY = 'emppenalty/v1/add';
  UPDATEEMPLOYEEPENALTY = 'emppenalty/v1/updatebyid';
  DELETEEMPLOYEEPENALTY = 'emppenalty/v1/deletebyid';
  EMPLOYEEDPENALTYSTATUSCHANGE = 'emppenalty/v1/statuschanges';
  GETALLPENALTY = 'emppenalty/v1/getalldata';
  GETUSERPENALTY = 'emppenalty/v1/getbyuserid';
  GETEMPPENALTYBYID = 'emppenalty/v1/getbyid/';

  //companycontact
  GETCOMPANYCONTACTDATA = 'companycontact/v1/getalldata';
  GETCOMPANYCONTACTDATA2 = 'companycontact/v1/getallsuperadmin';
  GETCOMPANYCONTACTDATA1 = 'companycontact/v1/getbycompanyid';
  GETCOMPANYCONTACTDATA3 = 'companycontact/v1/getlist';
  GETCHECKUSERLIMIT = 'companycontact/v1/checkuser';
  GETCOMPANYCONTACTALLDATA = 'companycontact/v1/getlist';
  ADDCOMPANYCONTACTDATA = 'companycontact/v1/add';
  UPLOADEXCELCOMPANYCONTACT = 'companycontact/v1/uploadexcel';
  VIEWCOMPANYCONTACTDATA = 'companycontact/v1/getbyid/';
  UPDATECOMPANYCONTACTDATA = 'companycontact/v1/updatebyid';
  DELETEOMPANYCONTACTDATA = 'companycontact/v1/deletebyid';
  COMPANYCONTACTSTATUSCHANGE = 'companycontact/v1/statuschanges';
  FILTERUSER = 'companycontact/v1/filteruser';
  GETREMOVEUNIQUEID = 'companycontact/v1/removeuniqueid';
  GETBRANCHCONTACT = 'companycontact/v1/getAllCC'; //NOT USED
  GETALLCONTACT = 'companycontact/v1/getAllCC';
  GETALLUSER = 'companycontact/v1/getAllUser';
  GETBRANCHCONTACTBYDATE = 'companycontact/v1/getbranchcontactBydate';
  GETEMPLOYEEPOLICY = 'companycontact/v1/employeepolicy';
  DASHBOARDEMPSTATUS = 'companycontact/v1/dashboardempstatus/';
  GETCOMPANYCONTACTSUBADMINDATA = 'companycontact/v1/getallsubadmin';
  UPLOADUSEREXCEL = 'companycontact/v1/uploaduserExcel';
  EXPORTUSEREXCEL = 'companycontact/v1/exportuserExcel';
  GETUSERSBYDEPARTMENTDESIGNATION = 'companycontact/v1/getUserbyBranchDepartment';
  GETUSERBYCOMPANYANDDATERANGE = 'companycontact/v1/getUserbyCompanyandDateRange';
  GETUSERBYBRANCHANDDATERANGE = 'companycontact/v1/getUserByBranchandDateRange';
  EXPORTAUTH = 'companycontact/v1/ExportAuthorizationDetails';
  GETALLUSERS = 'companycontact/v1/getAllUsers';
  PROFILEPHOTO = 'companycontact/v1/lockstatus';
  EXPORTUSERSALLDATA = 'companycontact/v1/exportUsersAllData';
  GETDILLER = 'companycontact/v1/getalldiler';
  GETPROFILEPERCENTAGE = 'companycontact/v1/getProfilePercentage';
  REMOVEPROFILEIMAGE = 'companycontact/v1/removeProfilePhoto';
  VIEWEMPLOYEESTATUS = 'companycontact/v1/getEmployeeSatus';
  VALIDATEAUTH = 'companycontact/v1/validatUploadAuthorizationDetails';
  EXPORTAUTHNEW = 'companycontact/v1/ExportAuthorizationDetailsNEW';
  ADDUPDATEAUTHORIZATION = 'companycontact/v1/addUpdateAuthorization';

  //subscription
  GETSUBSCRIPTIONDATA = 'subscription/v1/getalldata';
  CREATESUBSCRIPTIONDATA = 'subscription/v1/add';
  VIEWSUBSCRIPTIONDATA = 'subscription/v1/getbyid/';
  UPDATECOMPANYSUBSCRIPTION = 'subscription/v1/updatebyid';
  DELETESUBSCRIPTION = 'subscription/v1/deletebyid';
  SUBSCRIPTIONTATUSCHANGES = 'subscription/v1/statuschanges';
  CHECKSUBSCRIPTIONPLANEXPIRATION = 'subscription/v1/getSubscriptionPlanExpiration';

  //companyregister
  GETCOMPANYREGISTERDATA = 'companyregister/v1/getalldata';
  CREATECOMPANYREGISTERDATA = 'companyregister/v1/add';
  VIEWCOMPANYREGISTERDATA = 'companyregister/v1/getbyid/';
  UPDATECOMPANYREGISTERDATA = 'companyregister/v1/updatebyid';
  DELETECOMPANYREGISTERDATA = 'companyregister/v1/deletebyid';
  COMPANYREGISTERSTATUSCHANGES = 'companyregister/v1/statuschanges';

  //designation
  DESIGNATIONBYCOMPANYDATA1 = 'designation/v1/getDesignationByCompanyId/';
  DESIGNATIONBYCOMPANYDATA = 'designation/v1/getDesignationcompanyid/';
  GETDESIGNATIONDATA = 'designation/v1/getalldata'; //not used
  CREATEDESIGNATIONDATA = 'designation/v1/add';
  VIEWDESIGNATIONDATA = 'designation/v1/getbyid/';
  UPDATEDESIGNATIONDATA = 'designation/v1/updatebyid';
  DELETEDESIGNATIONDATA = 'designation/v1/deletebyid';
  DESIGNATIONTATUSCHANGES = 'designation/v1/statuschanges';
  DESIGNATIONBYCOMPANYDATA2 = 'designation/v1/getactivedesignationbycompanyid/';
  UPLOADEXCELDESIGNATION = 'designation/v1/uploadexcel';
  VALIDATEDESIGNATIONEXCEL = 'designation/v1/validateExcel';
  REVALIDATEDESIGNATIONDATA = 'designation/v1/reValidateDesignation';
  ADDVALIDATEDDESIGNATION = 'designation/v1/addValidateDesignation';

  //department
  GETDEPARTMENTDATA = 'department/v1/getalldata'; //not used
  CREATEDEPARTMENTDATA = 'department/v1/add';
  VIEWDEPARTMENTDATA = 'department/v1/getbyid/';
  DEPARTMENTBYCOMPANYDATA = 'department/v1/getDepartmentcompanyid';
  DEPARTMENTBYCOMPANYDATA1 = 'department/v1/getDepartmentByCompanyId/';
  DEPARTMENTBYCOMPANYDATA2 = 'department/v1/getactivedepartmentbycompanyid/';
  UPDATEDEPARTMENTDATA = 'department/v1/updatebyid';
  DELETEDEPARTMENTDATA = 'department/v1/deletebyid';
  DEPARTMENTSTATUSCHANGES = 'department/v1/statuschanges';
  UPLOADEXCELDEPARTMENT = 'department/v1/uploadexcel';
  VALIDATEDEPARTMENTEXCEL = 'department/v1/validateExcel';
  REVALIDATEDEPARTMENTDATA = 'department/v1/reValidateDepartment';
  ADDVALIDATEDDEPARTMENT = 'department/v1/addValidateDepartment';

  //auth
  LOGIN = 'auth/v1/login';
  FORGOTPASS = 'auth/v1/forgot';
  RESETPASS = 'auth/v1/reset';
  CHANGEPASSWORD = 'auth/v1/changepassword';
  DASHBOARD1 = 'auth/v1/dashboard1';
  ADDFORM = 'auth/v1/allform/'; //NOT USED
  PROFILEINFO = 'auth/v1/profile/';
  GETPERMISSION = 'auth/v1/finalcheckpermission';
  ANNIVERSARY = 'auth/v1/work-anniversary/';
  RESETPASSWORD = 'auth/v1/resetpassword';
  BIRTHDATE = 'auth/v1/birthday';
  ANNIVERSARYDATE = 'auth/v1/anniversary';
  DESHBOARDCHECK = 'auth/v1/dashboardcheck';
  SEARCHUSERPAGES = 'auth/v1/user-pages';
  CHANGEPASSWORDMULTIPLEEMP = 'auth/v1/changepasswordMultipleEmp';
  FORGOTPASSOTPMARS = 'auth/v1/forgotpasswordOtpMARS';
  CHECKPASSWORDTOKENMARS = 'auth/v1/checkPasswordTokenMARS';

  //pfsetup
  GETPFL = 'pfsetup/v1/getalldatapt';
  PFGET = 'pfsetup/v1/getbyid/';
  PFADD = 'pfsetup/v1/add';

  //userfamily
  GETUSERFAMILY = 'userfamily/v1/getbyuserid/';
  CREATEUSERFAMILY = 'userfamily/v1/add';
  UPDATEUSERFAMILY = 'userfamily/v1/updatebyid';
  DELETEUSERFAMILY = 'userfamily/v1/deletebyid';
  FAMILYSTATUSCHANGE = 'userfamily/v1/statuschanges';
  POSTVERIFYREQ = 'userfamily/v1/verifyreq';
  GETUSERFAMILYBYID = 'userfamily/v1/getbyid/';

  //payhead
  GETALLPAYHEAD = 'payhead/v1/getalldata';
  CREATEPAYHEAD = 'payhead/v1/add';
  UPDATEPAYHEAD = 'payhead/v1/updatebyid';
  DELETEPAYHEAD = 'payhead/v1/deletebyid';
  PAYHEADSTATUSCHANGE = 'payhead/v1/statuschanges';
  GETPAYHEADBYID = 'payhead/v1/getbyid';

  //expensecategory
  CREATEEXPENSECATEGORYDATA = 'expensecategory/v1/add';
  VIEWEXPENSECATEGORYDATA = 'expensecategory/v1/getbyid/';
  EXPENSECATEGORYBYCOMPANYDATA = 'expensecategory/v1/getExpenseCategorycompanyid';
  EXPENSECATEGORYBYCOMPANYDATA1 = 'expensecategory/v1/getExpenseCategoryByCompanyId/';
  UPDATEEXPENSECATEGORYDATA = 'expensecategory/v1/updatebyid';
  DELETEEXPENSECATEGORYDATA = 'expensecategory/v1/deletebyid';
  EXPENSECATEGORYSTATUSCHANGES = 'expensecategory/v1/statuschanges';
  GETEXPENSECATEGORYDATA = 'expensecategory/v1/getalldata'; //NOT USED
  UPLOADEXPENSEEXCEL = 'expensecategory/v1/uploadexcel';
  VALIDATEEXPENCECATEGORYEXCEL = 'expensecategory/v1/validateExcel';
  REVALIDATEEXPENCECATEGORYDATA = 'expensecategory/v1/reValidateExpenceCategory';
  ADDVALIDATEDEXPENCECATEGORY = 'expensecategory/v1/addValidateExpenseCategory';

  //expensehead
  CREATEEXPENSEHEADDATA = 'expensehead/v1/add';
  VIEWEXPENSEHEADDATA = 'expensehead/v1/getbyid/';
  VIEWEXPENSEHEADDATABYCATEGORY = 'expensehead/v1/getactiveexpenseheadbycategoryid/';
  EXPENSEHEADBYCOMPANYDATA = 'expensehead/v1/getExpenseHeadcompanyid';
  UPDATEEXPENSEHEADDATA = 'expensehead/v1/updatebyid';
  DELETEEXPENSEHEADDATA = 'expensehead/v1/deletebyid';
  EXPENSEHEADSTATUSCHANGES = 'expensehead/v1/statuschanges';
  GETALLEXPENSEHEADDATA = 'expensehead/v1/getalldata'; //NOT USED
  UPLOADEXPENSEHEADEXCEL = 'expensehead/v1/uploadexcel';
  GETEXPENSECATEGORIES = 'expensehead/v1/excel1';
  VALIDATEEXPENSEHEADEXCEL = 'expensehead/v1/validateExcel';
  REVALIDATEEXPENSEHEADDATA = 'expensehead/v1/revalidateExpensehead';
  ADDVALIDATEEXPENSEHEAD = 'expensehead/v1/addValidateExpensehead';
  GENERATEEXPENSEHEADDEMOEXCEL = 'expensehead/v1/generateDemoExcel';

  //expenseprice
  GETEXPENSEPRICE = 'expenseprice/v1/getbyheadid/';
  GETEXPENSEPRICEBYHEAD = 'expenseprice/v1/getExpensePriceRuleByHeadid/';
  CREATEEXPENSEPRICE = 'expenseprice/v1/add';
  UPDATEEXPENSEPRICE = 'expenseprice/v1/updatebyid';
  DELETEEXPENSEPRICE = 'expenseprice/v1/deletebyid';

  //visitformcustomize
  CREATEVISITCUSTOMIZE = 'visitformcustomize/v1/add';
  GETVISITCUSTOMIZEBYCOMPANYID = 'visitformcustomize/v1/getbycompanyid';
  DELETEVISITCUSTOMIZEBYID = 'visitformcustomize/v1/deletebyid';
  VIEWVISITFORMCUSTOMIZEDATA = 'visitformcustomize/v1/getbyid/';
  UPDATEVISITCUSTOMIZE = 'visitformcustomize/v1/updatebyid';

  //visitformcustomizevalue
  CREATEVISITCUSTOMIZEFIELDVALUE = 'visitformcustomizevalue/v1/add';
  UPDATEVISITCUSTOMIZEFIELDVALUE = 'visitformcustomizevalue/v1/updatebyid';
  VIEWVISITFIELDCUSTOMIZE = 'visitformcustomizevalue/v1/getbyid/';
  CREATEVISITCUSTOMIZEFIELDVALUEWEB = 'visitformcustomizevalue/v1/webadd';
  UPDATEVISITCUSTOMIZEFIELDVALUEWEB = 'visitformcustomizevalue/v1/webupdatebyid';

  //hrleavetypes
  GETALLLeaveTYPES = 'hrleavetypes/v1/getalldata'; //NOT USED
  CREATELEAVETYPES = 'hrleavetypes/v1/add';
  UPDATELEAVETYPES = 'hrleavetypes/v1/updatebyid';
  DELETELEAVETYPES = 'hrleavetypes/v1/deletebyid';
  LEAVETYPESSTATUSCHANGE = 'hrleavetypes/v1/statuschanges';
  GETLEAVETYPESBYID = 'hrleavetypes/v1/getbyid';
  GETLEAVETYPEBYCOMPANY = 'hrleavetypes/v1/getdatabycompany';
  GETLEAVETYPEBYUSERCOMPANY = 'hrleavetypes/v1/getdatabyusercompany'; //NOT USED
  LISTLEAVETYPESWITHOUTOUTDOORDUTY = 'hrleavetypes/v1/getDataWithoutOutDuty/';
  LISTLEAVETYPEFORMANAGELEAVE = 'hrleavetypes/v1/listLeaveTypeForManageLeave';

  //operation
  CREATEOPERATION = 'operation/v1/add';
  VIEWOPERATION = 'operation/v1/getbyid/';
  UPDATEOPERATION = 'operation/v1/updatebyid';
  GETOPERATION = 'operation/v1/getalldata';
  DELETEOPERATION = 'operation/v1/deletebyid';
  OPERATIONSTATUSCHANGES = 'operation/v1/statuschanges';

  //hrSalaryMaster
  ADDSALARYSTRUCTURE = 'hrSalaryMaster/v1/add';
  GETBYIDALARYSTRUCTURE = 'hrSalaryMaster/v1/getbyid/';
  REMOVESALARYSTRUCTURE = 'hrSalaryMaster/v1/removeStructrureByid';
  DELETESALARYMASTER = 'hrSalaryMaster/v1/deleteSalaryMaster';
  GETALLSALARYSTRUCTUREBYUSERID = 'hrSalaryMaster/V1/';
  GETSALARYSTARUCTURENAME = 'hrSalaryMaster/v1/getSalaryStructure';

  //empJoining
  GETEMPJOININGDATA = 'empJoining/v1/getbyuserid';
  GETASSIGNBIOMETRICCODEFORUSER = 'empJoining/v1/getAssignedBiometricUserList';
  CREATEJOININGDATA = 'empJoining/v1/add';
  UPDATEJOININGDATA = 'empJoining/v1/updatebyid'; //NOT USED
  GETEMPLOYEELIST = 'empJoining/v1/getEMPList';
  ADDPANPHOTO = 'empJoining/v1/addpanphoto'; //NOT USED
  IDCARDDETAILS = 'empJoining/v1/employeeIdCard';
  PROFILESTATUS = 'empJoining/v1/profileStatus';

  //authorizationCriteriaMasterRoutes
  AUTHORIAZATIONALLDATA = 'authorizationCriteriaMasterRoutes/v1/getalldata';

  //formAuthorizationDetails
  CREATEFORMAUTHORIZATION = 'formAuthorizationDetails/v1/add';
  GETFORMAUTHORIZATION = 'formAuthorizationDetails/v1/getalldata';
  DELETEFORMAUTHORIZATION = 'formAuthorizationDetails/v1/deletebyid';
  FORMAUTHORIZATIONSTATUSCHANGE = 'formAuthorizationDetails/v1/statuschanges';
  FORMAUTHORIZATIONGETBYID = 'formAuthorizationDetails/v1/getbyid/';
  UPDATEFORMAUTHORIZATION = 'formAuthorizationDetails/v1/updatebyid';

  //leaveMaster
  GETALLLEAVEMASTER = 'leaveMaster/v1/getalldata';
  CREATELEAVEMASTER = 'leaveMaster/v1/add';
  UPDATELEAVEMASTER = 'leaveMaster/v1/updatebyid';
  DELETELEAVEMASTER = 'leaveMaster/v1/deletebyid';
  LEAVEMASTERSTATUSCHANGE = 'leaveMaster/v1/statuschanges';
  GETLEAVEMASTERBYID = 'leaveMaster/v1/getbyid';

  //visitReportMaster
  CREATEVISITREPORTMASTER = 'visitReportMaster/v1/add';
  UPDATEVISITREPORTMASTER = 'visitReportMaster/v1/updatebyid';
  VIEWVISITREPORTMASTER = 'visitReportMaster/v1/getbyid/';
  VISITREPORTMASTERBYCOMPANYDATA = 'visitReportMaster/v1/getalldatabycompanyid';
  VISITREPORTMASTERBYCOMPANY = 'visitReportMaster/v1/getbycompany/';
  DELETEVISITREPORTMASTER = 'visitReportMaster/v1/deletebyid';
  VISITREPORTMASTERSTATUSCHANGES = 'visitReportMaster/v1/statuschanges';

  //hrleavesmonthlytrans
  CREATEHRMONTHLYTRANS = 'hrleavesmonthlytrans/v1/add';
  GETATTENDANCEBAL = 'hrleavesmonthlytrans/v1/AttendanceBal';
  UPDATELEAVETRANS = 'hrleavesmonthlytrans/v1/updateTrans';
  GETEMPBASICDETAILS = 'hrleavesmonthlytrans/v1/empBasicData'; //nOT uSED
  DELETEATTENDANCETRAN = 'hrleavesmonthlytrans/v1/deleteattendance'; //not used
  GETATTENDANCEBALANCE = 'hrleavesmonthlytrans/v1/attendanceCalculation';
  GETATTENDANCEBALANCEBYUSERID = 'hrleavesmonthlytrans/v1/getAttendanceCalculationbyuserid';
  GETATTENDANCEVERIFIED = 'hrleavesmonthlytrans/v1/getVerifiedAllData';
  ATTENDANCEUNVERIFY = 'hrleavesmonthlytrans/v1/dataUnverify';
  ATTENDANCEVERIFYSINGLE_MULTIPLE = 'hrleavesmonthlytrans/v1/verifyAllAttendanceCalcution';
  ATTENDANCEUNVERIFY_MULTIPLE = 'hrleavesmonthlytrans/v1/unVerifyAllAttendanceCalcution';
  ATTENDANCEUNVERIFYALL = 'hrleavesmonthlytrans/v1/unVerifyAllAttendanceCalcution';
  GETMYATTENDANCESUMMARY = 'hrleavesmonthlytrans/v1/attendanceSummarybyuserid';
  GETCOUNTWISEATTENDANCEDATA = 'hrleavesmonthlytrans/v1/demoCountWiseAttendance';
  UPLOADCOUNTWISEATTENDANCE = 'hrleavesmonthlytrans/v1/uploadCountWiseAttendance';

  //visitReportCustomize
  CREATEVISITREPORTCUSTOMIZE = 'visitReportCustomize/v1/add';
  DELETEVISITREPORTCUSTOMIZEBYID = 'visitReportCustomize/v1/deletebyid';
  GETVISITREPORTCUSTOMIZEBYCOMPANYID = 'visitReportCustomize/v1/getbycompanyid';
  VIEWVISITREPORTFORMCUSTOMIZEDATA = 'visitReportCustomize/v1/getbyid/';
  UPDATEVISITREPORTCUSTOMIZE = 'visitReportCustomize/v1/updatebyid';

  //visitReportCustomizevalue
  CREATEVISITREPORTCUSTOMIZEFIELDVALUE = 'visitReportCustomizevalue/v1/add';
  VIEWVISITREPORTFIELDCUSTOMIZE = 'visitReportCustomizevalue/v1/getbyid/';

  //mailconfig
  CREATEMAILCONFIGDATA = 'mailconfig/v1/add';
  GETMAILCONFIGDATA = 'mailconfig/v1/getalldata';
  DELETEMAILCONFIGDATA = 'mailconfig/v1/deletebyid';
  MAILCONFIGSTATUSCHANGES = 'mailconfig/v1/statuschanges'; //NOT USED
  VIEWMAILCONFIG = 'mailconfig/v1/getbyid/';
  UPDATEMAILCONFIGDATA = 'mailconfig/v1/updatebyid';

  //preboarding
  CREATEPREBOARDING = 'preboarding/v1/add';
  PREBOARDINGGETBYID = 'preboarding/v1/getbyid/';
  UPDATEPREBOARDING = 'preboarding/v1/updatebyid';
  PREBOARDING_ONBOARD_STATUSCHANGE = 'preboarding/v1/onboardStatusChange';
  PREBOARDINGBYCOMPANYDATA = 'preboarding/v1/getbycompanyid/';
  PREBOARDINGFORMDOWNLOAD = 'preboarding/v1/preBoardingFormDownload';

  ADDPREBOARDINGMASTER = 'preboarding/v1/addPreboardingMaster';
  UPDATEPREBOARDINGMASTER = 'preboarding/v1/updatePreboardingMaster';
  DELETEPREBOARDINGMASTER = 'preboarding/v1/deletePreboardingMaster';
  GETPREBOARDINGMASTER = 'preboarding/v1/getPreboardingMaster';
  GENERATEOFFERLETTER = 'preboarding/v1/getPreboardingOfferLetter';
  UPDATEPREBOARDINGOFFERLETTER = 'preboarding/v1/updateOfferLetter';
  SENDEMAILFORACCEPTANCE = 'preboarding/v1/mailSendForAcceptance';
  SENDEMAILFORPREBORDINGDOCS = 'preboarding/v1/mailSendForPreBoardingDocs';

  //preboardingformcustomize
  GETPREBOARDINGCUSTOMIZEBYCOMPANYID = 'preboardingformcustomize/v1/getbycompanyid';
  GETPREBOARDINGCUSTOMIZEBYSECRECTKEY =
    'preboardingformcustomize/v1/getPreboardingFormCustomizeByCompanyBySecretKey';

  //preboardingformcustomizevalue
  VIEWPREBOARDINGCUSTOMIZE = 'preboardingformcustomizevalue/v1/getbyid/';

  //callfollowup
  CREATECALLFOLLOWUP = 'callfollowup/v1/add';
  UPDATECALLFOLLOWUP = 'callfollowup/v1/updatebyid';
  VIEWCALLFOLLOWUP = 'callfollowup/v1/getbyid/';
  getAllCALLFOLLOWUPDataByCompanyId = 'callfollowup/v1/getCallFollowupuserid';
  DELETECALLFOLLOWUP = 'callfollowup/v1/deletebyid';
  CALLFOLLOWUPSTATUSCHANGE = 'callfollowup/v1/statuschange';
  getAllCALLFOLLOWUPDataByVISITID = 'callfollowup/v1/getCallFollowupvisitid';

  //loanmaster
  CREATELOANMASTER = 'loanmaster/v1/add';
  UPDATELOANMASTER = 'loanmaster/v1/update';
  GETLOANBYCOMPANYID = 'loanmaster/v1/getLoanByCompanyId';
  GETLOANBYID = 'loanmaster/v1/getbyid/';
  DELETELOAN = 'loanmaster/v1/delete';
  ADDLOANADVANCE = 'loanmaster/v1/advanceLoan/create';
  LoanAdvanceBYID = 'loanmaster/v1/loanAdvance';
  GETUSERLOAN = 'loanmaster/v1/getLoanByUserId';
  LOANUSERREQUEST = 'loanmaster/v1/addrequest';
  LOANSTATUSREQUEST = 'loanmaster/v1/changestatusrequest';
  LOANDATASHOW = 'loanmaster/v1/loandatashow';

  //form16
  ADDFORM16 = 'form16/v1/add';
  GETFORM16 = 'form16/v1/getAll';
  DELETEFORM16 = 'form16/v1/delete';
  UPDATEFORM16 = 'form16/v1/update';
  GETPARENTFORM16 = 'form16/v1/getAllParent';
  GETCHILDFORM16 = 'form16/v1/getAllChildData';
  FORM16STATUSCHANGES = 'form16/v1/statuschange';
  GETFORM16BYID = 'form16/v1/getbyid/';

  //investmentdetails
  ADDEMPLOYEEINVESTMENT = 'investmentdetails/v1/add';
  GETALLEMPLOYEEINVESTMENT = 'investmentdetails/v1/getAll';
  DELETEEMPLOYEEINVESTMENT = 'investmentdetails/v1/delete';
  UPDATEEMPLOYEEINVESTMENT = 'investmentdetails/v1/update';
  GETBYIDEMPLOYEEINVESTMENT = 'investmentdetails/v1/getById/';
  EMPLOYEEINVESTMENTSTATUSCHANGE = 'investmentdetails/v1/statusChange';

  //tdsslabmaster
  ADDTDSSLAB = 'tdsslabmaster/v1/add';
  GETALLTDSSLAB = 'tdsslabmaster/v1/getAll';
  DELETETDSSLAB = 'tdsslabmaster/v1/delete';
  UPDATETDSSLAB = 'tdsslabmaster/v1/update';
  GETBYIDTDSSLAB = 'tdsslabmaster/v1/getById/';
  TDSSLABSTATUSCHANGE = 'tdsslabmaster/v1/poststatus';

  //taxchallanmaster
  GETALLTAXCHALLAN = 'taxchallanmaster/v1/getAll';
  GETBYIDTAXCHALLAN = 'taxchallanmaster/v1/getById/';
  GETBYIDTAXCHALLAN1 = 'taxchallanmaster/v1/getAllbyID';
  ADDTAXCHALLAN = 'taxchallanmaster/v1/add';
  DELETETAXCHALLAN = 'taxchallanmaster/v1/delete';
  UPDATETAXCHALLAN = 'taxchallanmaster/v1/update';
  TAXCHALLANSTATUSCHANGE = 'taxchallanmaster/v1/poststatus';

  //quartertaxchallan
  ADDQUATERTAXCHALLAN = 'quartertaxchallan/v1/add';
  GETALLQUATERTAXCHALLAN = 'quartertaxchallan/v1/getAll';
  DELETEQUATERTAXCHALLAN = 'quartertaxchallan/v1/delete';
  UPDATEQUATERTAXCHALLAN = 'quartertaxchallan/v1/update';
  GETBYIDQUATERTAXCHALLAN = 'quartertaxchallan/v1/getById/';
  QUATERTAXCHALLANSTATUSCHANGE = 'quartertaxchallan/v1/poststatus';

  //Tracking
  GETUSERTRACKINGDATA = 'Tracking/v1/getByUserId'; //not used
  GETUSERTRACKINGDATA1 = 'Tracking/v1/getUserTrackingInfoById';
  GETUSERTRACKINGINFO = 'Tracking/v1/getUserTrackingInfo';
  // GETUSERTRACKINGINFO = 'Tracking/v1/getUserTrackingInfoById';

  // Tracking Dashboard
  GETACTIVEUSERANDTRACKINGCOUNT = 'Tracking/v1/getActiveUserandTrackingUserCount';
  GETTRACKINGGEOFENCEWISEDATA = 'Tracking/v1/getTrackingGeoFenceWiseData';

  //toursMaster
  CREATETOUR = 'toursMaster/v1/insert_data';
  VIEWTOURDATA = 'toursMaster/v1/getbyid_data/';
  UPDATETOUR = 'toursMaster/v1/update_data';
  GETTOURDATA = 'toursMaster/v1/getbyuserid';
  DELETETOURDATA = 'toursMaster/v1/delete_data/';
  TOURSTATUSCHANGES = 'toursMaster/v1/status_change';
  GETTOURBYCOMPANY = 'toursMaster/v1/gettourdatabycompanyid';

  //appversion
  GETAPPVERSION = 'appversion/v1/getalldata';
  UPDATEAPPVERSION = 'appversion/v1/updatebyid';

  //preboardingrequest
  ADDPREBOARDINGREQUEST = 'preboardingrequest/v1/add';
  PREBOARDINGBYUSER = 'preboardingrequest/v1/getalldata';
  UPDATEPREBOARDINGREQUEST = 'preboardingrequest/v1/updatebyid';
  GETPREBOARDINGREQUESTBYPREBOARDINGID =
    'preboardingrequest/v1/getPreboardingRequestByPreboardingId/';

  //attendanceTransaction
  ATTENDANCEREPORTDATA = 'attendanceTransaction/v1/attendancereport/';
  GETOVERTIEBYUSERID = 'attendanceTransaction/v1/getovertimeuserwise/';
  GETBRANCHWISECOMPANY = 'attendanceTransaction/v1/branchwiseattendancereport';
  GETATTENDANCE = 'attendanceTransaction/v1/attendanceByUserid';
  ATTENDACEAPI = 'attendanceTransaction/v1/attendanceApi';
  GETATTENDANCELOGBYTRANSID = 'attendanceTransaction/v1/getAttendanceLogsByTrnsactionId/';
  DASHBOARDPUNCHINOUT = 'attendanceTransaction/v1/dashboardpunchinout';
  GETDATACALENDERMONTHWISE = 'attendanceTransaction/v1/getcalenderdatamonthwise';
  SHIFTUPDATE = 'attendanceTransaction/v1/shiftupdate';
  USERATTENDANCESUMMARY = 'attendanceTransaction/v1/userAttendanceSummary/';
  DASHBOARDPUNCHINOUTGRAPH = 'attendanceTransaction/v1/dashboardpunchinoutNEW';
  DASHBOARDMONTHLYATTENDACE = 'attendanceTransaction/v1/dashboardattendanceNEW';
  DASHBOARDMISSPUNCHREPORT = 'attendanceTransaction/v1/dashboardMisspunchReport';
  LATEINEARLYGOREPORT = 'attendanceTransaction/v1/LateComeEarlyGo';
  GENERATELEAVEEXCEL = 'attendanceTransaction/v1/getLeaveExcel';
  ATTENDANCEREPORT = 'attendanceTransaction/v1/AttendanceReportMain';
  GETDAILYHOURLYREPORT = 'attendanceTransaction/v1/getDailyHourlyReport';
  PERDAYCOSTREPORT = 'attendanceTransaction/v1/getPerDayCostDepartmentWise';
  TOTALPUNCHIN = 'attendanceTransaction/v1/totalPunchIn';
  TOTALPUNCHIN1 = 'attendanceTransaction/v1/totalpunchIn1';
  ATTENDACESTATUS_V2 = 'attendanceTransaction/v2/attendancestatus';
  GETUSERATTENDANCELOGDATEWISE = 'attendanceTransaction/v1/getUserLogDateWise';
  ATTENDANCETIMING = 'attendanceTransaction/v1/attendanceTimingReport';
  ADDLCEGMANUALLYPENALTY = 'attendanceTransaction/v1/addLCEGPenalty';
  DELTELCEGMANUALLYPENALTY = 'attendanceTransaction/v1/deleteLCEGPenalty';
  //advancePayment
  CREATEADVANCEPAYMENT = 'advancePayment/v1/add';
  UPDATEADVANCEPAYMENT = 'advancePayment/v1/update';
  GETALLADVANCEDATA = 'advancePayment/v1/getalldata'; //NOT USED
  GETADVANCEBYCOMPANYID = 'advancePayment/v1/getcompanydata';
  GETADVANCEBYID = 'advancePayment/v1/getbyid';
  DELETEADVANCE = 'advancePayment/v1/delete';
  ADVANCESTATECHANGE = 'advancePayment/v1/statuschanges';
  GETADVANCEBYUSERID = 'advancePayment/v1/getuserdata';
  CREATEREQUESTADVANCEPAYMENT = 'advancePayment/v1/addd';
  POSTSTATUSREQUEST = 'advancePayment/v1/statusreq';
  ADVANCEDATASHOW = 'advancePayment/v1/advancedatashow';
  GETADVANCEDEMOEXCEL = 'advancePayment/v1/exportDemoexcel';
  UPLOADADVANCE = 'advancePayment/v1/uploadExcel';
  VALIDATEADVANCEPAYMENT = 'advancePayment/v1/validateExcel';
  REVALIDATEADVANCEPAYMENT = 'advancePayment/v1/revalidateAdvancePayment';
  ADDVALIDATEADVANCEPAYMENT = 'advancePayment/v1/addValidateAdvancePayment';
  UPDATEADVANCEBYREPORTEE = 'advancePayment/v1/updateByReportee';
  GETADVANCEBYREPORTEEUSER = 'advancePayment/v1/getuserAdavancedataForReporteeUser';

  //otherPayment
  CREATEOTHERPAYMENT = 'otherPayment/v1/add';
  UPDATEOTHERPAYMENT = 'otherPayment/v1/update';
  GETALLOTHERDATA = 'otherPayment/v1/getalldata'; //NOT USED
  GETOTHERBYCOMPANYID = 'otherPayment/v1/getcompanydata';
  GETPAYMENTBYID = 'otherPayment/v1/getbyid';
  DELETEPAYMENT = 'otherPayment/v1/delete';

  //employeeshift
  GETEMPLOYEESHIFT = 'employeeshift/v1/getbyuserid/';
  UPDATEEMPLOYEESHIFT = 'employeeshift/v1/updatebyid';
  DELETEEMPLOYEESHIFT = 'employeeshift/v1/deletebyid';
  GETALLEMPLOYEESHIFT = 'employeeshift/v1/getEmployeeShift';
  CREATEEMPLOYEESHIFTV2 = 'employeeshift/v2/add';
  CREATEEMPLOYEESHIFTBULKV2 = 'employeeshift/v2/addbulk';
  GETEMPLOYEESHIFTREPORT = 'employeeshift/v1/getEmployeeShiftReport';

  //attendancepolicy
  CREATEATTENDENCEPOLICY = 'attendancepolicy/v1/add';
  VIEWATTENDENCEPOLICY = 'attendancepolicy/v1/getbyid/';
  UPDATEATTENDENCE = 'attendancepolicy/v1/updatebyid';
  GETATTENDENCEDATA = 'attendancepolicy/v1/getalldata';
  DELETEATTENDENCE = 'attendancepolicy/v1/deletebyid';
  ATTENDENCESTATUSCHANGES = 'attendancepolicy/v1/statuschange';
  ATTENDANCEBYCOMPANYDATA2 = 'attendancepolicy/v1/getactiveattendancepolicybycompanyid/';

  //salarypolicy
  CREATESALARYPOLICY = 'salarypolicy/v1/add';
  VIEWSALARYPOLICY = 'salarypolicy/v1/getbyid/';
  UPDATESALARY = 'salarypolicy/v1/updatebyid';
  GETSALARYDATA = 'salarypolicy/v1/getalldata';
  DELETESALARY = 'salarypolicy/v1/deletebyid';
  SALARYSTATUSCHANGES = 'salarypolicy/v1/statuschange';
  SALARYBYCOMPANYDATA2 = 'salarypolicy/v1/getactivesalarypolicybycompanyid/';

  //salaryTrans
  GETSALARYCAL = 'salaryTrans/v1/add';
  GETSALARYREGISTER = 'salaryTrans/v1/ctcmasterreport';
  GETMONTHLYSALARYREGISTER = 'salaryTrans/v1/monthlyhrsalaryregister';
  GETMONTHLYSALARYTRANSACTIONREGISTER = 'salaryTrans/v1/salarysummaryreport';
  SALARYSLIPCAL = 'salaryTrans/v1/genrateSalarywithsalaryslip'; //NOT USED
  DELETESALARYTRAN = 'salaryTrans/v1/deletesalary';
  SALARYSLIPUSERWISE = 'salaryTrans/v1/salaryslipuserwise'; //not used
  SALARYDATAUSER = 'salaryTrans/v1/getUserWiseSalarySlip';
  GETCALCULATEDSALARY = 'salaryTrans/v1/getsalary';
  DELETEALLSALARY = 'salaryTrans/v1/deleteAllsalary';
  ISSUESALARYSLIP = 'salaryTrans/v1/issueSalarySlip';
  GETVARIABLEDEMOEXCEL = 'salaryTrans/v1/getVariableDemoExcel';
  UPLOADVARIABLEEXCEL = 'salaryTrans/v1/uploadVariablePayheadExcel';
  MAILSALARYSLIP = 'salaryTrans/v1/sendSalarySlipviamail';
  GETALLSALARYSLIP = 'salaryTrans/v1/getAllSalarySlip';
  GETSALARYREGISTERNEW = 'salaryTrans/v2/ctcmasterreport';
  PAIDSALARY = 'salaryTrans/v1/paidSalary'; // PAID SALARY

  //employeeattendancepolicy
  GETEMPLOYEEATTENDANCE = 'employeeattendancepolicy/v1/getbyuserid/';
  CREATEEMPLOYEEATTENDANCE = 'employeeattendancepolicy/v1/add';
  DELETEEMPLOYEEATTENDANCE = 'employeeattendancepolicy/v1/deletebyid';
  CREATEALLPOLICY = 'employeeattendancepolicy/v1/postAddAllPolicyBULKATTENDANCE';
  CREATEBULKATTENDANCEPOLICY = 'employeeattendancepolicy/v1/postAddAttendanceAllPolicyBULK';
  GETALLEMPATTENDANCE = 'employeeattendancepolicy/v1/getAttendancePolicy';

  //employeesalarypolicy
  GETEMPLOYEESALARY = 'employeesalarypolicy/v1/getbyuserid/';
  CREATEEMPLOYEESALARY = 'employeesalarypolicy/v1/add';
  UPDATEEMPLOYEESALARY = 'employeesalarypolicy/v1/updatebyid';
  DELETEEMPLOYEESALARY = 'employeesalarypolicy/v1/deletebyid';
  GETACTIVESALARYPOLIY = 'employeesalarypolicy/v1/getActive';
  GETALLEMPSALARY = 'employeesalarypolicy/V1/getSalaryPolicy';
  BULKADDSALARYPOLICY = 'employeesalarypolicy/v1/addbulk';
  GETUSERBYSALARYPOLICY = 'employeesalarypolicy/v1/getUserBySalaryPolicy';

  //userleave
  CREATEEMPLEAVE = 'userleave/v1/add'; //NOT USED
  CREATEBULKEMPLEAVE = 'userleave/v1/bulk/add'; // NOT USED
  UPDATEEMPLEAVE = 'userleave/v1/update';
  GETLEAVEBYUSER = 'userleave/v1/LeaveByUser'; // NOT USED
  GETLEAVEBYCOMPANYID = 'userleave/v1/getcompanyid'; //NOT USED
  GETLEAVEBYID = 'userleave/v1/getbyid';
  DELETELEAVE = 'userleave/v1/delete';
  GETLEAVEDETAILBYID = 'userleave/v1/LeavedetailById/';
  GETLEAVEBALANCEUSED = 'userleave/v1/getLeaveByUserId/';
  GETUSERLEAVEBALANCE = 'userleave/v1/getUserLeaveBalance';
  CHECKOPTIONALLEAVEOFUSER = 'userleave/v1/getOptionalLeaveByUserId';
  ADDUSERLEAVE_WEB = 'userleave/v2/bulk/add';
  VALIDATEMANUALLEAVEEXCEL = 'userleave/v1/validateExcel';
  REVALIDATEMANUALLEAVEDATA = 'userleave/v1/revalidateManualLeave';
  ADDVALIDATEMANUALLEAVE = 'userleave/v1/addValidateManualLeave';
  GENERATEMANUALLEAVEDEMOEXCEL = 'userleave/v1/generateDemoExcel';
  ADDMYOUTDOORDUTY = 'userleave/v1/add_Outdoor_Duty';
  UPDATEMYOUTDOORDUTY = 'userleave/v1/update_Outdoor_Duty/';
  LISTMYOUTDOORDUTY = 'userleave/v1/listOutdoorDutyUserWise';
  GETLEAVEBYUSER_V2 = 'userleave/v2/LeaveByUser';
  GETALLUSERLEAVESBALANCEDATA = 'userleave/v1/getAllUserLeavesBalanceData';
  GETUSERLEAVEDATA = 'userleave/v1/getUserLeavesData';
  MANAGELEAVEBALANCE = 'userleave/v1/manageLeaveBalance';

  //authorizationRequest
  AUTHREQUESTDATABYUSEREXPENSE = 'authorizationRequest/v1/expenseauthorizationrequestbyuserid1';
  AUTHREQUESTDATABYREFERANCEEXPENSE =
    'authorizationRequest/v1/getAuthorizationRequestByReferanceIdExpense/';
  AUTHREQUESTDATABYUSEROVERTIME =
    'authorizationRequest/v1/viewauthorizationrequestbyuseridforovertime';
  AUTHREQUESTDATABYREFERANCEOVERTIME =
    'authorizationRequest/v1/getAuthorizationRequestByReferanceIdOvertime/';
  AUTHREQUESTACCEPTREJECTOVERTIME = 'authorizationRequest/v1/authorizationacceptrejectovertime';
  GETOVERTIMEAUTHORIZEDUSER = 'authorizationRequest/v1/overtimeAuthoriedUser';
  AUTHREQUESTACCEPTREJECTEXPENSEALL = 'authorizationRequest/v1/authorizationacceptrejectexpenseall';
  OVERTIMEDATASHOW = 'authorizationRequest/v1/overtimedatashow';
  EXPENSEDATASHOW = 'authorizationRequest/v1/expensedatashow';
  GETEXPENSEAUTHORIZATIONREQUESTBYAUTHORIZATIONREQUESTID =
    'authorizationRequest/v1/getExpenseAuthorizationRequestByAuthorizationRequestId/';
  GETEXPENSEAUTHBYUSER = 'authorizationRequest/v1/getExpenseAuthByUser';
  GETEXPENSEAUTHBYUSEREXPENSETRANS = 'authorizationRequest/v1/getExpenseAuthByUserExpenseTrans';
  GETEXPENSEAUTHBYUSER_V3 = 'authorizationRequest/v3/getExpenseAuthByUser';

  // leaveauthorizationRequest
  LEAVEAUTHREQUESTDATABYUSER = 'leaveauthorizationRequest/v1/getbyuserid';
  LEAVEAUTHREQUESTDATABYREFERANCE =
    'leaveauthorizationRequest/v1/getAuthorizationRequestByReferanceId/';
  LEAVEDETAILS = 'leaveauthorizationRequest/v1/leavedetails/';

  AUTHREQUESTACCEPTREJECTLEAVE = 'leaveauthorizationRequest/v1/authorizationacceptreject';
  GETLEAVEAUTORIZEDUSER = 'leaveauthorizationRequest/v1/leaveAuthorizeduser';
  LEAVECANCELLIST = 'leaveauthorizationRequest/v1/leavecancellist';
  LEAVECANCEL = 'leaveauthorizationRequest/v1/leavecancel';
  PENDINGREQUEST = 'leaveauthorizationRequest/v1/countpending';
  UPDATEVIEWSTATUSLEAVE = 'leaveauthorizationRequest/v1/updateViewStatus';
  REQUESTCOUNTHRDASHBOARD = 'leaveauthorizationRequest/v1/requestCountforHRdashboard';
  LEAVEDATASHOW = 'leaveauthorizationRequest/v1/leavedatashow';
  GETLEAVEAUTHORIZATIONREQUESTBYAUTHORIZATIONREQUESTID =
    'leaveauthorizationRequest/v1/getAuthorizationRequestByAuthorizationRequestId/';
  LEAVEAUTHREQUESTDATABYUSER_V2 = 'leaveauthorizationRequest/v2/getbyuserid';
  LISTLEAVEAUTHREQUESTNEW = 'leaveauthorizationRequest/v2/listLeaveAuthRequestNew';
  LISTOURDOORDUTYAUTHREQUEST = 'leaveauthorizationRequest/v1/listOutdoorDutyAuthRequest';
  ACCEPTREJECTOUTDOORDUTY = 'leaveauthorizationRequest/v1/acceptRejectOutdoorDuty';
  OUTDOORDUTYCANCELLIST = 'leaveauthorizationRequest/v1/outdoorDutyCancellation';
  LEAVEAPRROVEDAUTHREQUESTDATABYUSERLEAVEAPPLICATIONID =
    'leaveauthorizationRequest/v1/getApprovedAuthorizationRequestByUserLeaveApplicationID/';

  //authorizationmaster
  CREATEAUTHMASTER = 'authorizationmaster/v1/add';
  VIEWAUTHMASTER = 'authorizationmaster/v1/getbyid/';
  UPDATEAUTHMASTER = 'authorizationmaster/v1/updatebyid';
  GETAUTHMASTER = 'authorizationmaster/v1/getalldata';
  DELETEAUTHMASTER = 'authorizationmaster/v1/deletebyid';
  STATUSAUTHMASTER = 'authorizationmaster/v1/statuschange';

  //AuthorizationDetails
  CREATEAUTHORIZATION = 'AuthorizationDetails/v1/add';
  GETAUTHORIZATION = 'AuthorizationDetails/v1/getalldata';
  DELETEAUTHORIZATION = 'AuthorizationDetails/v1/deletebyid';
  AUTHORIZATIONGETBYID = 'AuthorizationDetails/v1/getbyid/';
  UPDATEAUTHORIZATION = 'AuthorizationDetails/v1/updatebyid';
  GETNONAUTHORIZEDUSER = 'AuthorizationDetails/v1/nonauthorizeduser';
  GETALLAUTHDETAILS = 'AuthorizationDetails/v1/getAuthList';
  REPLACEAUTHDETAILS = 'AuthorizationDetails/v1/replaceAuth';
  GETALLAUTHDATA = 'AuthorizationDetails/v1/getAuthorizationDetailsByAuthorizedByUserMasterId';
  DELETEAUTHORIZATIONBYUSERANDAUTHMASTER = 'AuthorizationDetails/v1/deleteAuth';

  //overTime
  GETOVERTIMECAL = 'overTime/v1/getdataovertime';
  GETOVERTIMEAMOUNTCAL = 'overTime/v1/getratiowiseovertime'; //not used
  EDITOVERTIMEAMOUNTCAL = 'overTime/v1/editovertimecal';
  DELETEOVERTIME = 'overTime/v1/deleteovertimecal';
  OVERTIMEREPORT = 'overTime/v1/getovertimereport';
  GETOVERTIMEUSERWISE = 'overTime/v1/getOvertimeDataUserwise';
  CALCULATEOVERTIME = 'overTime/v1/calculateOvertime';
  GETPENDINGOVERTIME = 'overTime/v1/getPendingOvertimedata';
  GETOVERTIMECONSOLIDATEREPORT = 'overTime/v1/consolidateReport';
  DAILYOTREPORT = 'overTime/v1/getDailyOTReport';
  EDITOVERTIMECALCULATION = 'overTime/v1/editOvertimeCalculation';

  //overTimePolicy
  CREATEOVERTIMEPOLICY = 'overTimePolicy/v1/insert_data';
  VIEWOVERTIMEPOLICY = 'overTimePolicy/v1/getbyid_data/';
  UPDATEOVERTIMEPOLICY = 'overTimePolicy/v1/update_data';
  GETOVERTIMEPOLICYDATA = 'overTimePolicy/v1/view_data';
  DELETEOVERTIMEPOLICYDATA = 'overTimePolicy/v1/delete_data/';
  OVERTIMEPOLICYSTATUSCHANGES = 'overTimePolicy/v1/status_change';

  //userOverTimePolicyAssign
  GETOVERTIMEDATA = 'userOverTimePolicyAssign/v1/getbyuserid/';
  CREATEEMPLOYEEOVERTIME = 'userOverTimePolicyAssign/v1/insert_data';
  UPDATEEMPLOYEEOVERTIME = 'userOverTimePolicyAssign/v1/update_data';
  DELETEEMPLOYEEOVERTIME = 'userOverTimePolicyAssign/v1/delete_data';

  //companywiseReport
  CREATECOMPANYREPORT = 'companywiseReport/v1/add';
  VIEWCOMPANYREPORT = 'companywiseReport/v1/getbyid/';
  UPDATECOMPANYREPORT = 'companywiseReport/v1/updatebyid';
  GETCOMPANYREPORTDATA = 'companywiseReport/v1/getalldata';
  DELETECOMPANYREPORT = 'companywiseReport/v1/deletebyid';
  COMPANYREPORTSTATUSCHANGES = 'companywiseReport/v1/statuschange';
  GETCOMPANYREPORTDATABYCOMPANYID = 'companywiseReport/v1/getCompanywiseReportByCompanyId/';
  GETCOMPANYREPORTDATA1 = 'companywiseReport/v1/getdataofreport';

  //userExpense
  GETBYIDEXPENSE = 'userExpense/v1/getbyid/';
  UPDATEEXPENSEERP = 'userExpense/v1/syncexpense';
  DELETEEXPENSE = 'userExpense/v1/deleteUserExpenseTransaction';
  GETEXPENSETRANSDATABYVERSION = 'userExpense/v1/getbyversion';
  EXPENSEAUTH_DETAILS = 'userExpense/v1/userExpenseAuthDetails/';
  EDITAUTHRIZATIONBYIDEXPENSE = 'userExpense/v1/updatebyauthorizationid';
  EDITAUTHRIZATIONBYIDEXPENSE_V2 = 'userExpense/v2/updatebyauthorizationid';
  GETERPSYNC_V2 = 'userExpense/v2/expensesyncdata';
  GETWITHNEGATIVEJVID = 'userExpense/v1/findExpesneWithNegativeJvID';
  GETUNASSIGNEDERPACCOUTEXPENSE = 'userExpense/v1/findExpesneWithUnassignedERPID';
  CREATEEXPENSE_V2 = 'userExpense/v2/add';
  GETEXPENSEBYUSERID_V3 = 'userExpense/v3/userExpenseNew';
  GETEXPENSEBYUSERID_V2 = 'userExpense/v2/userExpenseNew';
  UPDATEEXPENSE_V2 = 'userExpense/v2/updatebyid';
  REAPPLYEXPENSE_V2 = 'userExpense/v2/reapply';
  GETUSEREXPENSEBYID = 'userExpense/v1/userExpenseByID';
  UPDATEBYUSEREXPENSEID = 'userExpense/v1/updatebyUserExpenseID';
  DELETEALLEXPENSEBYEXPENSEID = 'userExpense/v1/deleteUserExpenseByExpenseID';
  EXPORTMYEXPENSE = 'userExpense/v1/exportMyExpense';

  //reportTo
  REPORTTO = 'reportTo/v1/reportsto/';
  REPORTTO1 = 'reportTo/v1/reportstostructure/';
  REPORTTO2 = 'reportTo/v1/reportstowithoutchild/';
  REPORTTO3 = 'reportTo/v1/reportstowithoutchildvisit/';
  REPORTSTOIMMEDIATECHILD = 'reportTo/v1/reportstoImmediateChild';
  REPORTSTOWITHOUTCHIDDATEWISE = 'reportTo/v1/reportstowithoutchilddatewise';
  NONREPORTSTOUSERS = 'reportTo/v1/notReportsToUsers';

  //biometric
  SYNCATTENDANCE = 'biometric/v1/biometricsync';
  SYNCATTENDANCE1 = 'biometric/v1/wellsunmedicity'; //NOT USED
  VALIDATEATTENDANCE = 'biometric/v1/pathocarevalidator/';
  UPLOADEXCELATTENDANCE = 'biometric/v1/excelattendance';
  BIOMETRICVALIDATOR = 'biometric/v1/biometricvalidator';
  PENDNGBIOMETRICSYNC = 'biometric/v1/pendingbiometricsync';
  HEERAGROUPBIOMETRICSYNC = 'biometric/v1/heeraGroupBiometric';
  ADDMANUALLOG = 'biometric/v1/addManualLog';
  GENERATEUPLOADBIOMETRICATTENDANCEDEMOEXCEL = 'biometric/v1/generateDemoExcel';
  VALIDATEBIOMETRICATTENDANCEEXCEL = 'biometric/v1/validateExcel';
  UPLOADBIOMETRICATTENDANCEEXCEL = 'biometric/v1/uploadBiometricLogExcel';
  ASOPALAVCOMMISSION = 'biometric/v1/asopalavCommissionAPI';

  //report
  GETVISITREPORT = 'report/v1/visitReport';
  GETEXPENSEREPORT = 'report/v1/expenseReport';
  GETVISITREPORTSUMMARY = 'report/v1/visitSummaryReport';
  HRATTENDANCEREPORT = 'report/v1/hrattendancereport';
  HRATTENDANCESALARYREPORT = 'report/v1/hrattendancewithsalaryreport';
  PFREPORT = 'report/v1/pfreport'; //not used
  ESICCHALLAN = 'report/v1/esicchallan'; //not used
  GETEMPLOYEEDATA = 'report/v1/employeedetails';
  GETADULTEMPLOYEES = 'report/v1/adultemployees';
  GETFORM18 = 'report/v1/form18';
  GETFORM14 = 'report/v1/form14';
  Track_Report = 'report/v1/tracking_report';
  INCREMENTREPORT = 'report/v1/increment_report';
  LEAVEBALANCEREPORT = 'report/v1/leavebalance_report';
  FORMER01 = 'report/v1/formEr01';
  EsicReportList = 'report/v1/ESIC';
  PfReport = 'report/v1/pfreport1';
  GETFORM_11 = 'report/v1/form_11';
  GETESIC1 = 'report/v1/esicreport';
  SALARYREGISTERREPORT = 'report/v1/salaryRegister';
  GETFORM_29 = 'report/v1/form_29';
  GETVISITREPORTBYCUSTMOER = 'report/v1/visitReportByCustomer';
  WAGESSALARYREGISTER = 'report/v1/wagesofsalaryregister';
  PAMUSTERROLLREGISTER = 'report/v1/paMusterRoll';
  INOUTATTENDANCEREGISTER = 'report/v1/inoutAttendanceRegister';
  GETFORM_5 = 'report/v1/form_5';
  HourlySalaryRegister = 'report/v1/hourlySalaryRegister';
  LWFREPORT = 'report/v1/lwf_report';
  LEAVEREPORT = 'report/v1/leaveReport';
  DASHBOARDSALARY = 'report/v1/getDashboardSalary';
  EXPENSEREPORT = 'report/v1/expense-report';
  GETTRACKINGREPORT = 'report/v1/getTrackingReports';
  GETLEAVEBALANCESUMMARYREPORT = 'report/v1/getleaveBalanceReport';
  BANKREPORT = 'report/v1/bankStatementReport';
  DISTINCTLOCATIONSTRACKINGREPORT = 'report/v1/distinctLoationsTrackingReport';
  FIVEMINUTEGAPYRACKINGREPORT = 'report/v1/fiveMinuteGapTrackingReport';
  GETEMPLOYEEREPOTSTOREPORT = 'report/v1/getreportsToreport';
  GETTALEATTREPORT = 'report/v1/getTaleAttreport';
  DAILYINOUTREPORT = 'report/v1/dailyInOutReport';
  MONTHLYATTENDANCEREPORT = 'report/v1/monthlyAttendanceReport';
  EMPLOYEEMONTHWISESALRYREPORT = 'report/v1/employeeWiseSalaryReport';
  GETPREVIOUSFINANCIALYEARS = 'report/v1/getPreviousfinancialYear';
  GETFORM16REPORT = 'report/v1/form16Report';
  SHIFTWISEATTENDANCECOUNTREPORT = 'report/v1/shiftwiseattendancecount';
  LOANREPORT = 'report/v1/loanreportData';
  DEPARTMENTSHIFTWISEATTENDANCECOUNTREPORT = 'report/v1/shiftdepartmentwiseDailyattendancecount';
  USERDOCUMENTEXPRIYREPORT = 'report/v1/userDocumentExpriyData';
  ATTENDANCEREGISTER3 = 'report/v1/attendanceRegister3';
  ATTENDANCEREPORT4 = 'report/v1/attendanceReport4';
  WEEKOFFDAYWORKREPORT = 'report/v1/getWeekoffDayWorkReport';
  SLOTWISEATTENDANCEREPORT = 'report/v1/slotwiseAttendanceReport';
  GETSHORTLEAVEAPPLICATIONREPORT = 'report/v1/shortLeaveApplicationReport';
  LWFCHALLAN = 'report/v1/lwfChallan';
  SERVICECHARGESBILL = 'report/v1/serviceChargesBill';
  LABOURCHARGESBILL = 'report/v1/labourChargesBill';
  OTREPORTWITHESIC = 'report/v1/otReportWithESIC';
  ATTENDANCEDASHBOARD = 'report/v1/attendance_dashboard';
  ATTENDANCECORRECTIONREPORT = 'report/v1/attendanceCorrectionReport';
  EXPNESECLAIMREPORT = 'report/v1/expenseClaimReport';
  EXPNESEREPORTMARS = 'report/v1/marsExpenseReport';
  COMPLETEDTENSUREREPORT = 'report/v1/completedTenureReport';
  OFFICEEXPENSEREPORT = 'report/v1/officeExpenseReport';

  //Ndacategory
  ADDNDACATEGORY = 'Ndacategory/v1/add';
  GETALLNDACATEGORY = 'Ndacategory/v1/getbycompanyid';
  DELETENDACATEGORY = 'Ndacategory/v1/delete/';
  UPDATENDACATEGORY = 'Ndacategory/v1/update';
  GETBYIDNDACATEGORY = 'Ndacategory/v1/getbyid/';
  NDABYCOMPANYID = 'Ndacategory/v1/bycompanyid';
  UPLOADNDAEXCELDATA = 'Ndacategory/v1/uploadexcel';
  NDACATEGORYSTATUSCHANGE = 'Ndacategory/v1/poststatuschange';
  VALIDATENDACATEGORYEXCEL = 'Ndacategory/v1/validateExcel';
  REVALIDATENDACATEGORYDATA = 'Ndacategory/v1/reValidateNdaCategory';
  ADDVALIDATENDACATEGORY = 'Ndacategory/v1/addValidateNdaCategory';

  //EmployeeNda
  ADDEMPLOYEENDA = 'EmployeeNda/v1/add';
  GETALLEMPLOYEENDA = 'EmployeeNda/v1/bycompanyid';
  GETBYIDEMPLOYEENDA = 'EmployeeNda/v1/getbyid/';
  UPDATEEMPLOYEENDA = 'EmployeeNda/v1/update';
  DELETEEMPLOYEENDA = 'EmployeeNda/v1/delete/';

  //depositCategory
  GETDEPOSITCATEGORYDATA = 'depositCategory/v1/getDepositCategorycompanyid';
  GETDEPOSITCATEGORYDATA1 = 'depositCategory/v1/getDepositCategoryByCompanyId/';
  CREATEDEPOSITCATEGORYDATA = 'depositCategory/v1/add';
  VIEWDEPOSITCATEGORYDATA = 'depositCategory/v1/getbyid/';
  DEPOSITCATEGORYBYCOMPANYDATA = 'depositCategory/v1/getDepositCategorycompanyid';
  UPDATEDEPOSITCATEGORYDATA = 'depositCategory/v1/updatebyid';
  DELETEDEPOSITCATEGORYDATA = 'depositCategory/v1/deletebyid';
  DEPOSITCATEGORYSTATUSCHANGES = 'depositCategory/v1/statuschanges';
  UPLOADDEPOSIT = 'depositCategory/v1/postUploadExcel';
  VALIDATEDEPOSITCATEGORYEXCEL = 'depositCategory/v1/validateExcel';
  REVALIDATEDEPOSITCATEGORYDATA = 'depositCategory/v1/reValidateDepositCategory';
  ADDVALIDATEDDEPOSITCATEGORY = 'depositCategory/v1/addValidateDepositCategory';

  //deposit
  CREATEDEPOSITDATA = 'deposit/v1/add';
  UPDATEDEPOSITDATA = 'deposit/v1/updatebyid';
  VIEWDEPOSITDATA = 'deposit/v1/getbyid/';
  DEPOSITBYCOMPANYDATA = 'deposit/v1/getDepositcompanyid';
  DELETEDEPOSITDATA = 'deposit/v1/deletebyid';
  DEPOSITSTATUSCHANGES = 'deposit/v1/statuschanges';
  CREATEUSERDEPOSIT = 'deposit/v1/getDepositByUserId';

  //meetingPlace
  GETMEETINGPLACEDATA1 = 'meetingPlace/v1/getmeetingPlaceByCompanyId/';
  CREATEMEETINGPLACE = 'meetingPlace/v1/add';
  VIEWMEETINGPLACEDATA = 'meetingPlace/v1/getbyid/';
  MEETINGPLACEBYCOMPANYDATA = 'meetingPlace/v1/getmeetingPlacecompanyid';
  UPDATEMEETINGPLACEDATA = 'meetingPlace/v1/updatebyid';
  DELETEMEETINGPLACEDATA = 'meetingPlace/v1/deletebyid';
  MEETINGPLACESTATUSCHANGES = 'meetingPlace/v1/statuschanges';
  UPLOADMEETINGPLACE = 'meetingPlace/v1/uploadexcel';
  VALIDATEMEETINGPLACEEXCEL = 'meetingPlace/v1/validateExcel';
  REVALIDATEMEETINGPLACEDATA = 'meetingPlace/v1/reValidateMeetingPlace';
  ADDVALIDATEMEETINGPLACE = 'meetingPlace/v1/addValidateMeetingPlace';

  //visitors
  GETVISITORDATA1 = 'visitors/v1/getvisitorsByCompanyId/';
  CREATEVISITOR = 'visitors/v1/add';
  UPDATEVISITOR = 'visitors/v1/updatebyid';
  VIEWVISITORDATA = 'visitors/v1/getbyid/';
  VISITORSCOMPANYDATA = 'visitors/v1/getvisitorscompanyid';
  DELETEVISITORSDATA = 'visitors/v1/deletebyid';
  VISITORSTATUSCHANGES = 'visitors/v1/statuschanges';
  UPLOADVISITORSEXCEL = 'visitors/v1/uploadexcel';
  VALIDATEVISITORSEXCEL = 'visitors/v1/validateExcel';
  REVALIDATEVISITORSDATA = 'visitors/v1/revalidateVisitors';
  ADDVALIDATEVISITORS = 'visitors/v1/addValidateVisitors';

  //gatePass
  CREATEGATEPASS = 'gatePass/v1/add';
  UPDATEGATEPASS = 'gatePass/v1/updatebyid';
  VIEWGATEPASSDATA = 'gatePass/v1/getbyid/';
  GATEPASSBYCOMPANYDATA = 'gatePass/v1/getgatePasscompanyid';
  GATEPASSBYCOMPANYDATA1 = 'gatePass/v1/getgatePassuser';
  DELETEGATEPASSDATA = 'gatePass/v1/deletebyid';
  GATEPASSSTATUSCHANGES = 'gatePass/v1/statuschanges';
  UPDATEGATEPASS1 = 'gatePass/v1/updatebyid1';
  GATEPASSDASHBOARD = 'gatePass//v1/gatepassdashboard';

  //NdaReport
  NDAREPORT = 'NdaReport/v1/getdata';
  DEPOSITREPORT = 'NdaReport/v1/getdatadeposit';

  //AssetReport
  ASSETREPORT = 'AssetReport/v1/getdata';

  //PenaltyReport
  PENALTYREPORT = 'PenaltyReport/v1/getdata';

  //AdvanceReport
  ADVANCEREPORT = 'AdvanceReport/v1/getdata';

  //assetMaster
  CREATEASSETMASTER = 'assetMaster/v1/add';
  GETASSETMASTERDATA = 'assetMaster/v1/getalldata'; //NOT USED
  UPDATEASSETMASTERDATA = 'assetMaster/v1/updatebyid';
  DELETEASSETMASTERDATA = 'assetMaster/v1/deletebyid';
  VISITASSETMASTERTATUSCHANGES = 'assetMaster/v1/statuschanges';
  VIEWASSETMASTERDATA = 'assetMaster/v1/getbyid/';
  GETASSETMASTERDATABYCOMPANY = 'assetMaster/v1/bycompanyid';
  GETASSETCATEGORYBYCOMPID = 'assetMaster/v1/getassetcategorybycompid';
  VALIDATEASSETMASTEREXCEL = 'assetMaster/v1/validateExcel';
  REVALIDATEASSETMASTERDATA = 'assetMaster/v1/revalidateAssetMaster';
  ADDVALIDATEASSETMASTER = 'assetMaster/v1/addValidateAssetMaster';
  GENERATEASSETMASTERDEMOEXCEL = 'assetMaster/v1/generateDemoExcel';

  //salaryIncrement
  CHECKSALARYINCREMENT = 'salaryIncrement/v1/checkdata';
  ADDINCREMENT = 'salaryIncrement/v1/add';
  GETSALARYINCREMENTDATA = 'salaryIncrement/v1/getdata';
  CALCULATEINCREMENT = 'salaryIncrement/v1/calculateincrement';
  CHANGECALCUTEINCREMENT = 'salaryIncrement/v1/changeincrement';

  //LastFiveAttendance
  LAST5ATTENDANCE = 'LastFiveAttendance/v1/getlastfiveattendance'; //not used

  //Employeement
  CREATEEMPLOYEEMENT = 'Employeement/v1/add';
  GETEMPLOYEEMENT = 'Employeement/v1/getalldata';
  GETEMPLOYEEMENTBYCOMPANY = 'Employeement/v1/getEmployeementcompanyid';
  UPDATEEMPLOYEEMENT = 'Employeement/v1/updatebyid';
  VIEWEMPLOYEEMENT = 'Employeement/v1/getbyid/';
  GETEMPLOYEEMENTBYCOMPANYID = 'Employeement/v1/getEmployeementBycompanyid/'; //NOT USED
  DELETEEMPLOYEEMENT = 'Employeement/v1/deletebyid';

  // empEmployeement
  CREATEempEMPLOYEEMENT = 'empEmployeement/v1/add';
  GETempEMPLOYEEMENT = 'empEmployeement/v1/getalldata'; //NOT USED
  GETempEMPLOYEEMENTBYID = 'empEmployeement/v1/getbyid/'; //NOT USED
  GETempEMPLOYEEMENTBYUSERID = 'empEmployeement/v1/getbyuserid/';
  UPDATEempEMPLOYEEMENTBYUSERID = 'empEmployeement/v1/updatebyid';
  DELETEempEMPLOYEEMENT = 'empEmployeement/v1/deletebyid';
  TOBECONFIRMEDEMPLOYEE = 'empEmployeement/v1/toBeConfirmedEmployee';

  //erpAccountMaster
  GETERP = 'erpAccountMaster/v1/geterpaccount';
  CREATEERPMASTERDATA = 'erpAccountMaster/v1/add';
  UPDATEERPMASTERDATA = 'erpAccountMaster/v1/updatebyid';
  VIEWERPACCOUNTDATA = 'erpAccountMaster/v1/getbyid/';
  ERPACCOUNTBYCOMPANYDATA = 'erpAccountMaster/v1/geterpAccountMasterByCompanyID';
  DELETEERPACCOUNTDATA = 'erpAccountMaster/v1/deletebyid';
  ERPACCOUNTSTATUSCHANGES = 'erpAccountMaster/v1/statuschanges'; //not used

  //biometricintegration
  ADDBIOMETRICINTEGRATION = 'biometricintegration/v1/add';
  GETALLBIOMETRICINTEGRATION = 'biometricintegration/v1/getAll';
  STATUSCHANGEBIOMETRICINTEGRATION = 'biometricintegration/v1/statusChange';
  UPDATEBIOMETRICINTEGRATION = 'biometricintegration/v1/update';
  DELETEBIOMETRICINTEGRATION = 'biometricintegration/v1/delete';
  GETBYIDBIOMETRICINTEGRATION = 'biometricintegration/v1/getbyid/';
  GETTABLEANDDB = 'biometricintegration/v1/getbycomp';
  GETBIOMETRICLIST = 'biometricintegration/v1/getBiometricList';
  GETSERIALNOBYTABLE = 'biometricintegration/v1/getbytable'; //NOT USED
  REMOVESERIALNO = 'biometricintegration/v1/removeSerialNo'; //NOT USED
  DELETEBIOMETRICINTEGRATIONBYCOMPANYMASTERID = 'biometricintegration/v1/deleteBycompanyMasterID';
  CHECKBIOMETRICSTATUS = 'biometricintegration/v1/checkBiometricStatus';
  CHECKUNASSIGNEDEMPLOYEECODEDATA = 'biometricintegration/v1/checkunassignedEmployeeCodeData';
  GETBIOMETRICINTEGRATIONBYCHILDPARENTCOMPANY = 'biometricintegration/v1/getbyChildParentCompany';

  //MusterBoxDatabaseList
  GETDBNAME = 'MusterBoxDatabaseList/v1/MusterBoxDatabase';
  GETTABLENAME = 'MusterBoxDatabaseList/v1/MusterBoxGetTable';
  GETSERIALNO = 'MusterBoxDatabaseList/v1/MusterBoxgetSerialNo';
  CREATETABLE = 'MusterBoxDatabaseList/v1/MusterBoxCreateTable';

  //mannualAttendance
  ADDMANUALATTENDANCE = 'mannualAttendance/v1/addmanualAttendance';
  ADDMANUALATTENDANCE_V2 = 'mannualAttendance/v2/addmanualAttendance';
  GETMANNUALATTENDANCEDATA = 'mannualAttendance/v1/getAlldata';
  GETMANNUALATTENDANCEDATA_V2 = 'mannualAttendance/v2/getAlldata';
  UPLOADBIOMETRICEXCEL = 'mannualAttendance/v1/uploadboimetricexcel';

  //datewiseattendancepolicy
  CREATEDATEEWISEATTENDANCEPOLICY = 'datewiseattendancepolicy/v1/add';
  GETDATEWISEADDATABYID = 'datewiseattendancepolicy/v1/getid/';
  UPDATEDATEEWISEATTENDANCEPOLICY = 'datewiseattendancepolicy/v1/updatebyid';
  DELETEDATEEWISEATTENDANCEPOLICY = 'datewiseattendancepolicy/v1/deletebyid';
  GETALLDATEWISE = 'datewiseattendancepolicy/v1/getalldatabyid';

  //coffMaster
  GETALLCOFF = 'coffMaster/v1/getallCoff';
  DELETECOFF = 'coffMaster/v1/deleteCoff';
  ADDCOFF = 'coffMaster/v1/addCoff';
  GETCOFFBYCOMPANY = 'coffMaster/v1/getAllCoffbyCompany';
  ADDCOFFMASTER = 'coffMaster/v1/addCoffmaster';
  ADDCOFFMASTERWITHAUTHORIZATION = 'coffMaster/v1/addCoffmasterWithAuthorization';
  GETALLCOFFBYUSERMASERID = 'coffMaster/v1/getCoffDataByUserMasterID';

  //hrToolKit
  ADDHRTOOLKIT = 'hrToolKit/v1/add';
  GETHRTOOLKIT = 'hrToolKit/v1/getAll';
  DELETEHRTOOLKIT = 'hrToolKit/v1/deletebyID';
  HRTOOLKITSTATUSCHANGE = 'hrToolKit/v1/statuschange';

  //resignation
  CREATERESIGNATION = 'resignation/v1/add';
  UPDATERESIGNATION = 'resignation/v1/update/';
  GETALLRESIGNATIONBYAUTH = 'resignation/v1/getAll';
  REJECTRESIGNATION = 'resignation/v1/rejectResignation';
  ACCEPTRESIGNATION = 'resignation/v1/acceptResignation';
  GETRESIGNATIONBYUSERID = 'resignation/v1/getResignationByUserId/';
  DELETERESIGNATIONBYID = 'resignation/v1/postDeleteResignationById';
  GETRESIGNATIONBYREFERENCEID = 'resignation/v1/getauthdatabyid/';
  POSTCANCELRESIGNATION = 'resignation/v1/cancelResignation';
  RESIGNATIONAUTHORIZEDUSER = 'resignation/v1/resignationAuthorizeduser';
  GETRESIGNATIONTASKBYID = 'resignation/v1/getresignationtaskbyid/';
  UPDATERELIEVINGDATE = 'resignation/v1/updaterelievingdate/';
  RESIGNATIONAUTHREQUESTACCEPTREJECT = 'resignation/resignationAuthorizationacceptreject';

  //resignProcess
  ADDRESIGNATION = 'resignProcess/v1/addresignProcess';
  ADDRESIGNATION1 = 'resignProcess/v1/addresignTask';
  GETALLRESIGNATION = 'resignProcess/v1/getAllresignProcess';
  GETALLTASK = 'resignProcess/v1/getAllresignProcesswithtask';
  CHANGERESIGNSTATUS = 'resignProcess/v1/statusChanged';
  UPDATERESIGN = 'resignProcess/v1/update'; //NOT USED
  GETRESIGNPROCESSBYID = 'resignProcess/v1/resignProcessbyid/';
  UPDATERESIGNPROCESS = 'resignProcess/v1/updateResignProcess/';

  //resignTaskAssign
  GETALLRESIGNTASK = 'resignTaskAssign/v1/getAllresigntaskAssign';
  UPDATERESIGNTASK = 'resignTaskAssign/v1/postUpdateresignTaskAssign';

  // incentive
  GETALLINCENTIVEDATA = 'incentive/v1/getalldatabycompanyid';
  INCENTIVETYPEADD = 'incentive/v1/add';
  INCENTIVETYPEUPDATE = 'incentive/v1/updatebyid';
  INCENTIVESTATUSCHANGES = 'incentive/v1/statuschanges';
  INCENTIVEDELETE = 'incentive/v1/deletebyid'; //NOT USED
  GETBYIDINCENTIVE = 'incentive/v1/getbyid/';
  DELETEBYID = 'incentive/v1/destroy';

  //employeeincentive
  ADDEMPLOYEEINCENTIVE = 'employeeincentive/v1/add';
  UPDATEEMPLOYEEINCENTIVE = 'employeeincentive/v1/updatebyid';
  DELETEEMPLOYEEINCENTIVE = 'employeeincentive/v1/statuschanges';
  GETEMPLOOYEEBYINCENTIVEID = 'employeeincentive/v1/getbycompanyid';
  GETBYNAME = 'employeeincentive/v1/getbyname';
  GETALLEMPLOYEEINCENTIVEDATA = 'employeeincentive/v1/getalldata';
  UPDATEFILTER = 'employeeincentive/v1/searchquery'; //NOT USED
  GETBYID = 'employeeincentive/v1/getbyid/';
  GETMYINCENTIVELIST = 'employeeincentive/v1/getMyIncentive';
  INCENTIVETYPESWITHOUTATTNBONUS = 'employeeincentive/v1/getIncentiveTypeWithOutAttnBonus';

  //dailyTask
  ADDTASK = 'dailyTask/v1/add';
  GETALLDAILYTASK = 'dailyTask/v1/getAll';
  DELETETASK = 'dailyTask/v1/deletebyID';
  UPDATETASK = 'dailyTask/v1/update';
  GETTASKBYID = 'dailyTask/v1/getbyID/';
  ADDTASK_V2 = 'dailyTask/v2/add';
  UPDATETASK_V2 = 'dailyTask/v2/update';
  GETALLDAILYTASK_V2 = 'dailyTask/v2/getAll';

  //vehicleUsage
  GATEDAILYVEHICLEUSAGEREPORT = 'vehicleUsage/v1/getuserdailyvehicleusagereport';
  GETVEHICLEUSAGEBYCOMPANYID = 'vehicleUsage/v1/getVehicleUsageByCompanyId';
  ADDENDINGVEHICLEUSAGE = 'vehicleUsage/v1/addEndingVehicleUsage';

  //employeeAccident
  ADDEMPACCIDENT = 'employeeAccident/v1/add';
  GETEMPACCIDENTDATA = 'employeeAccident/v1/getEmpAccidentData';
  GETEMPACCIDENTDATABYID = 'employeeAccident/v1/getEmpAccidentDataById/';
  UPDATEEMPACCIDENTDATA = 'employeeAccident/v1/updatebyid';
  DELETEEMPACCIDENTDATA = 'employeeAccident/v1/delete';

  EXPENSEPAYMENTLIST = 'expensePayment/v1/expensePaymentData';
  EXPENSEPAYMENTADD = 'expensePayment/v1/add';
  EXPENSEPAYMENTDETAILBYTRANID = 'expensePayment/v1/expensePaymentDetailsByTranId/'; //NOT USED
  LISTPAIDEXPENSE = 'expensePayment/v1/listPaidExpense';
  LISTPAIDEXPENSE_V2 = 'expensePayment/v2/listPaidExpense';
  DELETEPAIDEXPENSE = 'expensePayment/v1/delete';
  GETPAIDEXPENSEBYID = 'expensePayment/v1/getByexpensePaymentId/';
  UPDATEPAIDEXPENSEBYID = 'expensePayment/v1/updatebyid';
  GETEXPENSEADVANCE = 'expensePayment/v1/getdata';
  ADDEXPENSEADVANCE = 'expensePayment/v1/adddata';
  GETBYIDEXPENSEADVANCE = 'expensePayment/v1/getById/';
  UPDATEEXPENSEADVANCE = 'expensePayment/v1/edit/';
  DELETEEEXPENSEADVANCE = 'expensePayment/v1/delete/';
  ERPSYNCINTEGRATION = 'expensePayment/v1/synerpIntegration/';
  SYNCERPPAYMENT = 'expensePayment/v1/syncerpExpensePayment';
  GENERATEDEMOEXCELFORIMPORT = 'expensePayment/v1/exportDemoImportGroupExpense';
  VALIDATEEXPENSEPAYMENT = 'expensePayment/v1/validateExcel';
  REVALIDATEEXPENSEPAYMENT = 'expensePayment/v1/reValidateUploadExcel';
  ADDVALIDATEEXPENSEPAYMENT = 'expensePayment/v1/addValidateExpensePayment';

  //Tasks_Stages
  ADDTASKSTAGES = 'Tasks_Stages/v1/add';
  GETALLTASKSTAGES = 'Tasks_Stages/v1/getalldata';
  GETBYIDTASKSTAGES = 'Tasks_Stages/v1/getbyid/';
  UPDATETASKSTAGES = 'Tasks_Stages/v1/updatebyid';
  DELETETASKSTAGE = 'Tasks_Stages/v1/deletebyid';
  STATUSCHANGETASKSTAGE = 'Tasks_Stages/v1/statuschange';
  GETALLSTAGESBYID = 'Tasks_Stages/v1/getTaskStageByIdArray';
  UPLOADTASKSTAGEDATA = 'Tasks_Stages/v1/uploadexcel';
  VALIDATETASKSTAGESEXCEL = 'Tasks_Stages/v1/validateExcel';
  REVALIDATETASKSTAGESDATA = 'Tasks_Stages/v1/reValidateTaskStages';
  ADDVALIDATETASKSTAGES = 'Tasks_Stages/v1/addValidateTaskStages';
  SENDREMINDER = 'Tasks_Stages/v1/send-reminder';
  GETALLREMINDER = 'Tasks_Stages/v1/list-reminder';

  //user_tasks
  ADDTASK1 = 'user_tasks/v1/add';
  GETTASKBYCOMPANY = 'user_tasks/v1/getTaskbyCompany';
  GETTASKBYID1 = 'user_tasks/v1/getbyID/';
  UPDATETASK1 = 'user_tasks/v1/updateTask';
  DELETETASK1 = 'user_tasks/v1/deleteTask';
  GETNEXTSTAGEBYID = 'user_tasks/v1/getNextStageById/';
  UPDATETASKSTAGE = 'user_tasks/v1/postUpdateTaskStage';
  TASKACCEPTREJECT = 'user_tasks/v1/TaskAcceptReject';
  ADDTASK2 = 'user_tasks/v2/add';
  UPDATETASKSTAGE2 = 'user_tasks/v2/postUpdateTaskStage';
  UPDATETASK2 = 'user_tasks/v2/updateTask';
  DELETETASK2 = 'user_tasks/v2/deleteTask';
  GETTASKBYUSER2 = 'user_tasks/v2/getTaskbyUser';
  GETTASKBYUSERV3 = 'user_tasks/v3/getTaskbyUser';

  GETSUBTASKBYID = 'user_tasks/v1/getSubTaskByID';
  GETMAINTASKBYID = 'user_tasks/v1/getMainTaskByID';
  GETTASKBYCOMPANY2 = 'user_tasks/v2/getTaskbyCompany';
  TASKDASHBOARD = 'user_tasks/v1/taskDashBoard';
  TASKSTATUSCOUNTBYCOMPANY = 'user_tasks/v1/getTaskReportByCompany';
  TASKSTATUSCOUNTBYUSER = 'user_tasks/v1/getTaskReportByUsers';
  PENDINGTASKDASHBOARD = 'user_tasks/v1/pendingTaskDashBoard';

  //userchats
  GETUSERLIST = 'userchats/v1/getuserList';
  POSTSENDMESSAGE = 'userchats/v1/postSendMessage';
  POSTUPDATECHATSTOSEEN = 'userchats/v1/postUpdatechatstoseen'; // NOT USED
  GETUSERWISECHAT = 'userchats/v1/getuserWiseChat';
  POSTDELETECHAT = 'userchats/v1/postdeletechat';

  //taskRemark
  ADDREMARK = 'taskRemark/v1/postAddTaskRemark';
  GETTASKREMARK = 'taskRemark/v1/getTaskById/';

  //letterTemplateType
  CREATELETTERTEMPLATETYPEDATA = 'letterTemplateType/v1/add';
  GETLETTERTEMPLATETYPEDATA = 'letterTemplateType/v1/getalldata';
  DELETELETTERTYPEDATA = 'letterTemplateType/v1/deletebyid';
  LETTERSTATUSCHANGES = 'letterTemplateType/v1/statuschanges';
  VIEWLETTERTYPEDATA = 'letterTemplateType/v1/getbyid/';
  UPDATELETTERTYPEDATA = 'letterTemplateType/v1/updatebyid';

  //letterFields
  GETALLLETTERFIELDSDATA = 'letterFields/v1/getalldata';
  DELETELETTERFIELDDATA = 'letterFields/v1/deletebyid';
  LETTERFIELDSSTATUSCHANGES = 'letterFields/v1/statuschanges';
  GETALLLETTERTEMPLATETYPEBYID = 'letterFields/v1/getLetterFieldsByLetterType';
  ADDLETTERFIELDS = 'letterFields/v1/add';

  //mailTemplateType
  CREATEMAILTEMPLATETYPEDATA = 'mailTemplateType/v1/add';
  GETMAILTEMPLATETYPEDATA = 'mailTemplateType/v1/getalldata';
  DELETEMAILTYPEDATA = 'mailTemplateType/v1/deletebyid';
  MAILSTATUSCHANGES = 'mailTemplateType/v1/statuschanges';
  VIEWMAILTYPEDATA = 'mailTemplateType/v1/getbyid/';
  UPDATEMAILTYPEDATA = 'mailTemplateType/v1/updatebyid';

  //mailFields
  ADDMAILFIELDS = 'mailFields/v1/add';
  GETALLMAILFIELDSDATA = 'mailFields/v1/getalldata';
  DELETEMAILFIELDDATA = 'mailFields/v1/deletebyid';
  MAILFIELDSSTATUSCHANGES = 'mailFields/v1/statuschanges';
  GETALLMAILTEMPLATETYPEBYID = 'mailFields/v1/getMailFieldsByMailType';

  //notificationPolicy
  ADDNOTIFICATIONPOLICY = 'notificationPolicy/v1/add';
  GETNOTIFICATIONDATABYCOMPANYID = 'notificationPolicy/v1/getNotificationPolicyDataByCompanyId/';
  TESTMAIL = 'notificationPolicy/v1/TestEmail';

  //mailTemplateEditor
  ADDMAILTEMPLATE = 'mailTemplateEditor/v1/add';
  GETALLTEMPLATEDATA = 'mailTemplateEditor/v1/getalldata';
  GETTEMPLATEDATABYID = 'mailTemplateEditor/v1/getbyid/';
  DELDATABYID = 'mailTemplateEditor/v1/deletebyid';
  MAILSTATUS = 'mailTemplateEditor/v1/statuschanges';
  EDITTEMPLATE = 'mailTemplateEditor/v1/updatebyid';

  //skillsets
  GETALLSKILLSET = 'skillsets/v1/getallskillset';
  SKILLSETDELETEBYID = 'skillsets/v1/deletebyid';
  SKILLSETSTATUSCHANGE = 'skillsets/v1/statuschanges';
  SKILLSETUPDATEBYID = 'skillsets/v1/updatebyid';
  GETSKILLSETBYID = 'skillsets/v1/getskillsetbyid/';
  ADDSKILLSET = 'skillsets/v1/addskillset';
  UPLOADEXCELSKILLSET = 'skillsets/v1/uploadexcel';
  GETALLSKILLSETSUSINGCOMPANYID = 'skillsets/v1/getAllSkillSetUsingCompanyID';

  //skillSetsForm
  SKILLSETSFORMADD = 'skillSetsForm/v1/add';
  SKILLSETSFORMUPDATEBYID = 'skillSetsForm/v1/updatebyid';
  SKILLSETSFORMDELETEBYID = 'skillSetsForm/v1/deletebyid';
  GETALLSKILLSETSFORM = 'skillSetsForm/v1/getalldata'; //NOT USED
  GETSKILLSETSFORMBYID = 'skillSetsForm/v1/getbyid/';
  GETSKILLSETSFORMBYCOMPANYID = 'skillSetsForm/v1/getbycompanyid';
  GETSKILLSETSQUESTIONS = 'skillSetsForm/v1/getskillsets'; //NOT USED
  GETSKILLSETSFORMSTATUSCHANGE = 'skillSetsForm/v1/statuschange';

  //monthlySkillsetsform
  MONTHLYSKILLSETSFORMADD = 'monthlySkillsetsform/v1/add';
  GETALLMONTHLYSKILLSETSFORM = 'monthlySkillsetsform/v1/getall';
  ADDSKILLSETSANSWERS = 'monthlySkillsetsform/v1/addSkillsetsAnswers';
  VERIFYSKILLSETSANSWERS = 'monthlySkillsetsform/v1/verifySkillsetsAnswers';
  GETBYMONTHLYSKILLSETSID = 'monthlySkillsetsform/v1/getbymonthlySkillsetsid/';
  GETMONTHLYSKILLSETSFORMUSERID = 'monthlySkillsetsform/v1/getbyuserid';
  UPDATESKILLSETSANSWERS = 'monthlySkillsetsform/v1/updateaSkillsetsAnswers';
  GETMONTHLYSKILLSETSFORMREPORTTOID = 'monthlySkillsetsform/v1/getbyreporttoid';
  SKILLSETSREPORT = 'monthlySkillsetsform/v1/skillsetsReport';
  USERSKILLSETSREPORT = 'monthlySkillsetsform/v1/userSkillsetsReport';

  //letterTamplateEditor
  ADDLETTEREDITOR = 'letterTamplateEditor/v1/add';
  GETALLLETTERDATA = 'letterTamplateEditor/v1/getalldata';
  GETLETTERDATABYID = 'letterTamplateEditor/v1/getbyid/';
  EDITLETTERBYID = 'letterTamplateEditor/v1/updatebyid';
  DELETELETTERBYID = 'letterTamplateEditor/v1/deletebyid';
  LETTERTEMPSTATUS = 'letterTamplateEditor/v1/statuschanges';

  //userLetters
  GETALLLETTERS = 'userLetters/v1/getAllUserLetter';
  ADDLETTERS = 'userLetters/v1/add';
  DELETEUSERLETTER = 'userLetters/v1/delete';
  UPDATEUSERLETTER = 'userLetters/v1/postUpdateUserLetters';
  OFFERLETTEREMAIL = 'userLetters/v1/offeremail';
  JOININGEMAIL = 'userLetters/v1/joinigemail';
  EXPERIENCEMAIL = 'userLetters/v1/experienceemail';
  TERNINATIONEMAIL = 'userLetters/v1/termination';
  APPIONTMENTEMAIL = 'userLetters/v1/appointment';

  //ticketCategory
  CREATETICKETCATEGORY = 'ticketCategory/v1';
  GETALLTICKETCATEGORY = 'ticketCategory/v1';
  GETONETICKETCATEGORY = 'ticketCategory/v1/';
  UPDATETICKETCATEGORY = 'ticketCategory/v1/';
  DELETETICKETCATEGORY = 'ticketCategory/v1/';

  //ticketSubCategory
  CREATETICKETSUBCATEGORY = 'ticketSubCategory/v1';
  GETALLTICKETSUBCATEGORY = 'ticketSubCategory/v1';
  GETONETICKETSUBCATEGORY = 'ticketSubCategory/v1/';
  UPDATETICKETSUBCATEGORY = 'ticketSubCategory/v1/';
  DELETETICKETSUBCATEGORY = 'ticketSubCategory/v1/';

  //ticket
  CREATETICKET = 'ticket/v1';
  GETALLTICKET = 'ticket/v1';
  GETONETICKET = 'ticket/v1/';
  UPDATETICKET = 'ticket/v1/';
  // DELETETICKET = "ticket/v1/";
  TICKETDASHBOARD = 'ticket/v1/report';
  GETALLTICKETDATA = 'ticket/v1/alldata';

  //attendanceCorrection
  GETALLATTENDACECORRECTION = 'attendanceCorrection/v1/getAlldata/';

  //policyDocument
  CREATEPOLICYDOCUMENT = 'policyDocument/v1';
  GETALLPOLICYDOCUMENT = 'policyDocument/v1';
  GETONEPOLICYDOCUMENT = 'policyDocument/v1/';
  UPDATEPOLICYDOCUMENT = 'policyDocument/v1/';
  DELETEPOLICYDOCUMENT = 'policyDocument/v1/';

  //moduleList
  CREATEMODULE = 'moduleList/v1/add';
  UPDATEMODULELIST = 'moduleList/V1/updatebyid';
  VIEWMODULELIST = 'moduleList/V1/getbyid/';
  DELETEMODULE = 'moduleList/V1/deletebyid';
  GETALLMODULE = 'moduleList/V1/getalldata';
  MODULESTATUS = 'moduleList/V1/statuschanges';
  UPLOADMODULEEXCELDATA = 'moduleList/v1/uploadexcel';

  //moduleDetails
  CREATEMODULEDETAILS = 'moduleDetails/v1/add';
  UPDATEMODULEDETAILS = 'moduleDetails/V1/updatebyid';
  VIEWMODULEDETAILS = 'moduleDetails/V1/getbyid/';
  DELETEMODULEDETALS = 'moduleDetails/V1/deletebyid';
  GETALLMODULEDETALS = 'moduleDetails/V1/getalldata';
  MODULEDETAILSSTATUS = 'moduleDetails/V1/statuschanges';
  UPLOADMODULEDETAILSEXCEL = 'moduleDetails/v1/uploadexcel';

  //checkList
  GETALLCHECKLISTDATA = 'checkList/v1/getAllCheckList';
  CHANGESTATUSCHECKLIST = 'checkList/v1/poststatuschange';
  CREATECHECKLISTDATA = 'checkList/v1/postAddCheckList';
  VIEWCHECKLISTDATA = 'checkList/v1/getCheckListById/';
  UPDATECHECKLIST = 'checkList/v1/postUpdateCheckList';

  //checkListQuestion
  GETALLCHECKISTQBYUSER = 'checkListQuestion/v1/getCheckListQuestionByuserId/';
  CREATECHECKLISTQUESTIONDATA = 'checkListQuestion/v1/postAddCheckListQuestion';
  GETALLCHECKLISTQUESTIONDATA = 'checkListQuestion/v1/getAllCheckListQuestion';
  CHANGESTATUSCHECKLISTQUESTION = 'checkListQuestion/v1/poststatuschangeCheckListQuestion';
  UPDATECHECKLISTQUESTION = 'checkListQuestion/v1/postUpdateCheckListQuestion';
  GETBYIDCHECKLISTQUESTION = 'checkListQuestion/v1/getCheckListQuestionById/';

  //usercheckList
  ADDUSERCHECKLIST = 'usercheckList/v1/AddUserChecklist';
  GETUSERCHECKLISTBYID = 'usercheckList/v1/getByIdUserChecklist/';
  UPDATEUSERCHECKLIST = 'usercheckList/v1/updateByIdUserChecklist';
  GETALLUSERCHECKLIST = 'usercheckList/v1/getByUserChecklist';
  GETALLCHECKISTBYUSER = 'usercheckList/v1/getCheckListbyUserID/';
  LISTADMINCHECKLIST = 'usercheckList/v1/listAdminCheckList';
  GETCHECKLISTBYUSERDATE = 'usercheckList/v1/getByDateandUserIDUserChecklist';

  //roleMaster
  ADDROLEMASTER = 'roleMaster/v1/postAddRoleMaster';
  GETROLEMASTERBYID = 'roleMaster/v1/getRoleMasterById/';
  UPDATEROLEMASTER = 'roleMaster/v1/postUpdateRoleMaster';
  LISTROLEMASTER = 'roleMaster/v1/listRoleMaster';
  ASSIGNROLE = 'roleMaster/v1/AssignRoleMaster';
  LISTUSERPERMISSION = 'roleMaster/v1/listUserPermission';

  //sentimentPunchIn
  SENTIMENTPUNCHINAPI = 'sentimentPunchIn/v1';
  SENTIMENTANALYSIS = 'sentimentPunchIn/v1/analysis';
  GETSENTIMENTPUNCHINAPI = 'sentimentPunchIn/v1/getdata';

  //workingLocation
  GETWORKINGLOCATION = 'workingLocation/v1/getworkinglocationReports';
  DELETEWORKINGLOCATION = 'workingLocation/v1/deletebyid';
  WORKINGLOCATIONSTATUSCHANGE = 'workingLocation/v1/statuschange';
  CREATEWORKINGLOCATION = 'workingLocation/v1/add';
  VIEWWORKINGLOCATION = 'workingLocation/v1/getbyid/';
  UPDATEWORKINGLOCATION = 'workingLocation/v1/updatebyid';
  UPLOADEXCELWORKINGLOCATION = 'workingLocation/v1/uploadexcel';
  VALIDATEWORKINGLOCATIONEXCEL = 'workingLocation/v1/validateExcel';
  REVALIDATEWORKINGLOCATIONDATA = 'workingLocation/v1/revalidateWorkingLocation';
  ADDVALIDATEWORKINGLOCATION = 'workingLocation/v1/addValidateWorkingLocation';
  GENERATEWORKINGLOCATIONDEMOEXCEL = 'workingLocation/v1/generateDemoExcel';

  //employeeWorkingLocation
  ADDEMPLOYEEWORKINGLOCATION = 'employeeWorkingLocation/v1/add';
  GETWORKINGLOCATIONBYUSERID = 'employeeWorkingLocation/v1/getbyuserid/';
  DELETEEMPLOYEEWORKINGLOCATION = 'employeeWorkingLocation/v1/deletebyid';
  GETEMPLOYEEWORKINGLOCATION = 'employeeWorkingLocation/v1/getEmployeeWorkingLocation';
  ADDBULKEMPLOYEEWORKINGLOCATION = 'employeeWorkingLocation/v1/addbulk';

  //goal
  GETALLGOAL = 'goal/v1';
  DELETEGOAL = 'goal/v1/';
  CREATEGOAL = 'goal/v1';
  GETONEGOAL = 'goal/v1/';
  UPDATEGOAL = 'goal/v1/';

  //kra
  GETALLKRA = 'kra/v1';
  CREATEKRA = 'kra/v1'; //NOT USED
  GETONEKRA = 'kra/v1/'; //NOT USED
  UPDATEKRA = 'kra/v1/'; //NOT USED
  DELETEKRA = 'kra/v1/'; //NOT USED

  //kpi
  GETALLKPI = 'kpi/v1';
  DELETEKPI = 'kpi/v1/'; //NOT USED
  CREATEKPI = 'kpi/v1'; //NOT USED
  GETONEKPI = 'kpi/v1/'; //NOT USED
  UPDATEKPI = 'kpi/v1/'; //NOT USED

  // incomeTaxSlabMaster
  ADDINCOMETAXSLABMASTER = 'incomeTaxSlabMaster/v1/add';
  UPDATEINCOMETAXSLABMASTER = 'incomeTaxSlabMaster/v1/';
  UPDATESTATUSINCOMETAXSLABMASTER = 'incomeTaxSlabMaster/v1/updatestatus/';
  GETALLDATAINCOMETAXSLABMASTER = 'incomeTaxSlabMaster/v1/getAllData';
  GETBYIDINCOMETAXSLABMASTER = 'incomeTaxSlabMaster/v1/getById/';

  // incomeTaxSlabs
  ADDINCOMETAXSLAB = 'incomeTaxSlabs/v1/add';
  UPDATEINCOMETAXSLAB = 'incomeTaxSlabs/v1/';
  UPDATESTATUSINCOMETAXSLAB = 'incomeTaxSlabs/v1/updatestatus/';
  GETALLDATAINCOMETAXSLAB = 'incomeTaxSlabs/v1/getAllData';
  GETBYIDINCOMETAXSLAB = 'incomeTaxSlabs/v1/getById/';

  //employeeGoal
  GETALLEMPLOYEEGOAL = 'employeeGoal/v1';
  BULKCREATEEMPLOYEEGOAL = 'employeeGoal/v1';
  UPDATEEMPLOYEEGOAL = 'employeeGoal/v1/';
  GETONEEMPLOYEEGOAL = 'employeeGoal/v1/';
  DELETEEMPLOYEEGOAL = 'employeeGoal/v1/';

  //pmsPolicy
  GETALLPMSPOLICY = 'pmsPolicy/v1';
  DELETEPMSPOLICY = 'pmsPolicy/v1/';
  CREATEPMSPOLICY = 'pmsPolicy/v1';
  UPDATEPMSPOLICY = 'pmsPolicy/v1/';
  GETONEPMSPOLICY = 'pmsPolicy/v1/';

  //LateEarlyPolicy
  ADDLATEEARLYPOLICY = 'LateEarlyPolicy/v1/add';
  UPDATEEARLYPOLICY = 'LateEarlyPolicy/v1/update';
  GETBYIDEARLYPOLICY = 'LateEarlyPolicy/v1/getbyid/';
  STATUSCHANGEEARLYPOLICY = 'LateEarlyPolicy/v1/statuschange';
  GETALLEARLYPOLICY = 'LateEarlyPolicy/v1/list';
  DELETELATEEARLYPOLICY = 'LateEarlyPolicy/v1/deleteById/';

  //EmployeeLateEarlyPolicyRoutes
  ADDEMPLOYEELATEEARLYPOLICY = 'EmployeeLateEarlyPolicyRoutes/v1/add';
  GETBYUSERIDELATEEARLYPOLICY = 'EmployeeLateEarlyPolicyRoutes/v1/getbyuserid/';
  UPDATEELATEEARLYPOLICY = 'EmployeeLateEarlyPolicyRoutes/v1/updatebyid'; // NOT USED
  DELETEELATEEARLYPOLICY = 'EmployeeLateEarlyPolicyRoutes/v1/deletebyid';
  GETALLELATEEARLYPOLICY = 'EmployeeLateEarlyPolicyRoutes/v1/getLateEarlyPolicy';
  ADDBULKELATEEARLYPOLICY = 'EmployeeLateEarlyPolicyRoutes/v1/postAddAllPolicyBULK';

  //goalSetting
  GETALLGOALSETTING = 'goalSetting/v1';
  DELETEGOALSETTING = 'goalSetting/v1/';
  CREATEGOALSETTING = 'goalSetting/v1';
  UPDATEGOALSETTING = 'goalSetting/v1/';
  GETONEGOALSETTING = 'goalSetting/v1/';

  //userInbox
  GETUSERINBOXDATA = 'userInbox/v1/getUserInboxData';
  DELETEUSERINBOX = 'userInbox/v1/delete';

  //reviewForm
  GETALLREVIEWFORM = 'reviewForm/v1';
  GETONEREVIEWFORM = 'reviewForm/v1/';
  DELETEREVIEWFORM = 'reviewForm/v1/';
  CREATEREVIEWFORM = 'reviewForm/v1';
  UPDATEREVIEWFORM = 'reviewForm/v1/';

  //reviewFormAnswer
  CREATEUPDATEREVIEWFORMANSWERS = 'reviewFormAnswer/v1';
  GETONEREVIEWFORMANSWERS = 'reviewFormAnswer/v1/'; // NOT USED
  GETALLREVIEWFORMANSWERS = 'reviewFormAnswer/v1'; // NOT USED

  //tdsSubSection
  ADDTDSSUBSECTION = 'tdsSubSection/v1/add';
  UPDATETDSSUBSECTION = 'tdsSubSection/v1/';
  UPDATESTATUSTDSSUBSECTION = 'tdsSubSection/v1/updatestatus/';
  GETALLDATATDSSUBSECTION = 'tdsSubSection/v1/getAllData';
  GETBYIDTDSSUBSECTION = 'tdsSubSection/v1/getById/';
  UPLOADSUBSECTIONEXCEL = 'tdsSubSection/v1/uploadSubSection';

  // tdsSection
  ADDTDSSECTION = 'tdsSection/v1/add';
  UPDATETDSSECTION = 'tdsSection/v1/';
  UPDATESTATUSTDSSECTION = 'tdsSection/v1/updatestatus/';
  GETALLDATATDSSECTION = 'tdsSection/v1/getAllData';
  GETBYIDTDSSECTION = 'tdsSection/v1/getById/';
  UPLOADSECTIONEXCEL = 'tdsSection/v1/uploadSection';

  //employeeTaxRegime
  ADDEMPLOYEETAXREGIME = 'employeeTaxRegime/v1/add';
  UPDATEEMPLOYEETAXREGIME = 'employeeTaxRegime/v1/';
  DELETEEMPLOYEETAXREGIME = 'employeeTaxRegime/v1/';
  GETEMPLOYEETAXREGIMEBYID = 'employeeTaxRegime/v1/getbyid/';
  GETEMPLOYEETAXREGIMELIST = 'employeeTaxRegime/v1/getlist';
  GETEMPFORADDREGIMELIST = 'employeeTaxRegime/v1/getnonRegimeUserlist';
  GETINCOMETAXREGIMEBYUSERID = 'employeeTaxRegime/v1/getByUserId';

  //performanceReview
  GETALLPERFORMANCEREVIEW = 'performanceReview/v1';
  GETONEPERFORMANCEREVIEW = 'performanceReview/v1/';
  DELETEPERFORMANCEREVIEW = 'performanceReview/v1/';
  CREATEPERFORMANCEREVIEW = 'performanceReview/v1';
  UPDATEPERFORMANCEREVIEW = 'performanceReview/v1/';

  //employeePerformanceReview
  GETALLEMPLOYEEPERFORMANCEREVIEW = 'employeePerformanceReview/v1';
  GETONEEMPLOYEEPERFORMANCEREVIEW = 'employeePerformanceReview/v1/';
  DELETEEMPLOYEEPERFORMANCEREVIEW = 'employeePerformanceReview/v1';
  CREATEEMPLOYEEPERFORMANCEREVIEW = 'employeePerformanceReview/v1';
  UPDATEEMPLOYEEPERFORMANCEREVIEW = 'employeePerformanceReview/v1/';
  EMPLOYEEPERFORMANCEREVIEWREPORT = 'employeePerformanceReview/v1/report';

  //tdsSubSectionCategory
  ADDTDSSUBSECTIONCATEGORY = 'tdsSubSectionCategory/v1/add';
  UPDATETDSSUBSECTIONCATEGORY = 'tdsSubSectionCategory/v1/update/';
  DELETETDSSUBSECTIONCATEGORY = 'tdsSubSectionCategory/v1/delete/';
  GETTDSSUBSECTIONCATEGORYBYID = 'tdsSubSectionCategory/v1/getById/';
  GETTDSSUBSECTIONCATEGORYLIST = 'tdsSubSectionCategory/v1/getlist';

  //employeeDeclaration
  ADDEMPLOYEEDECLARATION = 'employeeDeclaration/v1/add';
  GETEMPLOYEEDECLARATIONBYID = 'employeeDeclaration/v1/getbyid/'; // NOT USED
  UPDATEEMPLOYEEDECLARATION = 'employeeDeclaration/v1/update'; // NOT USED
  DELETEEMPLOYEEDECLARATION = 'employeeDeclaration/v1/delete';
  GETEMPLOYEEDECLARATIONLIST = 'employeeDeclaration/v1/getAll';
  ACCEPTREJECTEMPLOYEEDECLARATION = 'employeeDeclaration/v1/acceptReject';
  GETEMPLOYEEDECLARATIONBYUSERID = 'employeeDeclaration/v1/getByUserId';
  GETEMPLOYEEDECLARATIONDATAILS = 'employeeDeclaration/v1/getDeclarationDatailsByUserId';
  GETYEARLYEMPLOYEEINCOMETAX = 'employeeDeclaration/v1/getYearlyIncometaxCalculationByUserId';
  GETFINANCIALYEARS = 'employeeDeclaration/v1/getFinancialYear';
  GETMONTHLYTAXDEDUCTIONSOFEMPLOYEES = 'employeeDeclaration/v1/getMonthlyTaxDeductionsOfEmployees';
  ADDMANUALINCOMETAXAMOUNT = 'employeeDeclaration/v1/addManualInxomeTaxAmount';
  DELETEMANUALINCOMETAXAMOUNT = 'employeeDeclaration/v1/deleteManualAmount';
  GETINCOMETAXCOMPUTATION = 'employeeDeclaration/v1/getIncomeTaxComputation';
  EMPLOYEEDECLARATIONREPORT = 'employeeDeclaration/v1/getEmployeeDeclarationReport';

  // employeeGoalReview
  GETALLEMPLOYEEGOALREVIEW = 'employeeGoalReview/v1';
  GETONEEMPLOYEEGOALREVIEW = 'employeeGoalReview/v1/';
  DELETEEMPLOYEEGOALREVIEW = 'employeeGoalReview/v1/';
  CREATEEMPLOYEEGOALREVIEW = 'employeeGoalReview/v1';
  UPDATEEMPLOYEEGOALREVIEW = 'employeeGoalReview/v1';
  EMPLOYEEGOALREVIEWREPORT = 'employeeGoalReview/v1/report';
  ADDEMPLOYEEGOALREVIEW = 'employeeGoalReview/v1/add-review';
  DESIGNATIONWISEEMPLOYEEGOALREVIEWREPORT = 'employeeGoalReview/v1/designationWiseReport';

  //offerLetter
  ADDOFFERLETTER = 'offerLetter/v1/add';
  UPDATEOFFERLETTER = 'offerLetter/v1/update';
  DELETEOFFERLETTER = 'offerLetter/v1/delete';
  GETOFFERLETTER = 'offerLetter/v1/get';

  //employeeGatepass
  GETALLEMPLOYEEGATEPASS = 'employeeGatepass/v1';
  DELETEEMPLOYEEGATEPASS = 'employeeGatepass/v1/';
  CREATEEMPLOYEEGATEPASS = 'employeeGatepass/v1';
  GETONEEMPLOYEEGATEPASS = 'employeeGatepass/v1/';
  UPDATEEMPLOYEEGATEPASS = 'employeeGatepass/v1/';
  UPDATECHECKINOUTGATEPASS = 'employeeGatepass/v1/update';
  CREATEMYGATEPASS = 'employeeGatepass/addmygatepass';
  UPDATEMYGATEPASS = 'employeeGatepass/updatebyid/';

  //employeeLeavePolicy
  GETEMPLOYEELEAVEPOLICYDATA = 'employeeLeavePolicy/v1/';
  GETHRLEAVEDATA = 'employeeLeavePolicy/v1/getdatabyusercompany/';
  EMPLOYEELEAVEPOLICYSTATUSCHANGES = 'employeeLeavePolicy/v1/statuschange'; //NOT USED
  DELETEEMPLOYEELEAVEPOLICY = 'employeeLeavePolicy/v1/';
  CREATEEMPLOYEELEAVEPOLICY = 'employeeLeavePolicy/v1';
  EDITEMPLOYEELEAVEPOLICY = 'employeeLeavePolicy/v1/';
  GETEMPLOYEELEAVEPOLICYBYID = 'employeeLeavePolicy/v1/';
  GETEMPLOYEELEAVEPOLICYBYCOMPNAYID = 'employeeLeavePolicy/v1/getLeavePolicyBycompany/';

  //empShortLeavePolicy
  ADDEMPSHORTLEAVEPOLICYDATA = 'empShortLeavePolicy/v1/addData';
  GETEMPSHORTLEAVEPOLICYDATABYUSERID = 'empShortLeavePolicy/v1/getEmpShortLeavePolicyByUserId/';
  GETEMPSHORTLEAVEPOLICYDATABYCOMPANY = 'empShortLeavePolicy/v1/getEmpShortLeavePolicyByCompany';
  GETEMPLOYEESHORTLEAVEPOLICYBYCOMPNAYID = 'empShortLeavePolicy/v1/getShortLeavePolicyBycompany/';
  GETCURRENTEMPLOYEESHORTLEAVEPOLICY = 'empShortLeavePolicy/v1/getCurrentEmployeeShortLeavePolicy/';
  LISTUSERSHORTLEAVEFORCANCELSHORTLEAVE =
    'empShortLeavePolicy/v1/listUserShortLeaveForCancelShortLeave';
  CANCELSHORTLEAVE = 'empShortLeavePolicy/v1/cancelShortLeave';
  GETEMPLOYEESHORTLEAVEPOLICYBYCOMPANY = 'empShortLeavePolicy/v1/getEmpShortLeavePolicyByCompany';

  //companyNotificationSetup
  ADDCOMPANYNOTIFICATIONSETUP = 'companyNotificationSetup/v1/addData';
  UPDATECOMPANYNOTIFICATIONSETUP = 'companyNotificationSetup/v1/updateData/';
  GETCOMPANYNOTIFICATIONSETUPBYID = 'companyNotificationSetup//v1/getById/';
  GETCOMPANYNOTIFICATIONSETUPLIST = 'companyNotificationSetup/v1/getlist';
  DELETECOMPANYNOTIFICATIONSETUPBYID = 'companyNotificationSetup/v1/deleteById/';

  //SN_Code
  ADDSNCODES = 'SN_Code/v1/add';
  UPDATESNCODES = 'SN_Code/v1/update';
  STATUSCHANGESNCODES = 'SN_Code/v1/statuschange';
  GETALLSNCODES = 'SN_Code/v1/getAll';
  GETSNCODESBYID = 'SN_Code/v1/getById/';
  UPLOADSNCODES = 'SN_Code/v1/uploadSNCodes';

  // division
  ADDDIVISION = 'division/v1/addData';
  UPDATEDIVISION = 'division/v1/updateData/';
  LISTDIVISION = 'division/v1/listData';
  DELETEDIVISION = 'division/v1/deleteData/';
  GETDIVISIONBYID = 'division/v1/getById/';
  UPLOADDIVISIONEXCEL = 'division/v1/uploadExcel';
  DEMODIVISIONEXCEL = 'division/v1/demoExcel'; //NOT USED
  UPDATEDIVISIONSTATUS = 'division/v1/updateStatus';
  VALIDATEDIVISIONEXCEL = 'division/v1/validateExcel';
  REVALIDATEDIVISONNDATA = 'division/v1/reValidateDivision';
  ADDVALIDATEDDIVISION = 'division/v1/addValidateDivision';

  //workingArea
  ADDWORKINGAREA = 'workingArea/v1/addData';
  UPDATEWORKINGAREA = 'workingArea/v1/updateData/';
  LISTWORKINGAREA = 'workingArea/v1/listData';
  DELETEWORKINGAREA = 'workingArea/v1/deleteData/';
  GETWORKINGAREABYID = 'workingArea/v1/getById/';
  UPLOADWORKINGAREAEXCEL = 'workingArea/v1/uploadExcel';
  DEMOWORKINGAREAEXCEL = 'workingArea/v1/demoExcel'; //NOT USED
  UPDATEWORKINGAREASTATUS = 'workingArea/v1/updateStatus';
  VALIDATEWORKINGAREAEXCEL = 'workingArea/v1/validateExcel';
  REVALIDATEWORKINGAREADATA = 'workingArea/v1/reValidateWorkingArea';
  ADDVALIDATEDWORKINGAREA = 'workingArea/v1/addValidateWorkingArea';

  //employeeDivision
  ADDEMPLOYEEDIVISION = 'employeeDivision/v1/addData';
  GETEMPLOYEEDIVISIONBYUSERID = 'employeeDivision/v1/getByUserId/';
  BULKADDEMPLOYEEDIVISION = 'employeeDivision/v1/addbulk';
  GETDIVISIONBYCOMPANYID = 'employeeDivision/v1/getDataBycompanyId/';
  GETEMPLOYEEDIVISIONDATA = 'employeeDivision/v1/getEmployeeDivisionByCompany';
  DEMOEXCELOFEMPLOYEEDIVISION = 'employeeDivision/v1/downloadDemoExcel';
  UPLOADEMPLOYEEDIVISIONEXCEL = 'employeeDivision/v1/uploadDivision';
  DELETEEMPLOYEEDIVISIONDATA = 'employeeDivision/v1/deletebyid';

  //employeeWorkingArea
  ADDEMPLOYEEWORKINGAREA = 'employeeWorkingArea/v1/addData';
  GETEMPLOYEEWORKINGAREABYUSERID = 'employeeWorkingArea/v1/getByUserId/';
  BULKADDEMPLOYEEWORKINGAREA = 'employeeWorkingArea/v1/addbulk';
  GETWORKINGAREABYCOMPANYID = 'employeeWorkingArea/v1/getDataBycompanyId/';
  GETEMPLOYEEWORKINGAREADATA = 'employeeWorkingArea/v1/getEmployeeWorkingAreaByCompany';
  DEMOEXCELOFEMPLOYEEWORKINGAREA = 'employeeWorkingArea/v1/downloadDemoExcel';
  UPLOADEMPLOYEEWORKINGAREAEXCEL = 'employeeWorkingArea/v1/uploadWorkingArea';
  DELETEEMPLOYEEWORKINGAREADATA = 'employeeWorkingArea/v1/deletebyid';

  //autoMailSetup
  ADDAUTOMAILSETUP = 'autoMailSetup/v1/addData';
  UPDATEAUTOMAILSETUP = 'autoMailSetup/v1/updateData/';
  LISTAUTOMAILSETUP = 'autoMailSetup/v1/listData';
  DELETEAUTOMAILSETUP = 'autoMailSetup/v1/deleteData/';
  GETBYIDAUTOMAILSETUP = 'autoMailSetup/v1/getById/';

  //previousSalary
  PREVIOUSSALARYDEMOEXCEL = 'previousSalary/v1/getDemoExcel';
  UPLOADPREVIOUSSALARYEXCEL = 'previousSalary/v1/uploadExcel';
  GETPREVIOUSSALARYDATA = 'previousSalary/v1/getPreviousSalaryData';
  DELETEPREVIOUSSALARY = 'previousSalary/v1/delete';

  //contractor
  ADDCONTRACTOR = 'contractor/v1/add';
  GETALLDATA = 'contractor/v1/listdata';
  EDITDATA = 'contractor/v1/editdata/';
  DELETEDATA = 'contractor/v1/deletedata/';
  GETIDDATA = 'contractor/v1/getdata/';
  STATUSCHANGE = 'contractor/v1/poststatuschange';
  VALIDATECONTRACTOREXCEL = 'contractor/v1/validateExcel';
  REVALIDATECONTRACTORDATA = 'contractor/v1/revalidateContractor';
  ADDVALIDATECONTRACTOR = 'contractor/v1/addValidateContractor';
  GENERATECONTRACTORDEMOEXCEL = 'contractor/v1/generateDemoExcel';

  //employeeRentedResidence
  ADDEMPLOYEERENTEDRESIDENCE = 'employeeRentedResidence/v1/addData';
  GETEMPLOYEEDATAOFRENTEDRESIDENCE = 'employeeRentedResidence/v1/getData';
  DELETEEMPLOYEEDATAOFRENTEDRESIDENCE = 'employeeRentedResidence/v1/delete';
  GETLISTEMPLOYEEDATAOFRENTEDRESIDENCE = 'employeeRentedResidence/v1/getAll';
  ACCEPTREJECTEMPLOYEEDATAOFRENTEDRESIDENCE = 'employeeRentedResidence/v1/acceptReject';

  //joiningLetter
  ADDJOININGLETTER = 'joiningLetter/v1/add';
  UPDATEJOININGLETTER = 'joiningLetter/v1/update';
  DELETEJOININGLETTER = 'joiningLetter/v1/delete';
  GETJOININGLETTER = 'joiningLetter/v1/get';

  //attendanceBonusPolicy
  ATTENDANCEBONUSPOLICYADD = 'attendanceBonusPolicy/v1/add';
  ATTENDANCEBONUSPOLICYGETALLDATA = 'attendanceBonusPolicy/v1/listdata';
  ATTENDANCEBONUSPOLICYEDITDATA = 'attendanceBonusPolicy/v1/editdata/';
  ATTENDANCEBONUSPOLICYDELETEDATA = 'attendanceBonusPolicy/v1/deletedata/';
  ATTENDANCEBONUSPOLICYGETIDDATA = 'attendanceBonusPolicy/v1/getdata/';
  ATTENDANCEBONUSPOLICYSTATUSCHANGE = 'attendanceBonusPolicy/v1/poststatuschange';
  GETACITVEDATA = 'attendanceBonusPolicy/v1/getactivedata/';

  //employeeattendancebonuspolicy
  EMPLOYEEATTENDANCEDATA = 'employeeattendancebonuspolicy/v1/getbyuserid/';
  EMPLOYEEADDDATA = 'employeeattendancebonuspolicy/v1/add';
  // UPDATEDATA = 'employeeattendancebonuspolicy/v1/updatebyid';
  // DELETEBONUSDATA = 'employeeattendancebonuspolicy/v1/deletebyid';
  // STATUSCHANGEBONUS = 'employeeattendancebonuspolicy//v1/statuschanges';
  // GETALLDATABONUS = 'employeeattendancebonuspolicy/v1/getAlldata';
  GETALLBULKDATA = 'employeeattendancebonuspolicy/v1/getbulk';
  ADDBULKDATA = 'employeeattendancebonuspolicy/v1/addbulk';

  // foodAllowancePolicy
  ADDFOODALLOWANCEPOLICY = 'foodAllowancePolicy/v1/addData';
  UPDATEFOODALLOWANCEPOLICY = 'foodAllowancePolicy/v1/updateData/';
  LISTFOODALLOWANCEPOLICY = 'foodAllowancePolicy/v1/listData';
  DELETEFOODALLOWANCEPOLICY = 'foodAllowancePolicy/v1/deleteData/';
  GETFOODALLOWANCEPOLICYBYID = 'foodAllowancePolicy/v1/getById/';
  UPDATEFOODALLOWANCEPOLICYSTATUS = 'foodAllowancePolicy/v1/updateStatus';

  //employeeFoodAllowancePolicy
  GETEMPLOYEEFOODALLOWANCEPOLICYBYUSERID = 'employeeFoodAllowancePolicy/v1/getByUserId/';
  BULKADDEMPLOYEEFOODALLOWANCEPOLICY = 'employeeFoodAllowancePolicy/v1/addbulk';
  GETFOODALLOWANCEPOLICYBYCOMPANYID = 'employeeFoodAllowancePolicy/v1/getDataBycompanyId/';
  GETEMPLOYEEFOODALLOWANCEPOLICYDATA =
    'employeeFoodAllowancePolicy/v1/getEmployeeFoodAllowancePolicyByCompany';

  //empLeavePolicy
  ADDEMPLEAVEPOLICYDATA = 'empLeavePolicy/v1/addData';
  GETEMPLEAVEPOLICYDATABYUSERID = 'empLeavePolicy/v1/getEmpLeavePolicyByUserId/';
  GETEMPLEAVEPOLICYDATABYCOMPANY = 'empLeavePolicy/v1/getEmpLeavePolicyByCompany';
  GETCURRENTEMPLOYEELEAVEPOLICY = 'empLeavePolicy/v1/getCurrentEmployeeLeavePolicy/';

  //shortLeave
  CREATESHORTLEAVE = 'shortLeave/v1/add';
  UPDATESHORTLEAVE = 'shortLeave/v1/update';
  GETSHORTLEAVEDATA = 'shortLeave/v1/getalldata';
  UPDATESHORTLEAVESTATUS = 'shortLeave/v1/updateStatus';
  DELETESHORTLEAVE = 'shortLeave/v1/deleteShortLeave/';

  //experienceLetter
  ADDEXPEROENCELETTER = 'experienceLetter/v1/add';
  UPDATEEXPEROENCELETTER = 'experienceLetter/v1/update';
  DELETEEXPEROENCELETTER = 'experienceLetter/v1/delete';
  GETEXPEROENCELETTER = 'experienceLetter/v1/get';

  //incrementLetter
  ADDINCREMENTLETTER = 'incrementLetter/v1/add';
  UPDATEINCREMENTLETTER = 'incrementLetter/v1/update';
  DELETEINCREMENTLETTER = 'incrementLetter/v1/delete';
  GETINCREMENTLETTER = 'incrementLetter/v1/get';

  //terminationLetter
  ADDTERMINATIONLETTER = 'terminationLetter/v1/add';
  GETTERMINATIONLETTER = 'terminationLetter/v1/get';
  UPDATETERMINATIONLETTER = 'terminationLetter/v1/update';
  DELETETERMINATIONLETTER = 'terminationLetter/v1/delete';

  //userIncrementLetter
  INCREMENTEMAIL = 'userIncrementLetter/v1/incrementeemail';
  GETALLUSERINCREMENT = 'userIncrementLetter/v1/getAllLetter';
  ADDUSERINCREMENTLETTER = 'userIncrementLetter/v1/add';
  UPDATEUSERINCREMENT = 'userIncrementLetter/v1/updateLetter';
  DELETEUSERINCREMENT = 'userIncrementLetter/v1/delete';

  //aibiometric
  ADDAIBIOMETRIC = 'aibiometric/v1/add';
  GETAIBIOMETRIC = 'aibiometric/v1/get';
  UPDATEAIBIOMETRIC = 'aibiometric/v1/update';
  GETIDAIBIOMETRIC = 'aibiometric/v1/getById/';

  //employeeJoiningRequest
  ADDEMPLOYEEJOININGREQUEST = 'employeeJoiningRequest/v1/addemployeeJoiningRequest';
  GETALLEMPLOYEEJOININGREQUESTS = 'employeeJoiningRequest/v1/getallemployeeJoiningRequest';
  GETEMPLOYEEJOININGREQUESTBYID = 'employeeJoiningRequest/v1/getEmployeeJoiningRequestById/';
  EDITEMPLOYEEJOININGREQUEST = 'employeeJoiningRequest/v1/editAllEmployeeJoiningRequest';
  EDITSTATUSEMPLOYEEJOININGREUEST = 'employeeJoiningRequest/v1/editStatusEmployeeJoiningRequest';
  REMOVEJOININGREQUESTIMAGE = 'employeeJoiningRequest/v1/removeImages';
  EMPLOYEEJOININGREQUESTFROMPDF = 'employeeJoiningRequest/v1/employeejoiningRequestFormDownload';

  //anonymousFeedback
  ADDANONYMOUSFEEDBACK = 'anonymousFeedback/v1/add';
  GETANONYMOUSFEEDBACK = 'anonymousFeedback/v1/get';

  //uniform
  ADDUNIFORMDETAIL = 'uniform/v1/addUniformData';
  GETALLUNIFORMDETAILDATA = 'uniform/v1/listUniformData';
  EDITUNIFORMDETAILDATA = 'uniform/v1/editUniformData';
  GETUNIFORMDETAILDATABYID = 'uniform/v1/getUniformDataByID/';
  GETUNIFORMDETAILDATABYUSERMASTERID = 'uniform/v1/getUniformDataByUserMasterID/';
  DELETEUNIFORMDETAILDATA = 'uniform/v1/deleteUniformData/';

  //userIp
  ADDUSERIP = 'userIp/v1/add';
  GETUSERIP = 'userIp/v1/get';
  UPDATEUSERIP = 'userIp/v1/editdata/';
  DELETEUSERIP = 'userIp/v1/deleteip';
  GETBYUSERIP = 'userIp/v1/getById/';

  //dealerPlan
  ADDDEALERPLAN = 'dealerPlan/v1/add';
  GETDEALERPLAN = 'dealerPlan/v1/listdata';
  EDITDEALERPLAN = 'dealerPlan/v1/editdata/';
  GETIDDEALERPLAN = 'dealerPlan/v1/getdata/';
  DELETEDEALERPLAN = 'dealerPlan/v1/deletedata/';
  STATUSCHANGEDEALERPLAN = 'dealerPlan/v1/poststatuschange';

  //gatepassauthorization
  GATEPASSAUTHORIZATIONREQUEST = 'gatepassauthorization/gatepassauthorizationrequest';
  AUTHREQUESTACCEPTREJECTGATEPASS = 'gatepassauthorization/authorizationacceptreject';
  GETGATEPASSAUTORIZEDUSER = 'gatepassauthorization/gatePassAuthorizeduser';
  GETGATEPASSDATABYREFERENCEID = 'gatepassauthorization/gatepassrequestdatabyid/';

  //leadMaster
  GETALLLEADMASTERDATA = 'leadMaster/v1/getallLead';

  //attendanceCorrectionRequest
  ADDATTENDANCECORRECTIONREQUEST = 'attendanceCorrectionRequest/v1/add';
  UPDATEATTENDANCECORRECTIONREQUEST = 'attendanceCorrectionRequest/v1/update/';
  LISTATTENDANCECORRECTIONREQUEST = 'attendanceCorrectionRequest/v1/getByUserId';
  GETATTENDANCECORRECTIONBYID = 'attendanceCorrectionRequest/v1/getById/';
  DELETEATTENDANCECORRECTIONREQUEST = 'attendanceCorrectionRequest/v1/delete/';

  //attendanceCorrectionAuthorization
  AUTHREQUESTACCEPTREJECTATTENDANCE =
    'attendanceCorrectionAuthorization/attendancecorrectionauthorizationrequest';
  GETATTENDANCEAUTHORIZEDUSER = 'attendanceCorrectionAuthorization/getAuthorizedUser';
  LISTATTENDANCEAUTHORIZATIONREQUEST =
    'attendanceCorrectionAuthorization/listAttendaceAuthorization';
  GETATTENDANCEDATABYREQUESTID =
    'attendanceCorrectionAuthorization/attendanceauthorizationdatabyid/';

  //compensatoryOffAuthorizationRequest
  COMPENSATORYOFFAUTHORIZATIONREQUEST =
    'compensatoryOffAuthorizationRequest/viewcompensatoryOffAuthorizationByUserId';
  COMPENSATORYOFFAUTHREQUESTACCEPTREJECT =
    'compensatoryOffAuthorizationRequest/compensatoryOffAuthorizationacceptreject';
  GETCOMPENSATORYOFFAUTORIZEDUSER =
    'compensatoryOffAuthorizationRequest/compensatoryOffAuthorizationuser';
  GETCOMPENSATORYOFFDATABYREFERENCEID =
    'compensatoryOffAuthorizationRequest/getcompensatoryOffAuthorizationRequestById/';

  //erpIngegration
  ADDERPINTEGRATION = 'erpIngegration/v1/add';
  UPDATEERPINTEGRATION = 'erpIngegration/v1/editdata/';
  DELETEERPINTEGRATION = 'erpIngegration/v1/deletedata/';
  GETERPINTEGRATION = 'erpIngegration/v1/listdata';
  GETERPINTEGRATIONID = 'erpIngegration/v1/getdata/';
  ERPEXPENSEHEAD = 'erpIngegration/v1/erpHeadName';

  //biometricUser
  // ADDBIOMETRICUSER = 'biometricUser/v1/add';
  // GETBIOMETRICUSER = 'biometricUser/v1/get';
  ADDBIOMETRICUSER = 'biometricUser/v1/add';
  GETBIOMETRICUSER = 'biometricUser/v1/get';
  SYNCBIOMETRICUSER = 'biometricUser/v1/syncbiometric';
  DELETEBIOMETRICUSER = 'biometricUser/v1/deletebiometric';
  BIOMETRICUSERCHANGE = 'biometricUser/v1/changeRecord';
  BIOMETRICGETBYID = 'biometricUser/v1/getById/';
  EDITBIOMETRICUSER = 'biometricUser/v1/update';
  TRANSFERBIOMETRICUSER = 'biometricUser/v1/transferUser';

  //appointmentLetter
  ADDAPPOINMENTLETTER = 'appointmentLetter/v1/add';
  GETAPPOINMENTLETTER = 'appointmentLetter/v1/get';
  UPDATEAPPOINMENTLETTER = 'appointmentLetter/v1/update';
  DELETEAPPOINMENTLETTER = 'appointmentLetter/v1/delete';

  //companyServiceStatus
  ADDCOMPANYSERVICESTATUS = 'companyServiceStatus/v1/add';
  GETCOMPANYSERVICESSTATUS = 'companyServiceStatus/v1/listdata';
  UPDATECOMPANYSERVICESTATUS = 'companyServiceStatus/v1/editdata/';
  GETCOMPANYSERVICESSTATUSBYID = 'companyServiceStatus/v1/getdata/';
  DELETECOMPANYSERVICESSTATUS = 'companyServiceStatus/v1/deletedata/';
  STATUSCOMPANYSERVICESSTATUS = 'companyServiceStatus/v1/statuschange';

  //companyProgress
  ADDCOMPANYPROGRESS = 'companyProgress/v1/add';
  GETCOMPANYPROGRESS = 'companyProgress/v1/getdatabyCompanyId';
  GETBYIDCOMPANYPROGRESS = 'companyProgress/v1/getById/';
  UPDATECOMPANYPROGRESS = 'companyProgress/v1/updatedata/';
  DELETECOMPANYPROGRESS = 'companyProgress/v1/deletedata/';
  COMPANYPROGRESSHISTORY = 'companyProgress/v1/gethistroydata';

  //weekoffShuffle
  ADDWEEKOFFSHUFLLE = 'weekoffShuffle/v1/add';
  GETWEEKOFFSHUFLLE = 'weekoffShuffle/v1/getdata';
  GETWEEKOFFSHUFLLEBYID = 'weekoffShuffle/v1/getById/';
  UPDATEWEEKOFFSHUFLLE = 'weekoffShuffle/v1/updatedata/';
  DELETEWEEKOFFSHUFLLE = 'weekoffShuffle/v1/deletedata/';
  CHANGEWEEKOFF = 'weekoffShuffle/v1/changeWeekOff';

  //auditLogs
  GETAUDITTABLENAME = 'auditLogs/v1/getTableNames';
  GETALLAUDITLOGS = 'auditLogs/v1/getAll';

  //companyTraining
  ADDCOMPANYTRAINING = 'companyTraining/v1/add';
  GETCOMPANYTRAINING = 'companyTraining/v1/listdata';
  GETCOMPANYTRAININGBYID = 'companyTraining/v1/getbyid/';
  UPDATECOMPANYTRAINING = 'companyTraining/v1/editby/';
  DELETECOMPANYTRAINING = 'companyTraining/v1/deleteby/';

  //resigantionReason
  ADDRESIGNATIONREASON = 'resigantionReason/v1/add';
  EDITRESIGNATIONREASON = 'resigantionReason/v1/edit/';
  LISTRESIGNATIONREASON = 'resigantionReason/v1/getall';
  GETRESIGNATIONREASONBYID = 'resigantionReason/v1/getbyid/';
  DELETERESIGNATIONREASON = 'resigantionReason/v1/delete/';

  //joiningDocumentType
  ADDJOININGDOCUMENTTYPE = 'joiningDocumentType/v1/addJoinoingDocumentType';
  GETALLJOININGDOCUMENTTYPE = 'joiningDocumentType/v1/gettAlljoiningDocumentTypeData';
  GETJOININGDOCUMENTTYPEBYID = 'joiningDocumentType/v1/getjoiningDocumentTypeById';
  UPDATEJOININGDOCUMENTTYPE = 'joiningDocumentType/v1/updatejoiningDocumentType';
  STATUSCHANGEJOININGDOCUMENTTYPE = 'joiningDocumentType/v1/statusChangesjoiningDocumentType';
  DELETEJOININGDOCUMENTTYPE = 'joiningDocumentType/v1/deletejoiningDocumentType';

  //designationWiseDocument
  GETJOININGDOCUMENTTYPEBYCOMPANYUMASTERID =
    'designationWiseDocument/v1/getjoiningDocumentTypeByCompanyMasterID';
  ADDDESIGNATIONWISEDOCUMENT = 'designationWiseDocument/v1/addDesignationWiseDocument';
  GETALLDESIGNATIONWISEDOCUMENT = 'designationWiseDocument/v1/listDesignationWiseDocument';
  GETDESIGNATIONWISEDOCUMENTBYDESIGNATIONID =
    'designationWiseDocument/v1/getdesignationWiseDocumentByDesignationID';
  EDITDESIGNATIONWISEDOCUMENT = 'designationWiseDocument/v1/editDesignationWiseDocument';
  DELETEDESIGNATIONWISEDOCUMENT = 'designationWiseDocument/v1/deleteDesignationWiseDocument';
  GETDOCUMENTBYDESIGNATIONIDANDREQUIREDUSERTYPE =
    'designationWiseDocument/v1/getDocumentByDesignationIDAndRequiredUserType';
  GETDOCUMENTBYDESIGNATIONIDANDREQUIREDUSERTYPEOPEN =
    'designationWiseDocument/v1/getDocumentByDesignationIDAndRequiredUserTypeOpen';
  GENERATEDEMOEXCELDESIGNATIONWISEDOCUMENT = 'designationWiseDocument/v1/generateDemoExcel';
  VALIDATEEMPLOYEEDESIGNATIONWISEDOCUMENT = 'designationWiseDocument/v1/validateExcel';
  REVALIDATEDESIGNATIONWISEDOCUMENTDATA =
    'designationWiseDocument/v1/revalidateDesignationWiseDocument';
  ADDVALIDATEDESIGNATIONWISEDOCUMENT =
    'designationWiseDocument/v1/addValidateDesignationWiseDocument';

  //jobPosting
  ADDJOBPOSTING = 'jobPosting/v1/addJobPosting';
  LISTJOBPOSTING = 'jobPosting/v1/listJobPostingData';
  GETJOBPOSTINGBYID = 'jobPosting/v1/getJobPostingByID';
  EDITJOBPOSTING = 'jobPosting/v1/editJobPosting';
  DELETEJOBPOSTING = 'jobPosting/v1/deleteJobPosting';
  GETJOBPOSTBYSECRETKEY = 'jobPosting/v1/getJobPostingBySecrectKey';

  //joiningDocument
  ADDJOININGDOCUMENT = 'joiningDocument/v1/addJoiningDocument';
  GETJOININGDOCUMENTBYUSERID = 'joiningDocument/v1/getJoiningDocumentByUserMasterID';
  DELETEJOININGDOCUMENT = 'joiningDocument/v1/deleteJoiningDocument';
  GETJOININGDOCUMNETBYID = 'joiningDocument/v1/getJoiningDocumnetByID';
  EDITJOININGDOCUMENT = 'joiningDocument/v1/editJoiningDocument';
  RENEWJOININGDOCUMENT = 'joiningDocument/v1/renewJoiningDocument';
  GETJOININGDOCUMNETHISTORYBYID = 'joiningDocument/v1/getJoiningDocumnetHistroyByID';
  EXPIRYJOININGDOCUMNET = 'joiningDocument/v1/expiryJoiningDocument';

  //jobApplication
  ADDJOBAPPLICATION = 'jobApplication/v1/addJobApplication';
  LISTJOBAPPLICATION = 'jobApplication/v1/listJobApplication';
  GETJOBAPPLICATIONBYID = 'jobApplication/v1/getApplicationByID';
  JOBAPPLICATIONACCEPTREJECT = 'jobApplication/v1/jobApplicationAcceptreject';
  GETJOBAPPLICATIONBYIDWITHOUTTOKEN = 'jobApplication/v1/getApplicationByIDOpen';

  //shiftRoster
  ADDSHIFTROSTER = 'shiftRoster/v1/addShiftRoster';
  UPDATESHIFTROSTER = 'shiftRoster/v1/updateShiftRoster';
  GETALLSHIFTROSTER = 'shiftRoster/v1/listShiftRosterData';
  EXPORTDEMOEXCELSHIFTROSTER = 'shiftRoster/v1/exportDemoShiftRoster';
  VALIDATESHIFTROSTERSEXCEL = 'shiftRoster/v1/validateExcel';
  REVALIDATESHIFTROSTER = 'shiftRoster/v1/revalidateShiftRoster';
  ADDVALIDATESHIFTROSTER = 'shiftRoster/v1/addValidateShiftRoster';

  //bankBranch
  ADDBANKBRANCH = 'bankBranch/v1/addbankBranch';
  LISTBANKBRANCH = 'bankBranch/v1/listBankBranch';
  GETBANKBRANCHBYID = 'bankBranch/v1/getBankBranchByID';
  EDITBANKBRANCH = 'bankBranch/v1/editBankBranch';
  DELETEBANKBRANCH = 'bankBranch/v1/deleteBankBranch';
  STATUSCHNAGEBANKBRANCH = 'bankBranch/v1/statusChangeBankBranch';

  // discrepancyLetter
  ADDDISCREPANCYLETTER = 'discrepancyLetter/v1/addDiscrepancyLetter';
  UPDATEDISCREPANCYLETTER = 'discrepancyLetter/v1/updateDiscrepancyLetter';
  DELETEDISCREPANCYLETTER = 'discrepancyLetter/v1/deleteDiscrepancyLetter';
  GETDISCREPANCYLETTER = 'discrepancyLetter/v1/getDiscrepancyLetter';
  GETDISCREPANCYLETTERBYID = 'discrepancyLetter/v1/getDiscrepancyLetterByID';

  //employeeDiscrepancyLetter
  ADDEMPLOYEEDISCREPANCYLETTER = 'employeeDiscrepancyLetter/v1/addEmployeeDiscrepancyLetter';
  GETEMPLOYEEDISCREPANCYLETTER = 'employeeDiscrepancyLetter/v1/getEmployeeDiscrepancyLetter';
  UPDATEEMPLOYEEDISCREPANCYLETTER = 'employeeDiscrepancyLetter/v1/updateEmployeeDiscrepancyLetter';
  DELETEEMPLOYEEDISCREPANCYLETTER = 'employeeDiscrepancyLetter/v1/deleteEmployeeDiscrepancyLetter';
  SENDEMAILDISCREPANCYLETTER = 'employeeDiscrepancyLetter/v1/sendEmailDiscrepancyLetter';

  //userShortLeave
  GETSHORTLEAVEAPPLICATIONDATA = 'userShortLeave/v1/listDataByUser';
  GETSHORTLEAVEAPPLICATIONBYID = 'userShortLeave/v1/getById';
  CREATESHORTLEAVEAPPLICATION = 'userShortLeave/v1/add';
  UPDATESHORTLEAVEAPPLICATION = 'userShortLeave/v1/update';
  DELETESHORTLEAVEAPPLICATION = 'userShortLeave/v1/delete';

  //shortLeaveAuthorization
  GETSHORTLEAVEAUTHORIZATIONBYID =
    'shortLeaveAuthorization/v1/getAuthorizationRequestByReferenceId/';
  GETSHORTLEAVEAUTHORIZATIONDATA = 'shortLeaveAuthorization/v1/listShortLeaveAuthRequest';
  SHORTLEAVEACCEPTREJECT = 'shortLeaveAuthorization/v1/shortLeaveAcceptReject';

  //TrackingOutage
  GETTRACKINGOUTAGECATEGORIES = 'TrackingOutage/v1/getTrackingOutageCategories';
  ADDTRACKINGOUTAGECATEGORIES = 'TrackingOutage/v1/addTrackingOutageCategories';
  UPDATETRACKINGOUTAGECATEGORIES = 'TrackingOutage/v1/updateTrackingOutageCategories';
  DELETETRACKINGOUTAGECATEGORIES = 'TrackingOutage/v1/deleteTrackingOutageCategories';
  GETTRACKINGOUTAGECATEGORIESBYID = 'TrackingOutage/v1/getTrackingOutageCategoryById';
  UPDATETRACKINGOUTAGECATEGORYSTATUS = 'TrackingOutage/v1/updateTrackingOutageCategoryStatus';

  //TrackingCategoryDetails
  GETTRACKINGCATEGORYDETAILS = 'TrackingCategoryDetails/v1/getTrackingCategoryDetails';
  ADDTRACKINGCATEGORYDETAILS = 'TrackingCategoryDetails/v1/addTrackingCategoryDetails';
  UPDATETRACKINGCATEGORYDETAILS = 'TrackingCategoryDetails/v1/updateTrackingCategoryDetails';
  DELETETRACKINGCATEGORYDETAILS = 'TrackingCategoryDetails/v1/deleteTrackingCategoryDetails';
  GETTRACKINGCATEGORYDETAILSBYID = 'TrackingCategoryDetails/v1/getTrackingCategoryDetailsById';
  UPDATETRACKINGCATEGORYDETAILSSTATUS =
    'TrackingCategoryDetails//v1/updateTrackingOutageCategoryDetailsStatus';

  //personalInformationForm
  PERSONALINFORMATIONFORM = 'personalInformationForm/v1/downloadPersonalInformationForm';

  //jobRoleClassification
  ADDJOBROLECLASSIFICATION = 'jobRoleClassification/v1/addJobRoleClassification';
  LISTJOBROLECLASSIFICATION = 'jobRoleClassification/v1/listJobRoleClassification';
  GETJOBROLECLASSIFICATIONBYID = 'jobRoleClassification/v1/getJobRoleClassificationByID';
  EDITJOBROLECLASSIFICATION = 'jobRoleClassification/v1/editJobRoleClassificationByID';
  DELETEJOBROLECLASSIFICATION = 'jobRoleClassification/v1/deleteJobRoleClassificationByID';

  //district
  ADDDISTRICT = 'district/v1/addDistrict';
  LISTDISTRICT = 'district/v1/listDistrictData';
  GETDISTRICTBYID = 'district/v1/getDistrictByID';
  EDITDISTRICT = 'district/v1/updateDistrict';
  GETDISTRICTBYSTATEID = 'district/v1/getdistrictByStateIdyID';

  //employeeSkillCategory
  ADDEMPLOYEESKILLCATEGORY = 'employeeSkillCategory/v1/addData';
  GETSKILLCATEGORYBYUSERID = 'employeeSkillCategory/v1/getByUserId/';
  DELETEEMPLOYEESKILLCATEGORY = 'employeeSkillCategory/v1/delete';
  GETALLUSERSSKILLCATEGORY = 'employeeSkillCategory/v1/getAllUsersSkillCategory';

  //serviceCharge
  ADDSERVICECHRGES = 'serviceCharge/v1/add';
  UPDATESERVICECHRGES = 'serviceCharge/v1/update/';
  DELETESERVICECHRGES = 'serviceCharge/v1/delete/';
  GETSERVICECHRGESBYID = 'serviceCharge/v1/getById/';
  LISTSERVICECHRGES = 'serviceCharge/v1/list';

  //project
  ADDPROJECT = 'project/v1/addProject';
  LISTPROJECT = 'project/v1/listProjects';
  GETPROJECTBYID = 'project/v1/getProjectByID';
  EDITPROJECT = 'project/v1/updateProject';
  DELETEPROJECT = 'project/v1/deleteProject';
  CHANGEPROJECTSTATUS = 'project/v1/updateProjectStatus';
  DEMOPROJECTEXCEL = 'project/v1/demoProjectExcel';
  VALIDATEPROJECTEXCEL = 'project/v1/validateExcel';
  REVALIDATEPROJECTDATA = 'project/v1/revalidateProject';
  ADDVALIDATEPROJECT = 'project/v1/addValidateProject';
  SYNCPROJECTDATA = 'project/v1/syncProject';

  //employeeProject
  CREATEEMPLOYEEPROJECT = 'employeeProject/v1/assignProject';
  GETEMPLOYEEPROJECTBYUSERMASTER = 'employeeProject/v1/getEmployeeProjectByuserMasterID';
  DELETEEMPLOYEEPROJECT = 'employeeProject/v1/deleteEmployeeProject';
  GETEMPLOYEEPROJECTBYCOMPANY = 'employeeProject/v1/getEmployeeProjectByCompany';
  BULKCREATEEMPLOYEEPROJECT = 'employeeProject/v1/assignProjectBulk';
  GETALLEMPLOYEEPROJECT = 'employeeProject/v1/getAllEmployeeProject';

  // menuClick
  ADDMENUCLICK = 'menuClick/v1/addClick';
  GETRECENTMENUS = 'menuClick/v1/getRecentMenu';

  // extraDays
  GETALLEXTRADAYS = 'extraDays/v1/getAllExtraDays';
  ADDEXTRADAYS = 'extraDays/v1/addExtraDays';

  // extraDaysAuthorization
  GETEXTRADAYSAUTHORIZATIONBYID = 'extraDaysAuthorization/v1/getExtradaysAuthorizationRequestById/';
  VIEWEXTRADAYAUTHORIZATIONBYUSERID = 'extraDaysAuthorization/v1/viewExtraDayAuthorizationByUserId';
  EXTRADAYSAUTHORIZATIONACCEPTREJECT =
    'extraDaysAuthorization/v1/extraDaysAuthorizationacceptreject';
  CANCELEXTRADAYAUTHORIZATIONREQUSER =
    'extraDaysAuthorization/v1/cancelExtraDayAuthorizationRequest';

  // userLeaveTransaction
  GETAPPROVEDLEAVETRANSACTIONBYUSER = 'userLeaveTransaction/v1/getApprovedLeaveTransactionByUser';

  // userLapseLeave
  GETLEAVELAPSEBYUSER = 'userLapseLeave/v1/getLeaveLapseByUser';

  // LeaveEncashment
  GETALLLEAVEENCASHMENT = 'leaveEncashment/v1/getAllLeaveEncashment';
  CANCELLEAVEENCASHMENT = 'leaveEncashment/v1/cancelLapseLeaveEncashment';
  GETLEAVEENCASHMENTBYUSER = 'leaveEncashment/v1/getLeaveEncashmentByUser';

  // AttendanceCorrectionReason
  ADDATTENDANCECORRECTIONREASON = 'attendanceCorrectionReason/v1/add';
  LISTATTENDANCECORRECTIONREASON = 'attendanceCorrectionReason/v1/list';
  GETATTENDANCEDATABYREASONID = 'attendanceCorrectionReason/v1/getByID/';
  EDITATTENDANCEDATABYREASON = 'attendanceCorrectionReason/v1/edit';
  DELETEATTENDANCEDATABYREASON = 'attendanceCorrectionReason/v1/deleteById';
  GETATTENDANCECORRECTIONREASONS = 'attendanceCorrectionReason/v1/getReasons';

  // FNF Process
  GETFNFCOUNT = 'fnfProcess/v1/getFNFCount';
  LISTFNFEMPLOYEES = 'fnfProcess/v1/listFNF';
  APPROVEDRESIGNATION = 'fnfProcess/v1/resignationByUserId/';
  GETPENDINGASSETS = 'fnfProcess/v1/assetByUserId/';
  GETPENDINGADVANCE = 'fnfProcess/v1/advanceByUserId/';
  GETPENDINGLOAN = 'fnfProcess/v1/loanByUserId/';
  GETPENDINGPENALTY = 'fnfProcess/v1/penaltyByUserId';
  ADDEMPREPAYMENT = 'fnfProcess/v1/addEmp_repayment';
  ADDEMPREPAYMENTLOAN = 'fnfProcess/v1/loanTransInFNF';

  // Bonus Policy
  ADDBONUSPOLICY = 'bonusPolicy/v1/add';
  UPDATEBONUSPOLICY = 'bonusPolicy/v1/update/';
  LISTBONUSPOLICY = 'bonusPolicy/v1/listdata';
  GETBONUSPOLICYBYID = 'bonusPolicy/v1/getById/';
  DELETEBONUSPOLICYBYID = 'bonusPolicy/v1/delete/';
  BONUSPOLICYSTATUSCHANGES = 'bonusPolicy/v1/poststatuschange';
  GETBONUSPOLICYDATABYCOMPANYID = 'bonusPolicy/v1/getActiveBonusPolicyByCompanyId/';

  // employee bonus policy
  ADDEMPLOYEEBONUSPOLICY = 'employeeBonusPolicy/v1/add';
  GETEMPLOYEEBONUSPOLICY = 'employeeBonusPolicy/v1/getByUserId/';
  DELETEEMPLOYEEBONUSPOLICY = 'employeeBonusPolicy/v1/delete';
  GETALLEMPLOYEEBONUSPOLICY = 'employeeBonusPolicy/v1/getAllEmployeeBonusPolicy';

  // Employee Bonus
  ADDEMPLOYEEBONUS = 'employeeBonus/v1/add';
  LISTEMPLOYEEBONUS = 'employeeBonus/v1/listEmployeeBonus';
  CANCELEMPLOYEEBONUS = 'employeeBonus/v1/cancelEmployeeBonus/';
  GENERATEDEMOEXCELEMPLOYEEBONUS = 'employeeBonus/v1/generateDemoExcel';
  VALIDATEEMPLOYEEBONUSEXCEL = 'employeeBonus/v1/validateExcel';
  REVALIDATEEMPLOYEEBONUSDATA = 'employeeBonus/v1/revalidateEmployeeBonus';
  ADDVALIDATEEMPLOYEEBONUS = 'employeeBonus/v1/addValidateEmployeeBonus';
  GETEMPLOYEEBONUSBYUSERID = 'employeeBonus/v1/getEmployeeBonusByUserId';

  LISTEMPLOYEEBONUSPAYMENT = 'employeePayment/v1/listEmployeeBonusPayment';
  EMPLOYEEBONUSBYUSERID = 'employeePayment/v1/getEmployeeBonusByUserId';
  PAYEMPLOYEEBONUS = 'employeePayment/v1/payEmployeeBonus';

  // Bank Statement Format
  ADDBANKSTATEMENTFORMAT = 'bankStatementFormat/v1/add';
  GETBANKSTATEMENTFORMAT = 'bankStatementFormat/v1/getBankStatementFormat';
  UPDATEBANKSTATEMENTFORMAT = 'bankStatementFormat/v1/updateBankStatementFormat';
  DELETEBANKSTATEMENTFORMAT = 'bankStatementFormat/v1/deleteBankStatementFormat';

  SALARYSUMMARYREPORT = 'report/v1/salarySummary';

  BONUSREPORT = 'report/v1/employeeBonusReport';

  GETDATERANGE = 'paySlipGenerator/v1/getDateRanges';
  DEMOEXCELFORPAYSLIPGENERATOR = 'paySlipGenerator/v1/downloadDemoExcel';
  VALIDATEPAYSLIPGENERATOREXCEL = 'paySlipGenerator/v1/validateUploadExcel';
  REVALIDATEPAYSLIPGENERATOREXCEL = 'paySlipGenerator/v1/revalidateExcel';
  SAVEPAYSLIPGENERATOREXCEL = 'paySlipGenerator/v1/saveData';

  // PAY SLIP
  GETPAYSLIPGENERATORDATA = 'paySlipGenerator/v1/getPaySlipGeneratorData';
  GENERATEPAYSLIP = 'paySlipGenerator/v1/generateSalarySlip';
  GETMYPAYSLIP = 'paySlipGenerator/v1/getMyPaySlipData';

  // PreBoardingDocument Routes
  ADDPREBORDINGDOCS = 'preboardingDocument/v1/addDocs';
  GETPREBORDINGDOCS = 'preboardingDocument/v1/getByPreBordingId/';

  // Bulk download profile pics
  BULKDOWNLOADPROFILEPICS = 'companycontact/v1/bulkDownloadProfilePics';

  UPDATECUSTOMIZEPROFILE = 'customizeProfile/v1/updateCustomizeProfile';
  GETCUSTOMIZEPROFILE = 'customizeProfile/v1/getCustomizeProfile';

  PTREGISTER = 'report/v1/PT_register';

  // Tax Standard Deductions
  LISTTAXSTANDARDDEDUCTIONS = 'taxStandardDeduction/v1/list';
  GETTAXSTANDARDDEDUCTIONSBYID = 'taxStandardDeduction/v1/getById/';
  ADDTAXSTANDARDDEDUCTIONS = 'taxStandardDeduction/v1/add';
  UPDATETAXSTANDARDDEDUCTIONS = 'taxStandardDeduction/v1/update/';
  DELETETAXSTANDARDDEDUCTIONS = 'taxStandardDeduction/v1/delete/';

  // Tax Rebate
  LISTTAXREBATE = 'taxRebate/v1/list';
  GETTAXREBATEBYID = 'taxRebate/v1/getById/';
  ADDTAXREBATE = 'taxRebate/v1/add';
  UPDATETAXREBATE = 'taxRebate/v1/update/';
  DELETETAXREBATE = 'taxRebate/v1/delete/';

  // Monthly Attendance Entry
  GETMONTHLYATTENDANCEENTRY = 'hrleavesmonthlytrans/v1/listMonthlyAttendanceEntry';
  SAVEMONTHLYATTENDANCEENTRY = 'hrleavesmonthlytrans/v1/saveMonthlyAttendanceEntry';

  DELETEMONTHLYATTENDANCEENTRY = 'hrleavesmonthlytrans/v1/deleteMonthlyAttendanceEntry';


  // Office Expense Category
  ADDOFFICEEXPENSECATEGORY = 'officeExpenseCategory/v1/postAddOfficeExpenseCategory';
  GETALLOFFICEEXPENSECATEGORY = 'officeExpenseCategory/v1/getAllOfficeExpenseCategory';
  GETOFFICEEXPENSECATEGORYBYID = 'officeExpenseCategory/v1/getOfficeExpenseCategoryByID/';
  UPDATEOFFICEEXPENSECATEGORY = 'officeExpenseCategory/v1/updateOfficeExpenseCategory';
  DELETEOFFICEEXPENSECATEGORY = 'officeExpenseCategory/v1/deleteOfficeExpenseCategory/';
  VALIDATEOFFICEEXPENSECATEGORYEXCEL = 'officeExpenseCategory/v1/validateExcel';
  REVALIDATEOFFICEEXPENSECATEGORYEXCEL = 'officeExpenseCategory/v1/reValidateOfficeExpenceCategory';
  ADDVALIDATEDOFFICEEXPENSEVATEGORYEXCEL =
    'officeExpenseCategory/v1/addValidateOfficeExpenseCategory';
  DOWNLOADDEMOEXCELFOROFFICEEXPENSECATEGORY =
    'officeExpenseCategory/v1/generateDemoExcelForOfficeExpenseCategory';
  UPDATEOFFICEEXPENCECATEGORYSTATUS = 'officeExpenseCategory/v1/postStatusChange';

  ADDOFFICEEXPENSEHEAD = 'officeExpenseHead/v1/postAddOfficeExpenseHead';
  GETALLOFFICEEXPENSEHEAD = 'officeExpenseHead/v1/getAllOfficeExpenseHead';
  GETOFFICEEXPENSEHEADBYID = 'officeExpenseHead/v1/getOfficeExpenseHeadByID/';
  UPDATEOFFICEEXPENSEHEAD = 'officeExpenseHead/v1/updateOfficeExpenseHead';
  DELETEOFFICEEXPENSEHEAD = 'officeExpenseHead/v1/deleteOfficeExpenseHead/';
  GENERATEDEMOEXCELFOROFFICEEXPENSEHEAD =
    'officeExpenseHead/v1/generateDemoExcelForOfficeExpenseHead';
  VALIDATEOFFICEEXPENSEHEADEXCEL = 'officeExpenseHead/v1/validateExcel';
  REVALIDATEOFFICEEXPENSEHEADEXCEL = 'officeExpenseHead/v1/revalidateOfficeExpensehead';
  ADDVALIDATEOFFICEEXPENSEHEADEXCEL = 'officeExpenseHead/v1/addValidateOfficeExpensehead';
  UPDATEOFFICEEXPENCEHEADSTATUS = 'officeExpenseHead/v1/postStatusChange';
  GETEXPENSEDATABYID = 'userExpenseTransaction/v1/getExpenseDataByTransactionByID';

  //tdsSubSection
  ADDTDSSUBSECTIONLIMIT = 'tdsSubSectionLimit/v1/add';
  UPDATETDSSUBSECTIONLIMIT = 'tdsSubSectionLimit/v1/update/';
  DELETETDSSUBSECTIONLIMIT = 'tdsSubSectionLimit/v1/delete/';
  GETALLDATATDSSUBSECTIONLIMIT = 'tdsSubSectionLimit/v1/getlist';
  GETBYIDTDSSUBSECTIONLIMIT = 'tdsSubSectionLimit/v1/getById/';

  // Org Authorization Type
  ADDORGAUTHORIZATIONTYPE = 'orgAuthorizationType/v1/add';
  GETORGAUTHORIZATIONTYPE = 'orgAuthorizationType/v1/getalldata';
  GETORGAUTHORIZATIONTYPEBYID = 'orgAuthorizationType/v1/getbyid/';
  UPDATEORGAUTHORIZATIONTYPEBYID = 'orgAuthorizationType/v1/updatebyid';
  DELETEORGAUTHORIZATIONTYPEBYID = 'orgAuthorizationType/v1/deletebyid/';
  CHANGEORGAUTHORIZATIONTYPESTATUS = 'orgAuthorizationType/v1/statuschange';

  //SITE
  ADDSITE = 'site/v1/addSite';
  LISTSITE = 'site/v1/listSite';
  GETSITEBYID = 'site/v1/getSiteByID/';
  EDITSITE = 'site/v1/editSite';
  DELETESITE = 'site/v1/deleteSite';
  CHANGESITESTATUS = 'site/v1/updateProjectStatus';

  // Organization Authorization
  ADDORGANIZATIONAUTHORIZATION = 'organizationAuthorization/v1/add';
  GETORGANIZATIONAUTHORIZATION = 'organizationAuthorization/v1/getalldata';
  GETORGANIZATIONAUTHORIZATIONBYID = 'organizationAuthorization/v1/getbyid/';
  UPDATEORGANIZATIONAUTHORIZATIONYID = 'organizationAuthorization/v1/updatebyid';
  DELETEORGANIZATIONAUTHORIZATIONYID = 'organizationAuthorization/v1/deletebyid';

  // Office Expense
  ADDOFFICEEXPENSE = 'OfficeExpense/v1/addOfficeExpense';
  GETALLOFFICEEXPENSE = 'OfficeExpense/v1/getAllOfficeExpense';
  GETOFFICEEXPENSEBYID = 'OfficeExpense/v1/getOfficeExpenseByID';
  UPDATEOFFICEEXPENSE = 'OfficeExpense/v1/updateOfficeExpense';
  DELETEOFFICEEXPENSEBYID = 'OfficeExpense/v1/deleteOfficeExpense/';
  EXPORTOFFICEEXPENSE = 'OfficeExpense/v1/exportOfficeExpense';
  REAPPLYOFFICEEXPENSE = 'OfficeExpense/v1/reapply';
  GETOFFICEEXPENSETRANSACTIONBYID = 'OfficeExpense/v1/getOfficeExpenseTransactionByID/';

  // Office Expense Authorization Request
  GETALLOFFICEEXPENSEREQUEST = 'officeExpenseAuthRequest/v1/getAllOfficeExpenseRequest';
  ACCEPTREJECTOFFICEEXPENSES = 'officeExpenseAuthRequest/v1/acceptRejectOfficeExpenses';

  // Office Expense Advance
  CREDITDEBITOFFICEEXPENSEADVANCE = 'officeExpenseAdvance/v1/creditDebitAdvance';
  GETALLOFFICEEXPENSEADVANCE = 'officeExpenseAdvance/v1/getAllOfficeExpenseAdvance';

  // Allocate Office Expense Rights
  ADDALLOCATEOFFICEEXPENSERIGHTS = 'allocateOfficeExpense/v1/addOfficeExpenseAllocationRights';
  GETALLOFFICEEXPENSEALLOCATIONRIGHTS = 'allocateOfficeExpense/v1/getAllOfficeExpenseAllocationRights';
  UPDATEOFFICEEXPENSEALLOCATIONRIGHTS = 'allocateOfficeExpense/v1/updateOfficeExpenseAllocationRights';
  DELETEOFFICEEXPENSEALLOCATIONRIGHTS = 'allocateOfficeExpense/v1/deleteOfficeExpenseAllocationRights/';
  GETOFFICEEXPENSEALLOCATIONRIGHTSBYID = 'allocateOfficeExpense/v1/getOfficeExpenseAllocationRightsByID/';
  GETALLASSIGNEDBRANCHBYUSER = 'allocateOfficeExpense/v1/getAllAssignedBranchByUser';
  GETALLASSIGNEDSITEBYUSER = 'allocateOfficeExpense/v1/getAllAssignedSiteByUser';
  GETASSIGNEDUSERSBYBRANCHANDSITE = 'allocateOfficeExpense/v1/getAssignedUsersByBranchAndSite';

  EXPORTDEMOJOBTITLE = 'updateBranchJob/v1/ExportDemojobTitle';
  VALIDATEBRANCHJOBTITLE = 'updateBranchJob/v1/validatBranchJobTitle';
  ADDVALIDATEBRANCHJOBTITLE = 'updateBranchJob/v1/addValidateBranchJob';
  // Minimum wages master

  ADDMINIMUMWAGESMASTER = 'minWagesMaster/v1/addData';
  GETMINIMUMWAGESMASTERBYID = 'minWagesMaster/v1/getById/'
  UPDATEMINIMUMWAGESMASTER = 'minWagesMaster/v1/updateData/'
  DELETEMINIMUMWAGESMASTER = 'minWagesMaster/v1/delete/'
  LISTMINIMUMWAGESMASTER = 'minWagesMaster/v1/list'

  //GET Corporation by stateid

  GETCORPORATIONBYSTATEID = 'corporation/v1/getByStateId/'


  constructor() { }
}
