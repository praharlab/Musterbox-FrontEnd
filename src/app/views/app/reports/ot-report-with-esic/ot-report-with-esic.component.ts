import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-ot-report-with-esic',
    templateUrl: './ot-report-with-esic.component.html',
    styleUrls: ['./ot-report-with-esic.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OtReportWithEsicComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;

  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    month: '',
    userMasterID: [],
    companyMasterID: '',
  };
 
  childcompany: any;
  company_id: any;
  cid: any;
  company: any;
  usertype: any;
  
  permissionview: any = [];
  alluser: any;
  allbranch: any;
 
  alldepartment: any;
  selectedEmployees: any[];
  selectedDepart: string;
  selectedBranch: string;
  currentPage: number;
  allDivision: any = [];
  selectedDivision: string;
 
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    divisionId: ''
  }



  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {

    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getcompany();

  }

 

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  checkpermission() {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeSheetWithESIC' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getUsers() {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
        }
        this.spinner.stop('users');
      });
  }

  selectcompany(id) {
    this.allbranch = [];
    this.alldepartment = [];
    this.alluser = [];
    this.allDivision = [];
    this.users_Body.companyMasterID = '';
    this.users_Body.branchMasterID = '';
    this.users_Body.departmentID = '';
    this.users_Body.divisionId = '';
    (this.selectedEmployees = []), (this.selectedDepart = ''), (this.selectedBranch = ''), this.selectedDivision = '';

    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });
      this.spinner.start('depart');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;
            this.spinner.stop('depart');
          }
        });

      this.spinner.start('Division');
      this.api
        .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allDivision = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('Division');
        });

      this.users_Body.companyMasterID = id;
      this.getUsers();
    }
  }

  selectbranch(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.departmentID = id;
    this.getUsers();
  }

  selectdivision(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }




  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  download() {

    if(!this.datefilter.valid)return;

    this.filterData.companyMasterID = this.datefilter.value.cid;
    this.filterData.userMasterID = this.selectedEmployees;
    this.filterData.month = this.datefilter.value.YearMM.replace('-', '');

    this.spinner.start('a');
    this.api
      .callApi(this.constant.OTREPORTWITHESIC, this.filterData, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Overtime Sheet With ESIC - ${this.filterData.month}.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {

          this.notifications.create(
            '',
             err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

}
