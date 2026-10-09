import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-all-tickets',
    templateUrl: './all-tickets.component.html',
    styleUrls: ['./all-tickets.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AllTicketsComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal2') lgModal2: any;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  myInputVariable: ElementRef;
  SelectionType = SelectionType;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Name', value: 'name' };
  changeOrderBy = [
    { label: 'Name', value: 'name' },
    { label: 'Description', value: 'description' },
    { label: 'Created By', value: 'createBy' },
  ];
  editData: any;

  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: Number(localStorage.getItem('company_id')),
    sortByField: '',
    sortByValue: 'ASC',
    ticketCategoryId: '',
    ticketSubCategoryId: '',
    priority: '',
    status: '',
    departmentID: null,
    designationID: null,
    branchMasterID: null,
    divisionId: null,
    workingAreaId: null,
    userMasterID: '',
  };
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
  limit = 10;
  usertype: any;
  company_id: any;
  file: any;
  childcompany: string;
  ipAddress: any;
  comp: any;
  ticketData: any = [];
  userId: any;
  ticketCategory: any = [];
  ticketSubCategory: any = [];
  selectedValue: string;
  query: string;

  currentPage: number;
  formValue: any;
  alldepartment: any[];
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  allWorkingArea: any[];
  alldesignation: any[];
  allDivision: any[];
  selectedDivision: null;
  selectedWorkingArea: null;
  selectedEmployees: any = [];
  allbranch: any = [];
  employee: any[];
  selectedRow: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: ''
  }
  columns = [
    { name: 'Title', prop: 'title' },
    { name: 'Description', prop: 'description' },
    { name: 'Priority', prop: 'priority' },
    { name: 'Created By', prop: 'ticketCreatedBy.displayName' },
    { name: 'Assign To', prop: 'ticketAssignedTo.displayName' },


    // Add more columns if needed
  ];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,
    private formValueStorageService: FormValueStorageService,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/tickets/listTicket',
          this.adminRoot + '/tickets/editTicket',
          this.adminRoot + '/tickets/ticketChat',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListTicketComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.userId = Number(localStorage.getItem('id'));
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListTicketComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        companyMasterID: Number(localStorage.getItem('company_id')),
        sortByField: '',
        sortByValue: 'ASC',
        ticketCategoryId: '',
        ticketSubCategoryId: '',
        priority: '',
        status: '',
        departmentID: null,
        designationID: null,
        branchMasterID: null,
        divisionId: null,
        workingAreaId: null,
        userMasterID: '',
      };
    } else {
      this.body = this.formValue.ListTicketComponent.body;
    }


    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }
    this.selectcompany(this.company_id);

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getTicketData();
    this.checkpermission();
    this.getcompany();


    if (this.body.companyMasterID) this.selectTicketCategory(this.body.companyMasterID);
    if (this.body.ticketCategoryId) this.selectTicketSubCategory(this.body.ticketCategoryId)
  }

  view(row: any) {
    this.selectedRow = row; // Set the selected row data
    this.lgModal2.show(); // Show the modal
  }

  getTicketData() {


    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLTICKETDATA, this.body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start');
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('start');
        },
      );
  }

  checkpermission() {
    this.spinner.start();
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
              permissionval.formName == 'AllTicket' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }
  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getTicketData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getTicketData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getTicketData();
    }
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }
    this.body.companyMasterID = this.companyfilter.value.companyMasterID;
    this.body.ticketCategoryId = this.companyfilter.value.ticketCategoryID;
    this.body.ticketSubCategoryId = this.companyfilter.value.ticketSubCategoryId;
    this.body.priority = this.companyfilter.value.priority;
    this.body.status = this.companyfilter.value.status;
    this.body.workingAreaId = this.companyfilter.value.workingArea;
    this.body.divisionId = this.companyfilter.value.division;
    this.body.departmentID = this.companyfilter.value.department;
    this.body.designationID = this.companyfilter.value.designation;
    this.body.branchMasterID = this.companyfilter.value.branch;
    this.body.userMasterID = this.companyfilter.value.user;
    this.getTicketData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getTicketData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {

      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getTicketData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/tickets/addTicket']);
  }

  clear() {
    this.companyfilter.resetForm();

    this.formValueStorageService.removeData('ListTicketComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  selectTicketCategory(id) {
    if (!id) {
      return;
    }
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETALLTICKETCATEGORY + '?companyMasterID=' + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.ticketCategory = res.data;

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Something Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop();
        },
      );
  }

  selectTicketSubCategory(id) {
    if (!id) {
      return;
    }
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETALLTICKETSUBCATEGORY + '?ticketCategoryId=' + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.ticketSubCategory = res.data;
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Something Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop();
        },
      );
  }

  onOptionSelectDownlad() {

    let body1 = {
      companyMasterID: this.companyfilter.value.companyMasterID,
      ticketCategoryId: this.companyfilter.value.ticketCategoryID,
      ticketSubCategoryId: this.companyfilter.value.ticketSubCategoryId,
      priority: this.companyfilter.value.priority,
      status: this.companyfilter.value.status,
      workingAreaId: this.companyfilter.value.workingArea,
      divisionId: this.companyfilter.value.division,
      departmentID: this.companyfilter.value.department,
      designationID: this.companyfilter.value.designation,
      branchMasterID: this.companyfilter.value.branch,
      userMasterID: this.companyfilter.value.user,
      exportData: true
    }
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLTICKETDATA, body1,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'Ticket.csv');
          this.selectedValue = null;
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Ticket.xlsx');
          this.selectedValue = null;
          this.spinner.stop('a');
        }
      });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTicketComponent',
      this.body,
      '/tickets/editTicket/',
      rowData.id,
    );
  }


  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }


  onActivate(event) {
    if (event.type == 'click') {
      if (event.cellIndex == 0) {
        this.formValueStorageService.navigate(
          'ListTicketComponent',
          this.body,
          '/tickets/ticketChat',
          Number(event.row.id),
        );
      }
    }
  }


  selectcompany(id: any) {
    this.body.branchMasterID = null;
    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []
    this.allDivision = []
    this.allWorkingArea = []
    this.employee = []
    this.ticketCategory = []
    this.ticketSubCategory = []

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }


    this.body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      companyMasterID: Number(localStorage.getItem('company_id')),
      sortByField: '',
      sortByValue: 'ASC',
      ticketCategoryId: '',
      ticketSubCategoryId: '',
      priority: '',
      status: '',
      departmentID: null,
      designationID: null,
      branchMasterID: null,
      divisionId: null,
      workingAreaId: null,
      userMasterID: '',
    };


    if (!id) return;
    this.spinner.start('depart')
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          // this.filter = 'filt'

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('depart');
        }
      });

    // getDesignationData() {}
    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    this.spinner.start('branch')

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });

    this.spinner.start('workingArea');
    this.api
      .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('workingArea');
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

    this.selectTicketCategory(id)



  }



  selectbranch(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.departmentID = id;
    this.getUsers();
  }


  selectdesig(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.designationID = id;
    this.getUsers();
  }


  selectdivision(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  selectWorkingArea(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.workingAreaId = id;
    this.getUsers();
  }

  getUsers() {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          // this.showForm = true;
          this.selectAllForDropdownItems(this.employee);
        }
        this.spinner.stop('users');
      });
  }


  image: any;
  editimage(image) {

    this.image = image.attachments;

  }


}
