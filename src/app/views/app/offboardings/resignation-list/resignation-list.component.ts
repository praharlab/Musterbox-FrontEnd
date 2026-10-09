import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-resignation-list',
    templateUrl: './resignation-list.component.html',
    styleUrls: ['./resignation-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ResignationListComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any[] = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    user: [],
    startdate: '',
    enddate: '',
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];

  referenceData: any = [];

  childcompany: string;
  cid: string;
  usertype: any;
  company_id: any;
  alluser: any;
  company1: any;
  employee: any;
  ipAddress: any;
  allbranch: any;
  company: any;
  body: any;
  userName: any;
  authData: any;
  userId: any;

  employeeComment: any;

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

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.userId = localStorage.getItem('id');

    this.getcompany();

    this.selectcompany(this.company_id);

    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      user: [],
      searchQuery: '',
      startdate: '',
      enddate: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.rows1 = [];
    this.getData();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
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

  selectcompany(id) {
    this.allbranch = []
    this.alluser = []
    if (!id) return
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });

    const body = {
      companyMasterID: id,
      branchMasterID: '',
      authPersonid: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.RESIGNATIONAUTHORIZEDUSER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);

          this.alluser.map((el) => {
            el.name = el.userName;
          });

          let data1 = [];
          this.alluser.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected = data1;
          this.spinner.stop();
        }
      });

  }

  selectbranch(id) {
    if (id != '' && id != null) {
      const filterData = {
        companyMasterID: '',
        branchMasterID: id,
        authPersonid: localStorage.getItem('id'),
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.RESIGNATIONAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.userName;
            });

            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.datefilter.value.company,
        branchMasterID: '',
        authPersonid: localStorage.getItem('id'),
      };
      this.api
        .callApi(this.constant.RESIGNATIONAUTHORIZEDUSER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);

            this.alluser.map((el) => {
              el.name = el.userName;
            });
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        userMasterID: '',
        user: [],
        searchQuery: '',
        startdate: '',
        enddate: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  getData() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETALLRESIGNATIONBYAUTH, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('main');
        }
      });
  }

  showdata(row) {
    this.api
      .callApi(
        this.constant.GETRESIGNATIONBYREFERENCEID + row.ReferenceID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referenceData = res.data;
            this.employeeComment = this.referenceData.employeeComment;

            var s = this.referenceData.employeeComment ? this.referenceData.employeeComment : '';
            var htmlObject = document.getElementById('employeeComment');
            htmlObject.innerHTML = s;

            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },

        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.page = 1;
    this.filterData.user =
      this.datefilter.value.name && this.datefilter.value.name.length > 0
        ? this.datefilter.value.name
        : this.selected;
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getData();
  }

  Approve(id: any) {
    // id.updateBy = localStorage.getItem('id')
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to Approve these Resignation',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        // const body = {
        //   AuthorizationRequestId: id,
        // };
        const body = {
          ResignationAuthorizationRequestId: id,
          authstatus: 1,
          remarks: '',
          companyMasterID: localStorage.getItem('company_id'),
          createBy: localStorage.getItem('id'),
        };
        this.spinner.start('accept');
        this.api.callApi(this.constant.RESIGNATIONAUTHREQUESTACCEPTREJECT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
            }

            this.getData();
            this.spinner.stop('accept');
          },
          (err) => {
            this.spinner.stop('accept');
          },
        );
      }
    });
  }

  getAuthorizationData(row) {
    this.authData = row;
  }

  Reject() {
    if (!this.reject.valid) {
      return;
    }
    // const body = {
    //   AuthorizationRequestId: this.authData.AuthorizationRequestId,
    //   remarks: this.reject.value.remarks,
    // };
    const body = {
      ResignationAuthorizationRequestId: this.authData.AuthorizationRequestId,
      authstatus: 0,
      remarks: this.reject.value.remarks,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('submit1');
    this.api.callApi(this.constant.RESIGNATIONAUTHREQUESTACCEPTREJECT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create(
            'Done',
            'GatePass rejected successfully.',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            },
          );

          setTimeout(() => {
            this.closeModal1.nativeElement.click();
            this.reject.resetForm();
            this.getData();
            this.spinner.stop('submit1');
          }, 200);

          this.spinner.stop('submit1');
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit1');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit1');
      },
    );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getData();
    }
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getData();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/offboardings/add_tax_challan']);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
