import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-add-mygatepass',
    templateUrl: './add-mygatepass.component.html',
    styleUrls: ['./add-mygatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMygatepassComponent implements OnInit {
  @ViewChild('addvisitor') addvisitor: NgForm;
  @ViewChild('addmeetingPlace') addmeetingPlace: NgForm;
  @ViewChild('addgatepass') addgatepass: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  selected: any;
  childcompany: string;
  user: any;
  users: any;
  category: any;
  meetingplace: any;
  empList: any;
  comp: any;
  checkdate: any;
  dateF: any = new Date().toLocaleDateString();
  myDate: any;
  usermaster: any;
  checktime: any;
  base64textString: any;
  visitor_type1: any;
  adminRoot = environment.adminRoot;
  image: null;
  values = [];
  personNameAndPhone: {personName: string,personNumber: string}[] = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    // this.values.push({ value: '' });
    this.personNameAndPhone.push({personName: '',personNumber: ''});

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.usermaster = localStorage.getItem('id');
    this.getIPAddress();
    this.getcompany();
    this.getuser(localStorage.getItem('company_id'));
    this.companyid(localStorage.getItem('company_id'));
    this.checkdate = new Date();
    this.checkdate = this.datePipe.transform(this.checkdate, 'yyyy-MM-dd');
  }

  visitortype(event: any) {
    this.visitor_type1 = event;
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop();
        }
      });
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

  companyid(id: any) {
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
  }
  addValue() {
    // this.values.push({ value: '' });
    this.personNameAndPhone.push({personName: '',personNumber: ''});
  }

  removeValue(i: number) {
    // this.values.splice(i, 1);
    this.personNameAndPhone.splice(i,1);
  }
  onSubmit() {
    if (!this.addgatepass.valid) {
      return;
    }
    let body;
    let tempID;

    if (this.addgatepass.value.visitor_type == 'visitor') {
      tempID = this.addgatepass.value.visitorsid;
    } else {
      tempID = this.addgatepass.value.employee;
    }
  

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


    if (!this.addgatepass.value.meetingPlaceID) {
      body = {
        visitorsid: tempID,
        userMasterID: localStorage.getItem('id'),
        date: this.addgatepass.value.date,
        fromTime: this.addgatepass.value.fromTime,
        toTime: this.addgatepass.value.toTime,
        companyMasterID: localStorage.getItem('company_id'),
        meetingPlaceID: null,
        remarks: this.addgatepass.value.remarks,
        attachment: this.base64textString,
        noofperson: Number(this.addgatepass.value.noofpeople),
        personName: personName,
        personNumber: personNumber,
        vehicleNo: this.addgatepass.value.vehicleno,
        visitortype: this.addgatepass.value.visitor_type,
        status: '1',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        visitorsid: tempID,
        userMasterID: localStorage.getItem('id'),
        date: this.addgatepass.value.date,
        fromTime: this.addgatepass.value.fromTime,
        toTime: this.addgatepass.value.toTime,
        companyMasterID: localStorage.getItem('company_id'),
        meetingPlaceID: this.addgatepass.value.meetingPlaceID,
        remarks: this.addgatepass.value.remarks,
        attachment: this.base64textString,
        noofperson: Number(this.addgatepass.value.noofpeople),
        personName: personName,
        personNumber: personNumber,
        vehicleNo: this.addgatepass.value.vehicleno,
        visitortype: this.addgatepass.value.visitor_type,
        status: '1',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEGATEPASS, body, 'POST', true, true, true).subscribe(
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
              this.router.navigate([this.adminRoot + '/gatepasses/mygatepass/add_mygatepass']);

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

  checkmonth(data: any) {}

  checktime1(data: any) {}

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
