import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterStatusService {

  filterPage: any;
  filterLimit: any;
  filterCompany: any;
  filterDepartment: any;
  filterDesignation: any;
  filterBranch: any;
  filterStatus: any;
  filterSearchQuery: any;
  filterWorkingArea: any;
  filterDivision: any;
  filterRepoteeUser: any;
  setFilterData(filterData: any) {

    this.filterPage = filterData.page
    this.filterLimit = filterData.limit
    this.filterCompany = filterData.companyMasterID
    this.filterDepartment = filterData.departmentID
    this.filterDesignation = filterData.designationID
    this.filterBranch = filterData.branchMasterID
    this.filterStatus = filterData.status
    this.filterSearchQuery = filterData.searchQuery
    this.filterDivision = filterData.divisionId
    this.filterWorkingArea = filterData.workingAreaId
    this.filterRepoteeUser = filterData.repoteeUserMasterID
  }
  clearFilterData() {


    this.filterPage = null
    this.filterLimit = null
    this.filterCompany = null
    this.filterDepartment = null
    this.filterDesignation = null
    this.filterBranch = null
    this.filterStatus = null
    this.filterSearchQuery = null
    this.filterDivision = null
    this.filterWorkingArea = null
    this.filterRepoteeUser = null

  }

  constructor() { }
}
