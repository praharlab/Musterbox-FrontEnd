import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NgxSignaturePadComponent } from 'src/app/components/signature-pad/ngx-signature-pad.module';

@Component({
    selector: 'app-add-joining-request-form',
    templateUrl: './add-joining-request-form.component.html',
    styleUrls: ['./add-joining-request-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddJoiningRequestFormComponent implements OnInit {
  @ViewChild('addEmployeeJoiningRequest') addEmployeeJoiningRequest: NgForm;
  @ViewChild('sign', { static: true }) signaturePadElement: NgxSignaturePadComponent;
  adminRoot = environment.adminRoot;
  ipAddress: any;
  selecteddesignation: any;
  selectedbranch: any;
  selecteddepartment: any;
  allbranch: any = [];
  alldepartment: any = [];
  alldesignation: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  companyid: any;
  showdepart: boolean = false;
  file: any;
  file1: any;
  file2: any;
  file3: any;
  file4: any;
  file5: any;
  bankdata: any;
  values = [];
  relation: any;
  dob: any;
  familyMemberName: any;
  companyMasterID: any;
  presentCountry: any = [];
  presentState: any = [];
  presentCity: any = [];

  presentSelectedstate: any;
  presentSelectedcity: any;
  presentFinalcityid: any;

  permenentCountry: any = [];
  permenentState: any = [];
  permenentCity: any = [];

  permenantSelectedState: any;
  permenantCity: any;
  permenentFinalCityid: any;

  comp: any;

  currentDate: string;
  format: any;
  url: any;
  presentAddress: any;
  permenentAddress: any;
  permanentSelectedcountry: any;
  presentSelectedcountry: any;
  permanentSelectedstate: any;
  permanentSelectedcity: any;
  permanentCountry: any;
  permanentState: any;
  permanentCity: any;
  copyAddress = false;

  signatureData: any;
  config = {
    minWidth: 1, // Minimum line width for the signature
    canvasWidth: 100, // Width of the signature pad
    canvasHeight: 75, // Height of the signature pad
  };
  currDate: any = new Date().toISOString().slice(0, 10);

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 10);
    (this.companyMasterID = +localStorage.getItem('company_id')), this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.getAllData(this.companyMasterID);
    this.getallcountry();
  }
  getcompany() {
    const body = {
      companyMasterID: +localStorage.getItem('company_id'),
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

  onCopyAddress(event: any) {
    this.copyAddress = event.target.checked;
    if (this.copyAddress) {
      this.copyAddressDetails();
    }
  }

  // Method to copy present address details to permanent address
  copyAddressDetails() {
    this.permenentAddress = this.presentAddress;
    this.permenentCountry = this.presentCountry;
    this.permenentState = this.presentState;
    this.permenentCity = this.presentCity;
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
              permissionval.formName == 'EmployeeJoiningRequestForm' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeJoiningRequestForm' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeJoiningRequestForm' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeJoiningRequestForm' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
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
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }

  onSelectFile1(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    this.file1 = event.target.files && event.target.files[0];
    if (this.file1) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file1);
      if (this.file1.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file1.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }
  onSelectFile2(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    this.file2 = event.target.files && event.target.files[0];
    if (this.file2) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file2);
      if (this.file2.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file2.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }

  onSelectFile3(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    this.file3 = event.target.files && event.target.files[0];
    if (this.file3) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file3);
      if (this.file3.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file3.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }

  onSelectFile4(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    this.file4 = event.target.files && event.target.files[0];
    if (this.file4) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file4);
      if (this.file4.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file4.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }

  onSelectFile5(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    this.file5 = event.target.files && event.target.files[0];
    if (this.file5) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file5);
      if (this.file5.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file5.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }

  onSubmit() {
    if (!this.addEmployeeJoiningRequest.valid) {
      return;
    }
    if (!this.signatureData) {
      return this.notifications.create('Error', 'Confirm Signature First', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
    let finalBody = [];

    this.values.forEach((value) => {
      if (!value.deleted) {
        finalBody.push({
          familyMemberName: value.familyMemberName,
          relation: value.relation,
          dob: value.familydob,
          gender: value.familygender,
        });
      }
    });

    if (this.copyAddress == true) {
      (this.addEmployeeJoiningRequest.value.permenetAddress =
        this.addEmployeeJoiningRequest.value.presentAddress),
        (this.addEmployeeJoiningRequest.value.permenantCity1 =
          this.addEmployeeJoiningRequest.value.presentCity1);
    }

    const formData = new FormData();
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('companyMasterID', this.addEmployeeJoiningRequest.value.company);
    formData.append('branchMasterID', this.addEmployeeJoiningRequest.value.branchID);
    formData.append('departmentId', this.addEmployeeJoiningRequest.value.departmentID);
    formData.append('designationId', this.addEmployeeJoiningRequest.value.designationID);
    formData.append('bankMasterID', this.addEmployeeJoiningRequest.value.bankMasterID);
    formData.append(
      'presentAddressCityID',
      this.addEmployeeJoiningRequest.value.presentCity1
        ? this.addEmployeeJoiningRequest.value.presentCity1
        : null,
    );
    formData.append(
      'permenetAddressCityID',
      this.addEmployeeJoiningRequest.value.permenantCity1
        ? this.addEmployeeJoiningRequest.value.permenantCity1
        : null,
    );
    formData.append('mobileNumber', this.addEmployeeJoiningRequest.value.mobileNumber);
    formData.append('aadharNumber', this.addEmployeeJoiningRequest.value.aadharNumber);
    formData.append('dateOfJoining', this.addEmployeeJoiningRequest.value.dateOfJoining);
    formData.append('photo', this.file ? this.file : '');
    formData.append('firstName', this.addEmployeeJoiningRequest.value.firstName);
    formData.append('middleName', this.addEmployeeJoiningRequest.value.middleName);
    formData.append('lastName', this.addEmployeeJoiningRequest.value.lastName);
    formData.append('nameAsAAdhar', this.addEmployeeJoiningRequest.value.nameAsAAdhar);
    formData.append('presentAddress', this.addEmployeeJoiningRequest.value.presentAddress);
    formData.append('permenetAddress', this.addEmployeeJoiningRequest.value.permenetAddress);
    formData.append('dob', this.addEmployeeJoiningRequest.value.dob);
    formData.append('maratialStatus', this.addEmployeeJoiningRequest.value.maratialStatus);
    formData.append('gender', this.addEmployeeJoiningRequest.value.gender);
    formData.append('panCardNo', this.addEmployeeJoiningRequest.value.panCardNo);
    formData.append('shirtSize', this.addEmployeeJoiningRequest.value.shirtSize);
    formData.append('pantSize', this.addEmployeeJoiningRequest.value.pantSize);
    formData.append('shoesSize', this.addEmployeeJoiningRequest.value.shoesSize);
    formData.append('salary', this.addEmployeeJoiningRequest.value.salary);
    formData.append('bankAccountNumber', this.addEmployeeJoiningRequest.value.bankAccountNumber);
    formData.append('IFSCNumber', this.addEmployeeJoiningRequest.value.IFSCNumber);
    formData.append('ESICNumber', this.addEmployeeJoiningRequest.value.ESICNumber);
    formData.append('uanNumber', this.addEmployeeJoiningRequest.value.uanNumber);
    formData.append('remarks', this.addEmployeeJoiningRequest.value.remarks);
    formData.append('nestedbody', JSON.stringify(finalBody));
    formData.append('aadharCardPhoto', this.file1 ? this.file1 : '');
    formData.append('panCardPhoto', this.file2 ? this.file2 : '');
    formData.append('drivingLicensePhoto', this.file3 ? this.file3 : '');
    formData.append('declarationFormPhoto', this.file4 ? this.file4 : '');
    formData.append('bankPassbookPhoto', this.file5 ? this.file5 : '');
    formData.append('candidateSignature', this.signatureData);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.spinner.start();
    this.api
      .callApi(this.constant.ADDEMPLOYEEJOININGREQUEST, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router
                .navigate([this.adminRoot + '/payrolls/listJoiningRequestform'])
                .then(() => {
                  window.location.reload();
                  this.spinner.stop();
                });
            }, 3000);
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getAllData(companyMasterID) {
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = [];
    this.selectedbranch = '';
    this.selecteddepartment = '';
    this.selecteddesignation = '';

    this.api
      .callApi(
        this.constant.DEPARTMENTBYCOMPANYDATA1 + companyMasterID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          this.spinner.stop();
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });

    this.api
      .callApi(
        this.constant.DESIGNATIONBYCOMPANYDATA1 + companyMasterID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          this.spinner.stop();
        }
      });

    this.spinner.start();
    let filter = { page: '', limit: '' };
    this.api.callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res.data;
        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  addvalue() {
    let count = 1;
    for (var item of this.values) {
      if (!item.deleted) count++;
    }
    this.values.push({
      familyMemberName: '',
      relation: '',
      dob: '',
      gender: '',
      deleted: false,
    });
  }

  removevalue(i) {
    this.values[i].deleted = true;
  }

  prev() {
    this.router.navigate([this.adminRoot + '/payrolls/listJoiningRequestform']);
  }
  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.presentCountry = res.data;
          this.permenentCountry = res.data;
          this.spinner.stop();
        }
      });
  }
  selectcountry(presentCountry: any) {
    this.presentSelectedstate = '';
    this.presentState = [];
    this.presentSelectedcity = '';
    this.presentCity = [];
    if (!presentCountry) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + presentCountry, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.presentState = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }
  selectstate(presentState: any) {
    this.presentSelectedcity = '';
    this.presentCity = [];

    if (!presentState) {
      return;
    }
    this.api
      .callApi(this.constant.GETCITYBYSTATE + presentState, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.presentCity = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }
  selectcity(presentCity: any) {
    if (presentCity) {
      this.presentFinalcityid = presentCity;
    } else {
      this.presentFinalcityid = null;
    }
  }

  selectcountry1(permenentCountry: any) {
    this.permenantSelectedState = '';
    this.permenentState = [];
    this.permenantCity = '';
    this.permenentCity = [];
    if (!permenentCountry) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + permenentCountry, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.permenentState = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }
  selectstate1(permenentState: any) {
    this.permenantCity = '';
    this.permenentCity = [];

    if (!permenentState) {
      return;
    }
    this.api
      .callApi(this.constant.GETCITYBYSTATE + permenentState, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.permenentCity = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }
  selectcity1(permenentCity: any) {
    if (permenentCity) {
      this.permenentFinalCityid = permenentCity;
    } else {
      this.permenentFinalCityid = null;
    }
  }
  getImage(event) {

    if (!this.signaturePadElement.isEmpty()) {
      this.signatureData = this.signaturePadElement.toDataURL();
    } else if (this.signaturePadElement.isEmpty()) {
      this.notifications.create('Done', 'Signature Filed Can Not be Empty', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: true,
      });
    }
  }

  getImageSign() {


    if (!this.signaturePadElement.isEmpty()) {
      this.signatureData = this.signaturePadElement.toDataURL();
    } else if (this.signaturePadElement.isEmpty()) {
      this.notifications.create('Done', 'Signature Filed Can Not be Empty', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: true,
      });
    }
  }
  clearSignature() {
    this.signaturePadElement.clear();
    this.signatureData = null;
  }

  isInValid(): boolean {
    return (this.signaturePadElement && !this.signaturePadElement.isEmpty());
  }
}
