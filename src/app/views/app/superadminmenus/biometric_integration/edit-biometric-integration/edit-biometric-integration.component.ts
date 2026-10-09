import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';


@Component({
    selector: 'app-edit-biometric-integration',
    templateUrl: './edit-biometric-integration.component.html',
    styleUrls: ['./edit-biometric-integration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditBiometricIntegrationComponent implements OnInit {
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

  formValue: any;

  integrationTypelist = [
    { name: 'AI Face Attendance', value: 'AIFaceAttendance' },
    { name: 'Ip Based Biometric', value: 'IpBasedBiometric' },
    { name: 'Parallel Database', value: 'parallelDatabase' },
  ];

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.getcompany();
    this.getDatabase();
    this.editdata();
    // this.values.push({serialno: ""});
  }

  editdata() {
    let bioid = this.formValue.ListBiometricIntegrationComponent.id;
    this.spinner.start('editdata');
    this.api
      .callApi(this.constant.GETBYIDBIOMETRICINTEGRATION + bioid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.biometricdata = res.data;
          // this.values.push({
          //   serialno: "",
          //   algorithm: "",
          //   table: "",
          //   database: "",
          //   tableList: [],
          //   databaseList: this.dbname1,
          //   serialNoList: []
          // });

          for (var i = 0; i < this.biometricdata.biometricSerialNo.length; i++) {
            this.values.push({
              integrationType: this.biometricdata.integrationType[i],
              readonly: true,
              serialno: this.biometricdata.biometricSerialNo[i],
              serverIp: this.biometricdata.serverIp[i],
              algorithm: Number(this.biometricdata.algorithm[i]),
              table: this.biometricdata.table[i],
              database: this.biometricdata.database[i],
              tableList: [],
              databaseList: this.dbname1,
              integrationTypelist: this.integrationTypelist,
              serialNoList: [],
              direction: this.biometricdata.direction && this.biometricdata.direction.length != 0 ? this.biometricdata.direction[i] : "",
            });
          }

          this.spinner.stop('editdata');
        },
        (err) => {
          console.log('error', err);

        },
      );
  }
  getcompany() {
    const body = {
      page: '',
      limit: '',
    };
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('comp');
        }
      });
  }
  addvalue() {
    this.values.push({
      integrationType: '',
      readonly: false,
      serialno: '',
      serverIp: '',
      algorithm: '',
      table: '',
      database: '',
      tableList: [],
      databaseList: this.dbname1,
      integrationTypelist: this.integrationTypelist,
      serialNoList: [],
      direction: '',

    });
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }
  increaseDropdown() {
    this.serialNumberIds.push({ id: this.serialNumberIds.length });
  }
  addValueComp(event: any) {
    if (event) {
      this.values.push({
        integrationType: '',
        readonly: false,
        serialno: '',
        serverIp: '',
        algorithm: '',
        table: '',
        database: '',
        tableList: [],
        databaseList: this.dbname1,
        integrationTypelist: this.integrationTypelist,
        serialNoList: [],
        direction: '',

      });
    } else {
      this.values = [];
    }
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
    for (var i = 0; i < this.values.length; i++) {
      if (serialNo.includes(this.values[i].serialno)) {
        this.notifications.create('Error', 'Duplicate Serial Number found', NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        setTimeout(() => {
          //this.router.navigate(['app/bank']);
          this.spinner.stop();
        }, 3000);
        return;
      } else {
        integrationType.push(this.values[i].integrationType);
        serialNo.push(this.values[i].serialno);
        serverIp.push(this.values[i].serverIp);
        algo.push(this.values[i].algorithm);
        table.push(this.values[i].table);
        database.push(this.values[i].database);
        direction.push(
          !this.values[i].direction
            ? (this.values[i].direction = '')
            : this.values[i].direction,
        );
      }
    }
    let body = {
      biometricIntegrationID: this.formValue.ListBiometricIntegrationComponent.id,
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
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };



    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEBIOMETRICINTEGRATION, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            if (res.added == 1) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.router.navigate([this.adminRoot + '/superadminmenus/biometric_integration']);

                this.spinner.stop();
              }, 3000);
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              setTimeout(() => {
                //this.router.navigate(['app/bank']);
                this.spinner.stop();
              }, 3000);
            }
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

  onSubmit1() {
    const body = {
      tablename: this.addtable.value.tablename2,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATETABLE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          if (res.message == 'Table Created Successfully') {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              window.location.reload();
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/superadminmenus/biometric_integration/add_biometric_integration']);
              this.spinner.stop();
            }, 3000);
          }
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          setTimeout(() => {
            //this.router.navigate(['app/bank']);
            this.spinner.stop();
          }, 3000);
        }
      });
  }

  getDatabase() {
    this.tablename1 = [];
    this.serialNo1 = [];
    this.spinner.start('database');
    this.api
      .callApi(this.constant.GETDBNAME, {}, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.dbname1 = res.data;
          this.spinner.stop('database');
        }
      });
  }
  getTables(id: any, i: any) {

    this.values[i].tableList = [];
    this.values[i].serialNoList = [];
    this.values[i].table = '';
    this.values[i].serialno = '';
    this.values[i].serverIp = '';
    if (!id) {
      return;
    }

    this.finalDBNAME = id;
    const body = {
      name: id,
    };
    this.spinner.start('table');
    this.api
      .callApi(this.constant.GETTABLENAME, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.values[i].tableList = res.data;
          this.spinner.stop('table');
        }
      });
  }
  getSerialNo(id: any, i: any) {
    this.values[i].serialNoList = [];
    this.values[i].serialno = '';
    this.values[i].serverIp = '';
    if (!id) {
      return;
    }
    if (id == 'AIFaceAttendance') {
      return;
    }
    const body = {
      tablename: id,
      dbname: this.values[i].database,
    };
    this.spinner.start('serial');
    this.api
      .callApi(this.constant.GETSERIALNO, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.values[i].serialNoList = res.data;
          this.spinner.stop('serial');
        }
      });
  }

  clear() {
    window.location.reload();
  }
  checkBioSerial(number: any, ij: any) {
    if (!number) {
      return;
    }

    let count = 0;
    for (var i = 0; i < this.values.length; i++) {
      if (number == this.values[i].serialno) {
        count++;
      }
    }
    if (count > 1) {
      alert('Already Used');
      this.values[ij].serialno = '';
    }
  }


  checkAlgorithm(number: any, ij: any) {
    if (!number) {
      return;
    }

    // if (ij != 3) this.values[ij].direction = null;
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

  onIntegrationTypeChange(index: any) {
    this.values[index].tableList = [];
    this.values[index].serialNoList = [];

    this.values[index].database = '';
    this.values[index].table = '';
    this.values[index].serialno = '';
    this.values[index].serverIp = '';
  }
}
