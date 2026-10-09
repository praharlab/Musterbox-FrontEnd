import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-biometric-list',
    templateUrl: './add-biometric-list.component.html',
    styleUrls: ['./add-biometric-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddBiometricListComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addtable') addtable: NgForm;
  adminRoot = environment.adminRoot;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  comp: any;

  dbname1: any;
  tablename1: any;
  serialNo1: any;
  serialNumberIds: any = [];
  values = [];
  checkSerialNo: any;
  defaultTable: any;
  defaultSno: any;
  finalDBNAME: any;
  biometricdata: any;
  selectedCompany: any;

  formValue: any;

  integrationTypelist = [
    { name: 'AI Face Attendance', value: 'AIFaceAttendance' },
    { name: 'Ip Based Biometric', value: 'IpBasedBiometric' },
  ];

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.selectedCompany = +localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
    this.editdata(this.selectedCompany);
  }

  editdata(companyMasterID) {
    this.values = [];
    if (companyMasterID == undefined || !companyMasterID) {
      this.selectedCompany = +localStorage.getItem('company_id');
      companyMasterID = this.selectedCompany;
    }
    const body = {
      companyMasterID: companyMasterID,
    };
    this.spinner.start('editdata');
    this.api.callApi(this.constant.GETTABLEANDDB, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.biometricdata = res.data;
        if (this.biometricdata == null) {
          this.values.push({
            biometricIntgrationID: null,
            integrationType: '',
            readonly: false,
            serialno: '',
            serverIp: '',
            algorithm: '',
            table: '',
            database: '',
            tableList: [],
            integrationTypelist: this.integrationTypelist,
            serialNoList: [],
            direction: '',
            requiredparallelDatabase: false,
            notrequiredparallelDatabase: true,
            isdeleted: false,
          });
        } else {
          for (let i = 0; i < this.biometricdata.biometricSerialNo.length; i++) {
            const value = {
              biometricIntgrationID: this.biometricdata.biometricIntegrationID,
              serialno: this.biometricdata.biometricSerialNo[i],
              algorithm: Number(this.biometricdata.algorithm?.[i]) || 0,
              database: this.biometricdata.database?.[i] || '',
              table: this.biometricdata.table?.[i] || '',
              direction: this.biometricdata.direction?.[i] || '',
              integrationType: this.biometricdata.integrationType?.[i] || '',
              serverIp: this.biometricdata.serverIp?.[i] || '',
              readonly: true,
              requiredparallelDatabase: false,
              notrequiredparallelDatabase: true,
              isdeleted: false,
            };

            if (value.integrationType === 'parallelDatabase') {
              value.requiredparallelDatabase = true;
            } else {
              value.notrequiredparallelDatabase = true;
            }

            this.values.push(value);
          }
        }
        this.spinner.stop('editdata');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('editdata');
      },
    );
  }

  getcompany() {
    const body = {
      companyMasterID: this.selectedCompany,
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
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }
  addvalue() {
    this.values.push({
      biometricIntgrationID: null,
      integrationType: '',
      readonly: false,
      serialno: '',
      serverIp: '',
      algorithm: '',
      table: '',
      database: '',
      tableList: [],
      integrationTypelist: this.integrationTypelist,
      serialNoList: [],
      direction: '',
      requiredparallelDatabase: false,
      notrequiredparallelDatabase: true,
      isdeleted: false,
    });
  }
  removevalue(i) {
    // this.values.splice(i, 1);
    this.values[i].isdeleted = true;
  }
  increaseDropdown() {
    this.serialNumberIds.push({ id: this.serialNumberIds.length });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const integrationType = [];
    const serialNo = [];
    const algo = [];
    const table = [];
    const database = [];
    const direction = [];
    const serverIp = [];

    for (let i = 0; i < this.values.length; i++) {
      const item = this.values[i];

      // Apply filter conditions
      if (
        (!item.isdeleted && item.biometricIntgrationID) ||
        (!item.biometricIntgrationID && !item.isdeleted)
      ) {
        if (serialNo.includes(item.serialno) && !item.isdeleted) {
          const duplicateSerialNumber = 'Duplicate Serial Number found';
          this.handleError(duplicateSerialNumber);
          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
          return;
        } else {
          integrationType.push(item.integrationType);
          serialNo.push(item.serialno);
          serverIp.push(item.serverIp);
          algo.push(item.algorithm);
          table.push(item.table);
          database.push(item.database);
          direction.push(item.direction || '');
        }
      }
    }

    if (this.biometricdata == null) {
      let body = {
        companyMasterID: this.addcomp.value.company,
        integrationType: integrationType,
        biometricSerialNo: serialNo,
        // databaseName: this.addcomp.value.dbname,
        algorithm: algo,
        table: table,
        database: database,
        direction: direction,
        serverIp: serverIp,
      };
      this.spinner.start('biometricdata');
      this.api
        .callApi(this.constant.ADDBIOMETRICINTEGRATION, body, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              if (res.added == 1) {
                this.handleSuccess(res.message);
                setTimeout(() => {
                  this.router.navigate([this.adminRoot + '/attendances/biometric_list']);
                  this.spinner.stop('biometricdata');
                }, 3000);
              } else {
                this.handleError(res.message);
                setTimeout(() => {
                  this.spinner.stop('biometricdata');
                }, 3000);
              }
            } else {
              this.handleError(res.message);
              this.spinner.stop('biometricdata');
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('biometricdata');
          },
        );
    } else {
      let body = {
        biometricIntegrationID: this.biometricdata.biometricIntegrationID,
        integrationType: integrationType,
        companyMasterID: this.addcomp.value.company,
        biometricSerialNo: serialNo,
        // databaseName: this.addcomp.value.dbname,
        algorithm: algo,
        table: table,
        database: database,
        direction: direction,
        serverIp: serverIp,
        // tableName: this.addcomp.value.tablename,
      };
      this.spinner.start('biometricdata');
      this.api
        .callApi(this.constant.UPDATEBIOMETRICINTEGRATION, body, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              if (res.added == 1) {
                this.handleSuccess(res.message);
                setTimeout(() => {
                  this.router.navigate([this.adminRoot + '/attendances/biometric_list']);
                  this.spinner.stop('biometricdata');
                }, 3000);
              } else {
                this.handleError(res.message);
                setTimeout(() => {
                  this.spinner.stop('biometricdata');
                }, 3000);
              }
            } else {
              this.handleError(res.message);
              this.spinner.stop('biometricdata');
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('biometricdata');
          },
        );
    }
  }

  clear() {
    window.location.reload();
  }

  checkAlgorithm(number: any, ij: any) {
    if (!number) {
      return;
    }
    if (number == 3 || number == 5 || number == 6) {
    } else {
      this.values[ij].direction = null;
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  // getTables(id: any, i: any) {
  //   this.values[i].tableList = [];
  //   this.values[i].serialNoList = [];
  //   this.values[i].table = '';
  //   this.values[i].serialno = '';
  //   this.values[i].serverIp = '';
  //   if (!id) {
  //     return;
  //   }

  //   this.finalDBNAME = id;
  //   const body = {
  //     name: id,
  //   };
  //   this.spinner.start('table');
  //   this.api
  //     .callApi(this.constant.GETTABLENAME, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.values[i].tableList = res.data;
  //         this.spinner.stop('table');
  //       }
  //     });
  // }
  // getSerialNo(id: any, i: any) {
  //   this.values[i].serialNoList = [];
  //   this.values[i].serialno = '';
  //   this.values[i].serverIp = '';
  //   if (!id) {
  //     return;
  //   }
  //   if (id == 'AIFaceAttendance') {
  //     return;
  //   }
  //   const body = {
  //     tablename: id,
  //     dbname: this.values[i].database,
  //   };
  //   this.spinner.start('serial');
  //   this.api
  //     .callApi(this.constant.GETSERIALNO, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.values[i].serialNoList = res.data;
  //         this.spinner.stop('serial');
  //       }
  //     });
  // }
  onIntegrationTypeChange(index: any) {
    this.values[index].tableList = [];
    this.values[index].serialNoList = [];

    this.values[index].database = '';
    this.values[index].table = '';
    this.values[index].serialno = '';
    this.values[index].serverIp = '';
  }

  removeInTimeValues(i: number): void {
    const count = this.values.filter((element) => !element.isdeleted).length;

    if (count > 1) {
      this.values[i].isdeleted = true;
    } else {
      return;
    }
  }
}
