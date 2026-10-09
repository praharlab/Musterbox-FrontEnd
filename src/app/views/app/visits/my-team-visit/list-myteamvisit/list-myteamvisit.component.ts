import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxSignaturePadComponent } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-myteamvisit',
    templateUrl: './list-myteamvisit.component.html',
    styleUrls: ['./list-myteamvisit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListMyteamvisitComponent implements OnInit {
  @ViewChild('addcheckincheckout') addcheckincheckout: NgForm;
  @ViewChild('filterdate') filterdate: NgForm;
  @ViewChild('addreport') addreport: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('sign')
  signaturePadElement: NgxSignaturePadComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  empId: any;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Visit ID', prop: 'visitID' },
    { name: 'Customer Name', prop: 'customer.customerName' },
    { name: 'Product', prop: 'product.productName' },
    { name: 'Visit Assign', prop: 'assign.firstName' },
    { name: 'Company Name', prop: 'companyMaster.companyName' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: [+localStorage.getItem('id')],
    filter: 'false',
    startdate: '',
    enddate: '',
    status: '',
    searchQuery: '',
    exportData: false,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  selected = [
    'VisitID',
    'CustomerName',
    'VisitAssign',
    'VisitDate',
    'Status',
    'VisitStatus',
    'CustomizeFields',
  ];
  tabledata = [];
  events: any;
  // filter: any;
  export: any;
  excelevents: any;
  field: any;
  allvalue: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  report: any;
  copersonlist: any;
  selectedreport: any;
  companyid: any;
  allkey: string[];
  format: string;
  file: any;
  url: any;
  sign: { visitReportCustomizeID: any; value: string };
  checkintime: any;
  checkouttime: any;
  visitid: any;
  ipAddress: any;
  editvisitreportdatavalue: any;
  reportselected: any;
  result2: string;

  limit = 10;
  currentPage: number;
  formValue: any;
  copersonuserIDs: any = []
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/visits/myteamvisit',
          this.adminRoot + '/visits/myteamvisit/edit_myteamvisit',
          this.adminRoot + '/visits/visitcallfollowup',
          this.adminRoot + '/visits/listvisitcallfollowup',
          this.adminRoot + '/visits/editvisitcallfollowup',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListMyteamvisitComponent', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListMyteamvisitComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        userMasterID: [],
        filter: 'false',
        startdate: '',
        enddate: '',
        status: '',
        searchQuery: '',
        exportData: false
      };
    } else {
      this.filterData = this.formValue.ListMyteamvisitComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getcustomizefield();
    this.checkpermission();
    this.getIPAddress();
    this.getReportToWithoutChild();
    // this.getVisitData();
  }

  getReportToWithoutChild() {
    let id = localStorage.getItem('id');
    this.spinner.start();
    this.api.callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;
          this.copersonuserIDs = this.copersonlist.map((e) => +e.userMasterID)
          this.filterData.userMasterID = this.copersonuserIDs;
          this.getVisitData();
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Visit' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Visit' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Visit' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Visit' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getcustomizefield() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETVISITCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.field = res.data;
          this.tabledata = [
            'VisitID',
            'CustomerName',
            'Product',
            'VisitAssign',
            'CoPerson',
            'VisitPurpose',
            'VisitDate',
            'VisitTime',
            'Status',
            'VisitStatus',
            'CreateBy',
            'CreateByIp',
            'CreatedAt',
            'updateBy',
            'UpdateByIp',
            'UpdatedAt',
          ];
          this.spinner.stop();
        }
      });
  }

  getVisitData() {

    this.spinner.start('1');
    this.api
      .callApi(this.constant.MyTeamList, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let rowsdata = res.data;
            let customFiledsData = res.customFileds;

            rowsdata.forEach((visititem) => {
              visititem['visitreport'] = [];
              customFiledsData.forEach((visitreportitem) => {
                if (visititem.visitID === visitreportitem.visitID) {
                  visititem['visitreport'].push(visitreportitem);
                }
              });
            });

            this.rows = rowsdata;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('1');
          } else {
            this.handleError(res.message);
            this.spinner.stop('1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('1');
        },
      );
  }


  onEmployeeChange(id) {
    this.empId = id;
  }

  onSubmit() {
    if (!this.filterdate.valid) {
      return;
    }
    this.filterData.startdate = this.filterdate.value.startdate;
    this.filterData.enddate = this.filterdate.value.enddate;
    this.filterData.status = this.filterdate.value.status;
    this.filterData.userMasterID = +this.filterdate.value.empid ? [+this.filterdate.value.empid] : this.copersonuserIDs;
    this.filterData.filter = 'true'

    this.getVisitData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getVisitData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getVisitData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/visits/myteamvisit/add_myteamvisit']);
  }
  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          visitID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEVISIT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getVisitData();
            this.spinner.stop('confirm');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('confirm');
          },
        );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will be deactivated!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactivate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          visitID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.VISITSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getVisitData();
              this.spinner.stop('deactive');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.start('deactive');
            },
          );
      }
    });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will be activated!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          visitID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.VISITSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getVisitData();
              this.spinner.stop('active');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }


  clear() {
    this.filterdate.resetForm();
    this.formValueStorageService.removeData('ListMyteamvisitComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }


  changeshowfields() {
    this.ngOnInit();
  }





  getcustomizefields() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.companyid,
      report_id: this.selectedreport,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETVISITREPORTCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.field = res.data;
          for (var s = 0; s < this.field.length; s++) {
            this.field[s].fieldvalue = '';
            this.field[s].fieldvalueid = '';
          }

          if (this.editvisitreportdatavalue) {
            for (var i = 0; i < this.field.length; i++) {
              for (var j = 0; j < this.editvisitreportdatavalue.length; j++) {
                if (
                  this.field[i].visitFormCustomizeID ==
                  this.editvisitreportdatavalue[j].visitReportCustomizeID
                ) {

                  this.field[i].fieldvalue = this.editvisitreportdatavalue[j].value;
                  this.field[i].fieldvalueid =
                    this.editvisitreportdatavalue[j].visitReportCustomizeValueID;
                }
              }
            }
          }
          this.spinner.stop();
        }
      });
  }

  reportdata(row) {
    this.selectedreport = null;
    this.companyid = row['customer.companyMasterID'];
    this.visitid = row.visitID;
    this.api
      .callApi(
        this.constant.VISITREPORTMASTERBYCOMPANY + this.companyid,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.report = res.data;
          this.spinner.stop();
        }
      });
  }

  checkindata(row) {
    if (row.checkInDateTime == null) {
      this.checkintime = null;
      this.checkouttime = null;
      this.visitid = row.visitID;
    } else {
      this.checkintime = new Date(row.checkInDateTime).toISOString().slice(0, 16);
      this.checkouttime = new Date(row.checkOutDateTime).toISOString().slice(0, 16);
      this.visitid = row.visitID;
    }
  }

  selectreport(event: any) {

    this.selectedreport = event;
    this.getcustomizefields();
  }

  reportsubmit() {
    var finderro = [];

    if (!this.addreport.valid) {
      return;
    }

    for (var i = 0; i < this.field.length; i++) {
      if (this.field[i].inputType == 'checkbox' && this.field[i].checkboxJson && Object.keys(this.field[i].checkboxJson).length) {
        this.addreport.value[this.field[i].fieldLabel] = JSON.stringify(this.field[i].checkboxJson);
      } else if (this.field[i].inputType == 'checkbox') {
        this.field[i].checkboxJson = {};
        for (let j = 0; j < this.field[i].value.length; j++) {
          this.field[i].checkboxJson[this.field[i].value[j]] = false;
        }
        this.addreport.value[this.field[i].fieldLabel] = JSON.stringify(this.field[i].checkboxJson);
      }
    }

    for (var i = 0; i < this.field.length; i++) {
      const names = Object.keys(this.addreport.form.controls)
        .filter((key) => key.includes(this.field[i].fieldLabel))
        .reduce((obj, key) => {
          return Object.assign(obj, {
            name: key,
            error: this.addreport.form.controls[key].errors,
          });
        }, {});
      finderro.push(names);
    }
    for (var j = 0; j < finderro.length; j++) {
      if (finderro[j].error != null) {
        this.notifications.create(
          'Error',
          finderro[j].name + ' is required.',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
    }

    let customfieldvalue = [];
    this.allkey = Object.keys(this.addreport.value);
    this.allvalue = Object.values(this.addreport.value);
    var alllength = this.allkey.length;
    for (var i = 0; i < this.field.length; i++) {
      for (var j = 0; j < alllength; j++) {
        if (this.field[i].fieldLabel != 'Image') {
          if (this.field[i].fieldLabel == this.allkey[j]) {
            let storecustomfield;

            storecustomfield = {
              visitReportCustomizeID: this.field[i].visitReportCustomizeID,
              value: this.allvalue[j],
            };

            customfieldvalue.push(storecustomfield);
          }
        }
      }
    }
    if (this.url) {
      customfieldvalue.push(this.url);
    }
    if (this.sign) {
      customfieldvalue.push(this.sign);
    }

    for (var k = 0; k < customfieldvalue.length; k++) {
      let body1 = {
        visitReportCustomizeID: customfieldvalue[k].visitReportCustomizeID,
        visitID: this.visitid,
        value: customfieldvalue[k].value,
        createBy: localStorage.getItem('company_id'),
        createByIp: this.ipAddress,
      };
      this.api
        .callApi(
          this.constant.CREATEVISITREPORTCUSTOMIZEFIELDVALUE,
          body1,
          'POST',
          true,
          true,
          true,
        )
        .subscribe((res1: any) => { });
    }
    this.notifications.create('Done', 'Report Submitted Successfully', NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
    setTimeout(() => {
      this.ngOnInit();
      this.closeModal.nativeElement.click();
      this.spinner.stop();
    }, 3000);
  }

  checkinoutsubmit() {

    if (!this.addcheckincheckout.valid) {
      return;
    }
    let body = {
      visitID: this.visitid,
      checkInDateTime: this.addcheckincheckout.value.checkInDateTime,
      checkOutDateTime: this.addcheckincheckout.value.checkOutDateTime,
    };
    this.api.callApi(this.constant.UPDATEVISIT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.ngOnInit();
            this.closeModal.nativeElement.click();
            if (this.addcheckincheckout.value.nextstep == 'NextVisitSchedule') {
              this.api.addRoute('/visits/myteamvisit');
              this.router.navigate([this.adminRoot + '/visits/nextvisitschedule/' + this.visitid]);
            } else {
              this.formValueStorageService.navigate(
                'ListMyteamvisitComponent',
                this.filterData,
                '/visits/listvisitcallfollowup',
                this.visitid,
              );

            }
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  onSelectFile(event: any, label) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      this.notifications.create(
        'Error',
        'Selected file format is not supported!!',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
    } else {
      this.file = event.target.files && event.target.files[0];
      if (this.file) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = {
            visitReportCustomizeID: label,
            value: String((<FileReader>event.target).result)
              .split(',')
              .pop(),
          };
        };
      }
    }
  }

  getImage(id) {
    this.sign = {
      visitReportCustomizeID: id,
      value: String(this.signaturePadElement.toDataURL()).split(',').pop(),
    };
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  reportshowdata(row) {
    this.api
      .callApi(
        this.constant.VIEWVISITREPORTFIELDCUSTOMIZE + row.visitID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.editvisitreportdatavalue = res.data;
          this.reportselected =
            this.editvisitreportdatavalue[0].visitReportCustomize.visitReportMasterID;
          // this.selectreport(this.editvisitreportdatavalue[0].visitReportCustomize.visitReportMasterID);
          let companyid = {
            companyMasterID: this.editvisitreportdatavalue[0].visitReportCustomize.companyMasterID,
          };
          this.reportdata(companyid);
          const body = {
            page: '',
            limit: '',
            companyMasterID: this.editvisitreportdatavalue[0].visitReportCustomize.companyMasterID,
            report_id: this.editvisitreportdatavalue[0].visitReportCustomize.visitReportMasterID,
          };
          this.spinner.start();
          this.api
            .callApi(
              this.constant.GETVISITREPORTCUSTOMIZEBYCOMPANYID,
              body,
              'POST',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.field = res.data;
                for (var s = 0; s < this.field.length; s++) {
                  this.field[s].fieldvalue = '';
                  this.field[s].fieldvalueid = '';
                }

                if (this.editvisitreportdatavalue) {
                  for (var i = 0; i < this.field.length; i++) {
                    for (var j = 0; j < this.editvisitreportdatavalue.length; j++) {
                      if (
                        this.field[i].visitReportCustomizeID ==
                        this.editvisitreportdatavalue[j].visitReportCustomizeID
                      ) {
                        // this.field[i].fieldvalue = this.editvisitreportdatavalue[j].value;
                        if (this.field[i].inputType == 'checkbox') {
                          this.field[i].fieldvalue = JSON.parse(this.editvisitreportdatavalue[j].value);
                        } else {
                          this.field[i].fieldvalue = this.editvisitreportdatavalue[j].value;
                        }
                        this.field[i].fieldvalueid =
                          this.editvisitreportdatavalue[j].visitReportCustomizeValueID;
                      }
                    }
                  }
                }
                this.spinner.stop();
              }
            });
          // this.getcustomizefields()
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
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
      'ListMyteamvisitComponent',
      this.filterData,
      '/visits/myteamvisit/edit_myteamvisit',
      rowData.visitID,
    );
  }


  navigateToListVisitCallFollowup(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListMyteamvisitComponent',
      this.filterData,
      '/visits/listvisitcallfollowup',
      rowData.visitID,
    );
  }


  downloadFile() {
    // let mainbody = {
    //   page: '',
    //   limit: '',
    //   userMasterID: localStorage.getItem('id'),
    //   filter: 'false',
    //   exportData: true
    // };
    if (!this.filterdate.valid) {
      return;
    }
    this.filterData.page = null
    this.filterData.limit = null
    this.filterData.exportData = true
    this.filterData.filter = 'true'
    this.filterData.startdate = this.filterdate.value.startdate;
    this.filterData.enddate = this.filterdate.value.enddate;
    this.filterData.status = this.filterdate.value.status;
    this.filterData.userMasterID = +this.filterdate.value.empid ? [+this.filterdate.value.empid] : this.copersonuserIDs;
    this.spinner.start('download');
    this.api
      .callApi(this.constant.MyTeamList, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );

    this.filterData.exportData = false,
      this.filterData.page = 1
    this.filterData.limit = 10
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Visit.xlsx');
    this.spinner.stop('download');
  }

  close(model) {
    this.selectedreport = null;
    this.addreport.reset();
    model.hide();
  }

  checkBoxChange(event, checkboxValues, selectedCheckbox, index) {
    if (!this.field[index].checkboxJson) {
      this.field[index].checkboxJson = {};
      for (let i = 0; i < checkboxValues.length; i++) {
        this.field[index].checkboxJson[checkboxValues[i]] = false;
      }
    }

    if (Object.keys(this.field[index].checkboxJson).includes(selectedCheckbox)) {
      this.field[index].checkboxJson[selectedCheckbox] = event.target.checked;
    }
  }
}
