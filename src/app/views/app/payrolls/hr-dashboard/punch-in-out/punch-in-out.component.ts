import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EmployeePunchInListComponent } from '../../employee-punch-in-list/employee-punch-in-list.component';

@Component({
    selector: 'app-punch-in-out',
    templateUrl: './punch-in-out.component.html',
    styleUrls: ['./punch-in-out.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PunchInOutComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('EmployeePunchInListComponent') employeePunchInListComponent: EmployeePunchInListComponent;
  reportHeading: string = ''
  startdate: string;
  company_id: string;
  body1 = {
    companyMasterID: null,
    branchMasterID: [],
    date: '',
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
  };
  rows: any = [];
  defaultValue: {};
  company: any;
  allbranch: any = [];
  employee: any;
  employeedata: any;
  showloader: any = 'true';
  showPunchIn: boolean = false;
  filterData = {
    companyId: null,
    branchId: null,
    type: '',
    date: '',
  }
  allDivisions: any = []
  allWorkingAreas: any = []
  allDesignations: any = []
  allDepartments: any = []
  allBranches: any = []
  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.startdate = new Date().toISOString().slice(0, 10);
    this.company_id = localStorage.getItem('company_id');
    this.body1 = {
      companyMasterID: this.company_id,
      branchMasterID: [],
      date: this.startdate ?? '',
      departmentID: [],
      designationID: [],
      divisionId: [],
      workingAreaId: [],
    };
    this.getdashboardpunchinout();
    this.getcompany();

    this.defaultValue = {
      cName: Number(this.company_id),
      tDate: this.startdate,
    };
  }
  getcompany() {
    this.selectcompany(this.company_id);
  }

  selectcompany(companyMasterID: any) {
    this.body1.companyMasterID = companyMasterID
    if (!companyMasterID) {
      return;
    }
    this.getAllBranches(companyMasterID);
    this.getAllDepartments(companyMasterID);
    this.getAllDesignations(companyMasterID);
    this.getAllDivisions(companyMasterID);
    this.getAllWorkingAreas(companyMasterID);
  }

  getdashboardpunchinout() {
    this.showloader = 'true';
    this.api
      .callApi(this.constant.DASHBOARDPUNCHINOUT, this.body1, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.showloader = 'false';
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    const { branch, startdate, department, designation, division, workingArea } = this.datefilter.value;

    this.body1.companyMasterID = this.body1.companyMasterID ? this.body1.companyMasterID : this.company_id;
    this.body1.branchMasterID = branch && branch != '' ? branch : [];
    this.body1.date = startdate;
    this.body1.departmentID = department && department != '' ? department : [];
    this.body1.designationID = designation && designation != '' ? designation : [];
    this.body1.divisionId = division && division != '' ? division : [];
    this.body1.workingAreaId = workingArea && workingArea != '' ? workingArea : [];

    this.getdashboardpunchinout();
  }


  showPunchInOutData(type: string) {
    this.showPunchIn = true
    this.reportHeading = type == 'in' ? "Employee Punched-In List" : type == 'out' ? "Employee Punched-Out List" : type == 'notIn' ? "Employee Not Punched-In List" : "Total Active Employees";
    this.filterData.companyId = +this.body1.companyMasterID;
    this.filterData.type = type;
    this.filterData.branchId = this.body1.branchMasterID;
    this.filterData.date = this.body1.date ? this.body1.date : this.datefilter.value.startdate;
  }

  close() {
    this.showPunchIn = false;
    this.filterData = {
      companyId: null,
      branchId: null,
      type: '',
      date: '',
    }
  }

  getAllBranches(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allBranches = res;
          this.selectAllForDropdownItems(this.allBranches);
          this.spinner.stop('branch');
          resolve()
        });
    })
  }

  getAllDepartments(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('dep');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allDepartments = res.data;
          this.selectAllForDropdownItems(this.allDepartments);
          this.spinner.stop('dep');
          resolve()
        });
    })
  }

  getAllDesignations(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('desig')
      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allDesignations = res.data;
            this.selectAllForDropdownItems(this.allDesignations);
            this.spinner.stop('desig');
          }
          resolve()
        });
    })
  }

  getAllWorkingAreas(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('workingArea');
      this.api
        .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allWorkingAreas = res.data;
          this.selectAllForDropdownItems(this.allWorkingAreas);
          this.spinner.stop('workingArea');
          resolve()
        });
    })
  }

  getAllDivisions(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('Division');
      this.api
        .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allDivisions = res.data;
          this.selectAllForDropdownItems(this.allDivisions);
          this.spinner.stop('Division');
          resolve()
        });
    })
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }
}
