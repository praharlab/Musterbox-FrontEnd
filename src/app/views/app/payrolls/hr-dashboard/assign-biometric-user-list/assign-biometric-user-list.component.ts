import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-assign-biometric-user-list',
    templateUrl: './assign-biometric-user-list.component.html',
    styleUrls: ['./assign-biometric-user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AssignBiometricUserListComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionview: any
  userData: any = []
  page = {
    totalCount: 0,
    offset: 0,
  };
  selectedCompany: any
  assignOption: any = [
    { type: 'Assigned', isAssigned: true },
    { type: 'Not Assigned', isAssigned: false }
  ]
  isUserAssigned: any = true;
  company1: any;
  usertype: string;
  company_id: string;
  allWorkingArea: any;
  alldesignation: any;
  allDivision: any;
  selected3: any[];
  selected: any[];
  allbranch: any;
  scrollBarHorizontal: boolean;
  alldepartment: any;
  selectedDepartment: any[];
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];

  body = {
    userMasterID: '',
    companyMasterID: +localStorage.getItem('company_id'),
    branchID: '',
    departmentID: '',
    designationID: '',
    page: 1,
    limit: 10,
    exportData: false,
    assigned: null
  };

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.selectedCompany = +this.company_id;
  }

  onLimitChange(ev: any) {
    if (!this.userData) return;
    if (ev) {
      this.limit = ev;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onSubmit(exportData?: boolean) {
    if (!this.datefilter.valid) return;

    if (this.datefilter.value.branch == '') {
      this.body.branchID = '';
    } else {
      this.body.branchID = this.datefilter.value.branch;
    }

    if (this.datefilter.value.department == '') {
      this.body.departmentID = '';
    } else {
      this.body.departmentID = this.datefilter.value.department;
    }

    if (this.datefilter.value.designation == '') {
      this.body.designationID = '';
    } else {
      this.body.designationID = this.datefilter.value.designation;
    }

    if (exportData) {
      this.body.exportData = exportData
    } else {
      this.body.exportData = false
    }

    this.body.assigned = this.datefilter.value.isAssigned

    this.body.companyMasterID = this.datefilter.value.company;
    this.body.limit = this.limit;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETASSIGNBIOMETRICCODEFORUSER, this.body, 'POST', true, false, true, exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.body.exportData = false;
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Assign biometric code to user.xlsx`);
        } else {

          if (res.status == 200) {
            this.userData = res.data;
            this.page.totalCount = res.totalcount;
            this.page.offset = this.limit;
            this.spinner.stop();
          }
        }
      },
        (error: any) => {
          console.log(error, 'errorr')
        });
  }

  selectcompany(id) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        this.selectAllForDropdownItems(this.allbranch);
        let data1 = [];
        this.allbranch.forEach(async (rating) => {
          data1.push(rating.branchMasterID);
        });
        this.selected3 = data1;
      });

    this.spinner.start('dep');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.selectAllForDropdownItems(this.alldepartment);
        this.spinner.stop('dep');
      });


    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.selectAllForDropdownItems(this.alldesignation);
          this.spinner.stop('desig');
        }
      });


    this.spinner.start('workingArea');
    this.api
      .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;
        this.selectAllForDropdownItems(this.allWorkingArea);

        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allDivision = res.data;
        this.selectAllForDropdownItems(this.allDivision);
        this.spinner.stop('Division');
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  clear() {
    this.datefilter.resetForm();
    this.userData = []
    setTimeout(() => {
      this.userData = [];
      this.body = { userMasterID: '', companyMasterID: +localStorage.getItem('company_id'), branchID: '', page: 1, limit: 10, exportData: false, departmentID: '', designationID: '', assigned: null };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.selectcompany(this.company_id);
          this.spinner.stop();
          // this.onSubmit();
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.onSubmit();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onPageChange(val: any) {
    this.body.page = val.page
    this.onSubmit()
  }

  fireEvent() {
    this.body.exportData = true;
    this.onSubmit(true);
  }
}