import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient } from '@angular/common/http';


import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-biometric-list',
    templateUrl: './biometric-list.component.html',
    styleUrls: ['./biometric-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BiometricListComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  rows1 = [];
  selected: any = [];
  apiURL = environment.apiUrl;
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
    id: '',
    serialNo: '',
    fromDate: '',
    toDate: '',
    status: '',
    serverIp:''
  };
  body1 = {
    page: 1,
    limit: 10,
    companyid: '',
    biometricSerialNo: '',
    biometricstatus: '',
    startdate: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  company_id: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  company1: any;
  filter: string;
  biometricSerialNo: any = [];
  selectedValue: any;
  all: boolean;
  pending: boolean;
  selectedSerial: any;
  image: any;
  algoName: any;
  description: any;
  adminRoot = environment.adminRoot;
  ipAddress: any;
  formValue:any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = [+localStorage.getItem('company_id')];
    this.checkpermission();
    this.main();
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
              permissionval.formName == 'Biometric' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Biometric' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Biometric' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Biometric' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  main() {
    let body = {
      companyMasterID: this.company_id,
    };

    this.api
      .callApi(this.constant.GETBIOMETRICLIST, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.checkstatus()
        }
        this.page.totalCount = res.totalcount;
        this.spinner.stop();
      });
  }
  onSubmit() {
    if (!this.datefilter.valid) return;

    this.company_id = this.datefilter.value.company;
    this.main();
  }

  showAlgoDetails(algoName: any) {
    this.algoName = algoName;

    if (algoName == 'InOut-InOut') {
      this.description =
        'InOut-InOut algorithm is used to validate users biometric logs and to create attendance out of it, which can take multiple logs for same day, by applying all the parameters and policies like Attendance Policy,Shift,Overtime etc *If Applicable';
    } else if (algoName == 'FirstIn-LastOut') {
      this.description =
        "FirstIn-LastOut algorithm is used to validate users biometric logs and to create attendance, which takes the First & Last log of a day and use it as In & Out log, by applying all the parameters and policies like Attendance Policy,Shift,Overtime etc *If Applicable, all the other logs for the day will be neglected and will have the status of 'NOT CONSIDER' out of it ";
    } else if (algoName == 'As per Log direction') {
      this.description =
        'As per Log direction algorithm is used to validate users biometric logs and to create attendance out of it, which take the logs direction generated by the Biometric machine, by applying all the parameters and policies like Attendance Policy,Shift,Overtime etc *If Applicable';
    } else {
      this.description = '';
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/attendances/biometric_list/add_biometric/']);
  }

  alertConfirmation() {
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
          companyMasterID: this.datefilter.value.company,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEBIOMETRICINTEGRATIONBYCOMPANYMASTERID, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
              } else {
                this.handleError(res.message)
                setTimeout(() => {
                  this.spinner.stop();
                }, 3000);
              }
              this.main();
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message)
              this.spinner.stop();
            },
          );
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  navigateToBiometricPage(rowData: any): void {
    this.filterData.serverIp = rowData.serverIp;
    this.formValueStorageService.navigate(
      'BiometricListComponent',
      this.filterData,
      '/attendances/list-biometricUser',
      rowData.serialno,
    );
  }


  checkstatus() {
    this.rows.map((row) => {
      row.onlineStatus = 'offline'
      if (row.integrationType == 'AIFaceAttendance') {


        let body = {
          biometricSerialNo: row.serialno,
          serverIp: row.serverIp
        };

        this.api
          .callApi(this.constant.CHECKBIOMETRICSTATUS, body, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status === 200) {
                row.onlineStatus = res.message === 'offline' ? 'offline' : 'online';
              } else {
                row.onlineStatus = 'offline';
              }
            },
            (err) => {
              row.onlineStatus = 'offline';
            },
          );
      }
    })
  }

}
