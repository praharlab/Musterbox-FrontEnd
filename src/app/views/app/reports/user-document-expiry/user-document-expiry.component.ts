import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-user-document-expiry',
    templateUrl: './user-document-expiry.component.html',
    styleUrls: ['./user-document-expiry.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserDocumentExpiryComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  limit = 10;
  columns = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  designation1: any;
  alluser: any;
  image: any;
  enddate: Date;
  target: any;
  params: any;
  alldata: any;
  resultColumns: any[];
  allbranch: any[];
  empList: any[];
  userdata: any[];
  childcompany: string;
  cid: string;
  allshift: any;
  selected1: any = [];
  companydata: any;
  currentPage: number;
  pdfData: string;
  date12: any;
  querystring: string;
  body = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
  };
  allWorkingArea: any;
  alldesignation: any;
  allDivision: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: []
  }
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
  isResetForm:boolean = false;

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
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
      departmentID: [],
      designationID: [],
      divisionId: [],
      workingAreaId: []
    }
    this.alluser = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = []
    this.allDivision = []
    this.allWorkingArea = []

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
  }

  checkpermission() {
    this.spinner.start('loader');
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
              permissionval.formName == 'UserDocumentExpiryReport' && permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('loader');
        }
      });
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
          this.spinner.stop();
        }
      });
  }

  getUsers() {
    if(this.isResetForm) return;
  
      this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null
      this.users_Body.departmentID = this.users_Body.departmentID && this.users_Body.departmentID.length > 0 ? this.users_Body.departmentID : null
      this.users_Body.designationID = this.users_Body.designationID && this.users_Body.designationID.length > 0 ? this.users_Body.designationID : null
      this.users_Body.divisionId = this.users_Body.divisionId && this.users_Body.divisionId.length > 0 ? this.users_Body.divisionId : null
      this.users_Body.workingAreaId = this.users_Body.workingAreaId && this.users_Body.workingAreaId.length > 0 ? this.users_Body.workingAreaId : null
  
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            // this.showForm = true;
            this.selectAllForDropdownItems(this.alluser);
          }
          this.spinner.stop('users');
        });
    }
  
    selectcompany(id: any) {
      this.alluser = [];
      this.allbranch = [];
      this.alldepartment = [];
      this.alldesignation = []
      this.allDivision = []
      this.allWorkingArea = []
  
      this.selectedBranch = [];
      this.selectedDepartment = [];
      this.selectedUser = [];
      this.selecteddesig = [];
      this.selectedDivision = [];
      this.selectedWorkingArea = [];
  
      this.users_Body = {
        companyMasterID: '',
        branchMasterID: null,
        departmentID: null,
        designationID: null,
        divisionId: null,
        workingAreaId: null
      }
  
      if (!id) return;
      this.isResetForm = false;
      
      this.spinner.start('dep');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.alldepartment = res.data;
          this.selectAllForDropdownItems(this.alldepartment);
          this.spinner.stop('dep');
        });
  
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.selectAllForDropdownItems(this.allbranch);
          this.spinner.stop('branch');
        });
  
        this.spinner.start('desig')
        this.api
          .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.alldesignation = res.data;
              this.selectAllForDropdownItems(this.alldesignation);
    
              // this.page.totalCount = res.totalcount;
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
    
            // this.page.totalCount = res.totalcount;
            this.spinner.stop('Division');
          });
    
        this.users_Body.companyMasterID = id;
        this.getUsers();
    }
  
    selectbranch() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.branchMasterID = this.datefilter.value.branch;
      this.getUsers();
    }
  
    selectdepartment() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.departmentID = this.datefilter.value.department;
      this.getUsers();
    }
  
  
    selectdesig() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.designationID = this.datefilter.value.designation;
      this.getUsers();
    }
  
  
    selectdivision() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.divisionId = this.datefilter.value.division;
      this.getUsers();
    }
  
    selectWorkingArea() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.workingAreaId = this.datefilter.value.workingArea;
      this.getUsers();
    }
  
  
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    (this.body.companyMasterID = this.datefilter.value.company),
      (this.body.userMasterID = this.datefilter.value.user ? this.datefilter.value.user : []),
      this.getData();
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }

    const body = {
      page: '',
      limit: '',
      companyMasterID: this.datefilter.value.company,
      userMasterID: this.datefilter.value.user ? this.datefilter.value.user : [],
      exportData: true,
    };

    this.spinner.start('search');
    this.api
      .callApi(this.constant.USERDOCUMENTEXPRIYREPORT, body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        var blob = new Blob([res], { type: 'text/xlsx' });
        saveAs(blob, 'UserDocumentExpiry.xlsx');
        this.spinner.stop('search');
      });
  }

  getData() {
    this.spinner.start('getData');
    this.api.callApi(this.constant.USERDOCUMENTEXPRIYREPORT, this.body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
        }
        this.spinner.stop('getData');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('getData');
      },
    );
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.isResetForm = true;
    this.datefilter.resetForm();
    setTimeout(() => {
      this.rows = [];
      this.ngOnInit();
    }, 200);
    this.isResetForm = false;
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getData();
      this.spinner.start('getData');
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
}
