import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-mygatepass',
    templateUrl: './edit-mygatepass.component.html',
    styleUrls: ['./edit-mygatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditMygatepassComponent implements OnInit {
  @ViewChild('addvisitor') addvisitor: NgForm;
  @ViewChild('addmeetingPlace') addmeetingPlace: NgForm;
  @ViewChild('editgatepass') editgatepass: NgForm;
  adminRoot = environment.adminRoot;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  user: any;
  category: any;
  meetingplace: any;
  gatepassdata: any;
  checktime: any;
  base64textString: string;
  editdatavisitor: number;
  editdataemployee: number;
  users: any;
  formValue: any;
  image: null;
  values = [];
  personNameAndPhone: { personName: string, personNumber: string }[] = [];



  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
    this.editdata();
    this.checktime = new Date();
    this.checktime = this.datePipe.transform(this.checktime, 'HH:mm');
  }

  editdata() {
    let companyid = this.formValue.GatepassByUserComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWGATEPASSDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.gatepassdata = res.data;
          if ((this.gatepassdata = res.data.ToTime == null)) this.gatepassdata = res.data;

          this.getuser(localStorage.getItem('company_id'));
          if (this.gatepassdata.visitortype == 'visitor') {
            this.editdatavisitor = Number(this.gatepassdata.visitorsid);
          } else {
            this.editdataemployee = Number(this.gatepassdata.visitorsid);
          }

          this.gatepassdata.companyMasterID = Number(this.gatepassdata.companyMasterID);
          this.gatepassdata.userMasterID = Number(this.gatepassdata.userMasterID);
          this.base64textString = this.gatepassdata.attachment;
          this.companyid(this.gatepassdata.companyMasterID);

          // let respo: any = [];
          if (this.gatepassdata.personName && this.gatepassdata.personName.length > 0) {
            for (let i = 0; i < this.gatepassdata.personName.length; i++) {              
              this.personNameAndPhone.push({ personName: this.gatepassdata.personName[i], personNumber: this.gatepassdata.personNumber[i] != null ? this.gatepassdata.personNumber[i] : "" });
              // respo.push({ value: this.gatepassdata.personName[i] });
            }
            // this.values = respo;

          } else {
            // this.values.push({ value: '' });
            this.personNameAndPhone.push({ personName: '', personNumber: '' });

          }
          this.spinner.stop();
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
  addValue() {
    // this.values.push({ value: '' });
    this.personNameAndPhone.push({ personName: '', personNumber: '' });

  }

  removeValue(i: number) {
    // this.values.splice(i, 1);
    this.personNameAndPhone.splice(i,1);

  }
  visitortype(event: any) {
    this.gatepassdata.visitortype = event;
  }

  getuser(id: any) {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.users = res.data;
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
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.editgatepass.valid) {
      return;
    }
    let body;
    let tempID;

    if (this.editgatepass.value.visitor_type == 'visitor') {
      tempID = this.editgatepass.value.visitorsid;
    } else {
      tempID = this.editgatepass.value.employee;
    }
    // const personName = this.values
    //   .map((item) => item.value?.trim()) // Trim whitespace and map to values
    //   .filter((value) => value && value.length > 0);


    const personName = [];
    const personNumber = [];
    const personNameAndPhone = [];
    this.personNameAndPhone.map((item, index) => {
      if (item.personName?.trim() || item.personNumber) {
        if (item.personName?.trim() && !item.personNumber) {
          this.personNameAndPhone[index].personNumber = "";
        }
        if (!item.personName?.trim() && item.personNumber) {
          this.personNameAndPhone[index].personName = "";
        }
        personName.push(this.personNameAndPhone[index].personName);
        personNumber.push(this.personNameAndPhone[index].personNumber);
        personNameAndPhone.push(this.personNameAndPhone[index]);
      }
    });
    this.personNameAndPhone = personNameAndPhone;
    


    if (!this.editgatepass.value.meetingPlaceID) {
      body = {
        gatePassid: this.formValue.GatepassByUserComponent.id,
        visitorsid: tempID,
        userMasterID: localStorage.getItem('id'),
        fromTime: this.editgatepass.value.fromTime,
        toTime: this.editgatepass.value.toTime,
        date: this.editgatepass.value.date,
        companyMasterID: localStorage.getItem('company_id'),
        meetingPlaceID: null,
        remarks: this.editgatepass.value.remarks,
        attachment: this.base64textString,
        noofperson: Number(this.editgatepass.value.noofpeople),
        personName: personName,
        personNumber: personNumber,
        vehicleNo: this.editgatepass.value.vehicleno,
        visitortype: this.editgatepass.value.visitor_type,
        status: '1',
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    } else {
      body = {
        gatePassid: this.formValue.GatepassByUserComponent.id,
        visitorsid: tempID,
        userMasterID: localStorage.getItem('id'),
        fromTime: this.editgatepass.value.fromTime,
        toTime: this.editgatepass.value.toTime,
        date: this.editgatepass.value.date,
        companyMasterID: localStorage.getItem('company_id'),
        meetingPlaceID: this.editgatepass.value.meetingPlaceID,
        remarks: this.editgatepass.value.remarks,
        attachment: this.base64textString,
        noofperson: Number(this.editgatepass.value.noofpeople),
        personName: personName,
        personNumber: personNumber,
        vehicleNo: this.editgatepass.value.vehicleno,
        visitortype: this.editgatepass.value.visitor_type,
        status: '1',
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    }

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATEGATEPASS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          if (res.added == 1) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/gatepasses/mygatepass']);

              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('ERROR', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            setTimeout(() => {
              // this.router.navigate(['app/edit_mygatepass/{{ row.gatePassid }}'])
              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop();
            }, 3000);
          }
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  companyid(id: number) {
    this.api
      .callApi(this.constant.GETVISITORDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.category = res.data;
          this.spinner.stop();
        }
      });

    this.api
      .callApi(this.constant.GETMEETINGPLACEDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.meetingplace = res.data;
          this.spinner.stop();
        }
      });

    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.user.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop();
        }
      });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    } else {
      this.image = null;
    }
  }

  onSubmit1() {
    if (!this.addvisitor.valid) {
      return;
    }
    let companyMasterID;
    const formData = new FormData();
    if (this.childcompany == 'false') {
      companyMasterID = this.addvisitor.value.companyMasterID;
      formData.append('companyMasterID', this.addvisitor.value.companyMasterID);
    } else {
      companyMasterID = localStorage.getItem('company_id');
      formData.append('companyMasterID', this.addvisitor.value.companyMasterID);
    }
    formData.append('visitorsFirstName', this.addvisitor.value.visitorsFirstName);
    formData.append('visitorsLastName', this.addvisitor.value.visitorsLastName);
    formData.append('visitorsPhone', this.addvisitor.value.visitorsPhone);
    formData.append('visitorsComapny', this.addvisitor.value.visitorsComapny);
    if (this.image) {
      formData.append('visitorPhoto', this.image);
    }
    formData.append('status', '1');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEVISITOR, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.ngOnInit();
          this.companyid(companyMasterID);
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            // this.router.navigate(['app/visitor'])
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  onSubmit2() {
    if (!this.addmeetingPlace.valid) {
      return;
    }
    let body;
    if (this.childcompany == 'false') {
      body = {
        meetingPlaceName: this.addmeetingPlace.value.meetingPlaceName,
        companyMasterID: this.addmeetingPlace.value.companyMasterID,
        status: '1',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        meetingPlaceName: this.addmeetingPlace.value.meetingPlaceName,
        companyMasterID: localStorage.getItem('company_id'),
        status: '1',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEMEETINGPLACE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.ngOnInit();
          this.companyid(body.companyMasterID);
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            // this.router.navigate(['app/meetingPlace'])
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
    // this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.base64textString = btoa(e.target.result);
  }
}
