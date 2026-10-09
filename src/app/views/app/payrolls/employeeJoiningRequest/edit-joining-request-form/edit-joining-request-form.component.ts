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
import { Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'app-edit-joining-request-form',
    templateUrl: './edit-joining-request-form.component.html',
    styleUrls: ['./edit-joining-request-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditJoiningRequestFormComponent implements OnInit {
  @ViewChild('editEmployeeJoiningRequest') editEmployeeJoiningRequest: NgForm;
  @ViewChild('sign', { static: false }) signaturePadElement: NgxSignaturePadComponent;
  apiURL = environment.apiUrl;
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
  formValue: any;
  editEmployeejoiningData: any = [];
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
  format: any;
  url: any;
  copyAddress = false;
  presentAddress: any;
  permenentAddress: any;

  presentcountryID: any;
  presentstateID: any;
  presentcityID: any;
  permenantcountryID: any;
  permenantstateID: any;
  permenantcityID: any;
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
    private formValueStorageService: FormValueStorageService,
    private lightbox: Lightbox,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.getJoiningData();
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
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
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
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSelectFile1(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file1 = event.target.files && event.target.files[0];
      if (this.file1) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file1.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file1.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSelectFile2(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file2 = event.target.files && event.target.files[0];
      if (this.file2) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file2.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file2.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSelectFile3(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file3 = event.target.files && event.target.files[0];
      if (this.file3) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file3.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file3.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSelectFile4(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file4 = event.target.files && event.target.files[0];
      if (this.file4) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file4.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file4.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSelectFile5(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file5 = event.target.files && event.target.files[0];
      if (this.file5) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file5.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file5.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSubmit() {
    if (!this.editEmployeeJoiningRequest.valid) {
      return;
    }


    if (this.editEmployeeJoiningRequest.value.candidateSignature === null)

      if (!this.signaturePadElement.isEmpty()) {
        if (!this.signatureData) {
          return this.notifications.create(
            'Error',
            'Confirm Signature First',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
        }
      }
    let finalBody = [];

    this.values.forEach((value) => {
      finalBody.push({
        esicFamilyDetailsID: value.esicFamilyDetailsID,
        familyMemberName: value.familyMemberName,
        relation: value.relation,
        dob: value.familydob,
        gender: value.familygender,
        deleted: value.deleted,
      });
    });
    if (this.copyAddress == true) {
      (this.editEmployeeJoiningRequest.value.permenetAddress =
        this.editEmployeeJoiningRequest.value.presentAddress),
        (this.editEmployeeJoiningRequest.value.permenantCity1 =
          this.editEmployeeJoiningRequest.value.presentCity1);
    }

    const formData = new FormData();
    formData.append('employeeJoiningRequestID', this.formValue.ListJoiningRequestFormComponent.id);
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('companyMasterID', this.editEmployeeJoiningRequest.value.company);
    formData.append('branchMasterID', this.editEmployeeJoiningRequest.value.branchID);
    formData.append('departmentId', this.editEmployeeJoiningRequest.value.departmentID);
    formData.append('designationId', this.editEmployeeJoiningRequest.value.designationID);
    formData.append('bankMasterID', this.editEmployeeJoiningRequest.value.bankMasterID);
    formData.append(
      'presentAddressCityID',
      this.editEmployeeJoiningRequest.value.presentCity1
        ? this.editEmployeeJoiningRequest.value.presentCity1
        : null,
    );
    formData.append(
      'permenetAddressCityID',
      this.editEmployeeJoiningRequest.value.permenantCity1
        ? this.editEmployeeJoiningRequest.value.permenantCity1
        : null,
    );
    formData.append('mobileNumber', this.editEmployeeJoiningRequest.value.mobileNumber);
    formData.append('aadharNumber', this.editEmployeeJoiningRequest.value.aadharNumber);
    formData.append('dateOfJoining', this.editEmployeeJoiningRequest.value.dateOfJoining);
    formData.append('photo', this.file ? this.file : this.editEmployeejoiningData.photo || '');
    formData.append('firstName', this.editEmployeeJoiningRequest.value.firstName);
    formData.append('middleName', this.editEmployeeJoiningRequest.value.middleName);
    formData.append('lastName', this.editEmployeeJoiningRequest.value.lastName);
    formData.append('nameAsAAdhar', this.editEmployeeJoiningRequest.value.nameAsAAdhar);
    formData.append('presentAddress', this.editEmployeeJoiningRequest.value.presentAddress);
    formData.append('permenetAddress', this.editEmployeeJoiningRequest.value.permenetAddress);
    formData.append('dob', this.editEmployeeJoiningRequest.value.dob);
    formData.append('maratialStatus', this.editEmployeeJoiningRequest.value.maratialStatus);
    formData.append('gender', this.editEmployeeJoiningRequest.value.gender);
    formData.append('panCardNo', this.editEmployeeJoiningRequest.value.panCardNo);
    formData.append('shirtSize', this.editEmployeeJoiningRequest.value.shirtSize);
    formData.append('pantSize', this.editEmployeeJoiningRequest.value.pantSize);
    formData.append('shoesSize', this.editEmployeeJoiningRequest.value.shoesSize);
    formData.append('salary', this.editEmployeeJoiningRequest.value.salary);
    formData.append('bankAccountNumber', this.editEmployeeJoiningRequest.value.bankAccountNumber);
    formData.append('IFSCNumber', this.editEmployeeJoiningRequest.value.IFSCNumber);
    formData.append('ESICNumber', this.editEmployeeJoiningRequest.value.ESICNumber);
    formData.append('uanNumber', this.editEmployeeJoiningRequest.value.uanNumber);
    formData.append('nestedbody', JSON.stringify(finalBody));
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append('remarks', this.editEmployeeJoiningRequest.value.remarks);
    formData.append(
      'aadharCardPhoto',
      this.file1 ? this.file1 : this.editEmployeejoiningData.aadharCardPhoto || '',
    );
    formData.append(
      'panCardPhoto',
      this.file2 ? this.file2 : this.editEmployeejoiningData.panCardPhoto || '',
    );
    formData.append(
      'drivingLicensePhoto',
      this.file3 ? this.file3 : this.editEmployeejoiningData.drivingLicensePhoto || '',
    );
    formData.append(
      'declarationFormPhoto',
      this.file4 ? this.file4 : this.editEmployeejoiningData.declarationFormPhoto || '',
    );
    formData.append(
      'bankPassbookPhoto',
      this.file5 ? this.file5 : this.editEmployeejoiningData.bankPassbookPhoto || '',
    );
    formData.append(
      'candidateSignature',
      this.signatureData
        ? this.signatureData
        : this.editEmployeejoiningData.candidateSignature || '',
    );

    this.spinner.start();
    this.api
      .callApi(this.constant.EDITEMPLOYEEJOININGREQUEST, formData, 'POST', true, true, true)
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
  getJoiningData() {
    this.api
      .callApi(
        this.constant.GETEMPLOYEEJOININGREQUESTBYID +
        this.formValue.ListJoiningRequestFormComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editEmployeejoiningData = res.data;

          this.getAllData(this.editEmployeejoiningData.companyMasterID);
          if (this.editEmployeejoiningData.presentAddressCityID != null) {
            (this.presentcountryID =
              this.editEmployeejoiningData.presentAddressCity.stateMaster.countryMaster.countryMasterID),
              (this.presentstateID =
                this.editEmployeejoiningData.presentAddressCity.stateMaster.stateMasterID);
            this.presentcityID = this.editEmployeejoiningData.presentAddressCityID;
            // presentcityID
            this.selectcountry(this.presentcountryID);
            this.selectstate(this.presentstateID);
            this.selectcity(this.presentcityID);
          }
          if (this.editEmployeejoiningData.permenetAddressCityID != null) {
            this.permenantcountryID =
              this.editEmployeejoiningData.permenentAddressCity.stateMaster.countryMaster.countryMasterID;
            this.permenantstateID =
              this.editEmployeejoiningData.permenentAddressCity.stateMaster.stateMasterID;
            this.permenantcityID = this.editEmployeejoiningData.permenetAddressCityID;

            this.selectcountry1(this.permenantcountryID);

            this.selectstate1(this.permenantstateID);
            this.selectcity1(this.permenantcityID);
          }
          this.values = res.data.esicFamilyDetails.map((item) => {
            return {
              esicFamilyDetailsID: +item.esicFamilyDetailsID,
              familyMemberName: item.familyMemberName,
              relation: item.relation,
              familydob: item.dob,
              familygender: item.gender,
              deleted: false,
            };
          });
          this.spinner.stop();
        }
      });
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

  getImageSign() {
    if (!this.signaturePadElement.isEmpty()) {
      this.signatureData = this.signaturePadElement.toDataURL();
    }
  }
  clearSignature() {
    this.signaturePadElement.clear();
    this.signatureData = null;
  }

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, {
      centerVertically: true,
      positionFromTop: 0,
      disableScrolling: true,
      wrapAround: true,
    });
  }

  isInValid(): boolean {
    return this.signaturePadElement && !this.signaturePadElement.isEmpty();
  }

  deleteAadharPhoto() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'aadharCardPhoto',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }

  deletePANPhoto() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'panCardPhoto',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }

  deleteDrivingLicense() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'drivingLicensePhoto',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }

  deleteCanddidatePhoto() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'photo',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }

  deletePassBookPhoto() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'bankPassbookPhoto',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }

  deleteDeclarationPhoto() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'declarationFormPhoto',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }

  deleteCandidateSignaturePhoto() {
    this.spinner.start('submit');
    const body = {
      employeeJoiningRequestID: this.formValue.ListJoiningRequestFormComponent.id,
      imageType: 'candidateSignature',
    };

    this.api
      .callApi(this.constant.REMOVEJOININGREQUESTIMAGE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        },
      );
  }
}
