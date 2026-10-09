import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-add-biometric-user',
    templateUrl: './add-biometric-user.component.html',
    styleUrls: ['./add-biometric-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddBiometricUserComponent implements OnInit {
  @ViewChild('adddata') adddata: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  apiURL = environment.apiUrl;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  category: any;
  user: any;
  salary: boolean;
  erpdata1: any;
  adminRoot = environment.adminRoot;
  values: any;
  formValue: any;
  biometricUserSerialNo: any;
  biometricUserSerialNo1: any;
  image: null;
  facePhoto: any
  serverIp: null;
  selectedUser: any = {
    enrollid: '',
    firstName: '',
    lastName: '',
    biometricSerialNo: '',
    photo: ''
  }
  selectedDevice: any = {}
  biometricList: any= []
  biometricCompanyData: any = []


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    
    this.selectedUser = this.formValue?.editEmployeeMasterComponent?.body;
    this.selectedUser.enrollid = ''
    this.selectedUser.userMasterID = this.formValue?.editEmployeeMasterComponent?.id;

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = this.formValue?.editEmployeeMasterComponent?.body?.companyMasterID;
    this.getIPAddress();
    this.companyid();
    this.main()
    this.getEmpJoiningData()
  }

  onFileChange(event: any) {


    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null

  }

  onSubmit() {
    if (!this.adddata.valid) {
      return;
    }

    this.serverIp = this.biometricList.find((x) => x.serialno == this.adddata.value.biometricSerialNo).serverIp;

    const formData = new FormData();
    formData.append('biometricUserSerialNo', this.adddata.value.biometricSerialNo);
    formData.append('isAdmin', this.adddata.value.isAdmin);
    formData.append('firstName', this.adddata.value.short);
    formData.append('lastName', this.adddata.value.cpn);
    formData.append('enrollid', this.adddata.value?.enrollid);
    formData.append('face', this.image ? this.image : this.facePhoto);
    formData.append('serverIp', this.serverIp);
    formData.append('createBy', this.ipAddress);
    formData.append('userMasterID', this.selectedUser?.userMasterID);

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.api.callApi(this.constant.ADDBIOMETRICUSER, formData, 'POST', true, true, true).subscribe(
      (res: any) => {

        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            // this.router.navigate([this.adminRoot + '/attendances/list-biometricUser']);
            this.navigateToEditPage()
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {

          this.buttonDisabled = false;
          this.notifications.create('Error', res.message || 'An unknown error occurred', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        console.log(err, "err");

        // Extract error message if available
        const errorMessage = err?.error?.message || 'An unknown error occurred';

        this.buttonDisabled = false;
        this.notifications.create('Error', errorMessage, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  navigateToEditPage(): void {
    this.formValueStorageService.navigate(
      'BiometricListComponent',
      {serverIp: this.serverIp},
      '/attendances/list-biometricUser',
      this.adddata.value.biometricSerialNo,
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  companyid() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
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

  main() {
    this.spinner.start('biometricList');
    let body = {
      companyMasterID: this.company_id,
    };

    this.biometricList = []

    this.api
      .callApi(this.constant.GETBIOMETRICLIST, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          // this.biometricList = res.data;
          const data = res.data.map((x) => {
            if(x.integrationType == 'AIFaceAttendance'){
              this.biometricList.push(x);
              return x;
            }
          })
        }
        this.spinner.stop('biometricList');
      });

  }

  getEmpJoiningData(){
    this.api
    .callApi(this.constant.GETEMPJOININGDATA + '/' + this.selectedUser.userMasterID, {}, 'GET', false, false, true)
    .subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.selectedUser.enrollid = res.data.biometricCode;

          if(this.selectedUser.photo){

          this.api
          .callApi('uploads/user/photo/' + this.selectedUser.photo, {}, 'GET', false, false, true, true)
          .subscribe(
            (res) => {
              const file = new File([res], this.selectedUser.photo, {
                type: 'image/jpeg',
              });
              this.selectedUser.photo = file.name;
              this.facePhoto = file;
            },
            (error) => {
            }
          )
        }
          }
        },
        (err) => {
          this.notifications.create('Opps!', 'Something Went Wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }
}
