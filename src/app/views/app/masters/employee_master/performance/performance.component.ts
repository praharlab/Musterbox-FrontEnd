import { Component, ViewChild, OnInit, ElementRef, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { Observable, Observer } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmployeeIdCardComponent } from '../employee-id-card/employee-id-card.component';
import { EmployeeAttendancePolicyComponent } from '../employee-attendance-policy/employee-attendance-policy.component'
import { EmployeeHolidayPolicyComponent } from '../../employee-holiday-policy/employee-holiday-policy/employee-holiday-policy.component';
import { EmployeeWeekoffPolicyComponent } from '../../employee-weekoff-policy/employee-weekoff-policy/employee-weekoff-policy.component';
import { EmployeeAttendanceBonusPolicyComponent } from '../../employee-attendance-bonus-policy/employee-attendance-bonus-policy/employee-attendance-bonus-policy.component';
import { EmployeeFoodAllowancePolicyComponent } from '../../employee-foodAllowance-policy/employee-food-allowance-policy/employee-food-allowance-policy.component';
import { ListEmpShortLeavePolicyComponent } from '../list-emp-short-leave-policy/list-emp-short-leave-policy.component';
import { labelUtils } from 'src/app/constants/labelUtils';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-performance',
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PerformanceComponent implements OnInit {
  @ViewChild('feedbackForm') feedbackForm: NgForm;
  @ViewChild('componentContainer', { read: ViewContainerRef })
  componentContainer: ViewContainerRef;

  navbarOpen = false;
  isadmins: any;
  companydata: any;
  usertype: string;
  rows: any;
  rows1: any = [];
  rows2: any = [];
  rows3: any = [];
  rows4: any;
  rows5: any;
  rows6: any;
  rows7: any;
  selectedCityIds1: any = [];
  ownerList: any;
  joiningdata: any;
  apiURL = environment.apiUrl;
  companyname: any;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  imgshow1: boolean;
  rows8: any;
  temp: any[];
  page = {
    totalCount: 0,
    offset: 0,
  };
  checkpdf: boolean;
  base64Image: string;
  rows9: any;
  PercentTotal = 0;
  ipAddress: any;
  PercentArr: any = [];
  PercentCheck: any;
  MIN: any;
  MAX: any;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  country: any;
  state: any;
  city: any;
  district: any;
  finalcityid: any;
  filterData1 = {
    page: '',
    limit: '',
  };
  alldocumenttypedata: any;
  editbyid: any;
  editbyid1: any;
  editbyidedu: any;
  EditPercentCheck: any;
  EditPercentValue: any;
  PercentCheckEdit: any;
  editbyidfam: any;
  stateid: string;
  cityid: string;
  pattern = '[0-9]{10}';
  responsibilities: any = [];
  editUserAddress: any;
  countryID: any;
  stateID: any;
  cityID: any;
  districtId: any;
  editUserExperience: any;
  certificate: any;
  AllShifts: any = '';

  shiftdata: any = [];
  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;
  Mondaystarttime: any;
  Mondayfirsthalfend: any;
  Mondaysecondhalfstart: any;
  Mondayendtime: any;
  Mondaytotalhours: any;
  Mondaytotalhourshalfday: any;

  Tuesdaystarttime: any;
  Tuesdayfirsthalfend: any;
  Tuesdaysecondhalfstart: any;
  Tuesdayendtime: any;
  Tuesdaytotalhours: any;
  Tuesdaytotalhourshalfday: any;

  Wednesdaystarttime: any;
  Wednesdayfirsthalfend: any;
  Wednesdaysecondhalfstart: any;
  Wednesdayendtime: any;
  Wednesdaytotalhours: any;
  Wednesdaytotalhourshalfday: any;

  Thursdaystarttime: any;
  Thursdayfirsthalfend: any;
  Thursdaysecondhalfstart: any;
  Thursdayendtime: any;
  Thursdaytotalhours: any;
  Thursdaytotalhourshalfday: any;

  Fridaystarttime: any;
  Fridayfirsthalfend: any;
  Fridaysecondhalfstart: any;
  Fridayendtime: any;
  Fridaytotalhours: any;
  Fridaytotalhourshalfday: any;

  Saturdaystarttime: any;
  Saturdayfirsthalfend: any;
  Saturdaysecondhalfstart: any;
  Saturdayendtime: any;
  Saturdaytotalhours: any;
  Saturdaytotalhourshalfday: any;

  Sundaystarttime: any;
  Sundayfirsthalfend: any;
  Sundaysecondhalfstart: any;
  Sundayendtime: any;
  Sundaytotalhours: any;
  Sundaytotalhourshalfday: any;

  sandwichleave: any;
  selectedcompany: any;
  table: any;
  alldepartment: any;
  alldesignation: any;
  allbranch: any;
  referncedata: any;
  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
  showearlyby: any;
  show: any;
  by_Branch: boolean = false;
  predefined1: any = '0';
  selectedEarlyPenalty: any = '0';
  reference_ID: any;
  values: any = [];

  EarlyGovalues: any = [];
  allowearlybypenalty: boolean = false;
  selectedEarlyGoPenalty: any = 'slotminute';
  EarlyGodeduction: any;
  isPhotoLock: boolean = false;


  showExpiryDate: boolean = false;
  expiryDate: string;

  companydata1 = {
    showdate1: 'no', // Initialize with appropriate default value if needed
  };

  editShowExpiryDate = false;
  editDocumentValid = true; // Assuming default validity state
  editAddcomp4Submitted = false;

  houseNumberLabel: any = labelUtils.houseNumberLabel
  houseNameLabel: any = labelUtils.houseNameLabel
  landMarkLabel: any = labelUtils.landMarkLabel
  zipCodeLabel: any = labelUtils.zipCodeLabel
  areaLabel: any = labelUtils.areaLabel
  stateLabel: any = labelUtils.stateLabel
  districtLabel: any = labelUtils.districtLabel
  showDistrict: boolean = labelUtils.showDistrict

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  // disableSwitching: boolean;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModaledit') closeModaledit: ElementRef;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('editcompfam') editcompfam: NgForm;
  @ViewChild('closeModalfam') closeModalfam: ElementRef;
  @ViewChild('tabset') tabset: TabsetComponent;
  @ViewChild('addcomp2') addcomp2: NgForm;
  @ViewChild('closeModal2') closeModal2: ElementRef;
  @ViewChild('editcomp2') editcomp2: NgForm;
  @ViewChild('closeModalexpedit') closeModalexpedit: ElementRef;
  @ViewChild('addcomp3') addcomp3: NgForm;
  @ViewChild('closeModal3') closeModal3: ElementRef;
  @ViewChild('editcompedu') editcompedu: NgForm;
  @ViewChild('closeModaledu') closeModaledu: ElementRef;
  @ViewChild('addcomp4') addcomp4: NgForm;
  @ViewChild('closeModal4') closeModal4: ElementRef;

  @ViewChild('editcompdoc') editcompdoc: NgForm;
  @ViewChild('closeEdutDocModal1') closeEdutDocModal1: ElementRef;
  values1 = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,

    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValueStorageService.removeData('ListEmployeeMasterComponent', true);
    this.navigateToAddressPage()
    this.getdata();
    this.usertype = localStorage.getItem('usertype');
    this.addressdata();
    this.values1.push({ value: '' });
    this.getIPAddress();
    this.getallcountry();
    this.alldocumenttype();
  }
  // ----------------------------------------------------------------------------------[USER ADDRESS]

  onTabSelected(event: TabDirective): void {
    // ngx-bootstrap 21: TabDirective.heading is a signal input
    const heading = event.heading();

    if (this.componentContainer) {
      this.componentContainer.clear();

    }

    if (heading == 'COMPANY DOCUMENT') {
      // Code to handle COMPANY DOCUMENT
      this.companyDocument();
    } else if (heading == 'EMPLOYEE DOCUMENT') {
      // Code to handle EMPLOYEE DOCUMENT
      this.employeeDocument();
    } else if (heading == 'SHIFT') {
      // Code to handle SHIFT
      this.shiftdata1();
    } else if (heading == 'DESIGNATION') {
      // Code to handle DESIGNATION
      this.designationdata();
    } else if (heading == 'DEPARTMENT') {
      // Code to handle DEPARTMENT
      this.departmentdata();
    } else if (heading == 'BRANCH') {
      // Code to handle BRANCH
      this.branchdata();
    } else if (heading == 'REPORTS TO') {
      // Code to handle REPORTS TO
      this.reportsto();
    } else if (heading == 'FAMILY') {
      // Code to handle FAMILY
      this.familydata();
    } else if (heading == 'EDUCATION') {
      // Code to handle EDUCATION
      this.educationdata();
    } else if (heading == 'EXPERIENCE') {
      // Code to handle EXPERIENCE
      this.experiancedata();
    } else if (heading == 'ADDRESS') {
      // Code to handle ADDRESS
      this.addressdata();
    }
    else if (heading == 'ANONYMOUS FEEDBACK') {
      // Code to handle ANONYMOUS FEEDBACK
      this.AnonymousFeedback();
    }


  }


  AnonymousFeedback() {

    if (!this.feedbackForm || !this.feedbackForm.valid) {
      return;
    }

    const body = {
      feedback: this.feedbackForm.value.feedback, // Adjust if needed
      createBy: +localStorage.getItem('id'),
      userMasterID: localStorage.getItem('id'),
    };

    this.spinner.start();
    this.api.callApi(
      this.constant.ADDANONYMOUSFEEDBACK,
      body,
      'POST',
      true,
      false,
      true
    ).subscribe((res: any) => {
      if (res.status === 200) {
        this.rows = res.data;
        this.feedbackForm.resetForm();
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
        this.spinner.stop();
      }
    });
  }


  addressdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERADDRESS + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: localStorage.getItem('id'),
      addressType: this.addcomp.value.addressType,
      houseNumber: this.addcomp.value.houseNumber,
      houseName: this.addcomp.value.houseName,
      landmark: this.addcomp.value.landmark,
      area: this.addcomp.value.area,
      cityMasterID: this.addcomp.value.city1,
      zipcode: this.addcomp.value.zipcode,
      districtID: this.showDistrict ? this.addcomp.value.districtID : null,
      verifyStatus: 0,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEUSERADDRESSDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();

          this.addcomp.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.addressdata();
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
          this.country = res.data;
          this.spinner.stop();
        }
      });
  }
  selectcountry(country: any) {
    if (country) {
      this.api
        .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
        .subscribe(
          (res: any) => {
            this.state = res.data;
          },
          (err) => {
            console.log('error', err);
          },
        );
    }
    this.state = [];
    this.city = [];
    this.stateid = '';
    this.cityid = '';
    this.stateID = '';
    this.cityID = '';
  }
  selectstate(state: any) {
    if (state) {
      this.api
        .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
        .subscribe(
          (res: any) => {
            this.city = res.data;
          },
          (err) => {
            console.log('error', err);
          },
        );
      if (this.showDistrict) {
        let queryString = `?stateMasterID=${state}`;
        this.api
          .callApi(this.constant.GETDISTRICTBYSTATEID + queryString, {}, 'GET', false, false, false)
          .subscribe(
            (res: any) => {
              this.district = res.data;
            },
            (err) => {
              console.log('error', err);
            },
          );
      }
    }
    this.district = [];
    this.districtId = ''
    this.city = [];
    this.cityID = '';

  }
  selectcity(city: any) {
    if (!city) {
      return;
    }
    this.finalcityid = city;
  }
  edit(item) {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERADDRESSBYID + item.userAddressID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editUserAddress = res.data;

          if (this.editUserAddress.cityMasterID) {
            this.selectcountry(this.editUserAddress.cityMaster.stateMaster.countryMasterID);
            this.selectstate(this.editUserAddress.cityMaster.stateMasterID);
            this.countryID = this.editUserAddress.cityMaster.stateMaster.countryMasterID;
            this.stateID = this.editUserAddress.cityMaster.stateMasterID;
            this.cityID = this.editUserAddress.cityMasterID;
            this.districtId = this.showDistrict ? this.editUserAddress.districtID : null;
          }
        }
      });
  }
  onSubmitedit() {
    if (!this.editcomp.valid) {
      return;
    }
    let body = {
      userAddressID: this.editUserAddress.userAddressID,
      addressType: this.editcomp.value.addressType,
      houseNumber: this.editcomp.value.houseNumber,
      houseName: this.editcomp.value.houseName,
      landmark: this.editcomp.value.landmark,
      area: this.editcomp.value.area,
      cityMasterID: this.editcomp.value.city1,
      zipcode: this.editcomp.value.zipcode,
      districtID: this.showDistrict ? this.addcomp.value.districtID : null,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      verifyStatus: '0', // Verify status

    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEUSERADDRESSDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModaledit.nativeElement.click();

          this.editcomp.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.addressdata();
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
          userAddressID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSERADDRESSDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.addressdata();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  // -------------------------------------------------------------------------------------[USER EXPEIENCE]
  experiancedata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREXPRIANCE + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows1 = res.data;
          this.spinner.stop();
        }
      });
  }
  onSubmit2() {
    const resp = [];
    for (var i = 0; i < this.values1.length; i++) {
      resp.push(this.values1[i].value);
    }
    if (!this.addcomp2.valid) {
      return;
    }
    let body = {
      userMasterID: localStorage.getItem('id'),
      designation: this.addcomp2.value.designation,
      fromDate: this.addcomp2.value.fromDate,
      toDate: this.addcomp2.value.toDate,
      organization: this.addcomp2.value.organization,
      roleRespo: resp,
      verifyStatus: 0,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEUSEREXPERIENCE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal2.nativeElement.click();

          this.addcomp2.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.experiancedata();
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
  add() {
    this.values1 = [];
  }
  removevalue(i) {
    this.values1.splice(i, 1);
  }
  addvalue() {
    this.values1.push({ value: '' });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  editt(item) {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREXPERIENCEBYID + item.userExperienceID,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editUserExperience = res.data;

          var respo: any = [];

          for (var i = 0; i < this.editUserExperience.roleRespo.length; i++) {
            respo.push({ value: this.editUserExperience.roleRespo[i] });
          }

          this.values1 = respo;
        }
      });
  }

  onSubmitexpedit() {
    if (!this.editcomp2.valid) {
      return;
    }
    const resp = [];
    for (var i = 0; i < this.values1.length; i++) {
      resp.push(this.values1[i].value);
    }

    let body = {
      userExperienceID: this.editUserExperience.userExperienceID,
      userMasterID: this.activatedRoute.snapshot.params.id,
      designation: this.editcomp2.value.designation,
      fromDate: this.editcomp2.value.fromDate,
      toDate: this.editcomp2.value.toDate,
      organization: this.editcomp2.value.organization,
      roleRespo: resp,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      verifyStatus: '0', // Verify status
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEUSEREXPERIENC, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModalexpedit.nativeElement.click();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.experiancedata();
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
  alertConfirmationn(id: any) {
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
          userExperienceID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSEREXPERIENCE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.experiancedata();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  // ---------------------------------------------------------------------------------------[USER EDUCATION]
  educationdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREDUCATION + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows3 = res.data;

          this.spinner.stop();
        }
      });
  }
  onSubmit3() {
    if (!this.addcomp3.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('qualification', this.addcomp3.value.qualification);
    formData.append('yearOfPassing', this.addcomp3.value.yearOfPassing);
    formData.append('grade', this.addcomp3.value.grade);
    formData.append('percentageObtained', this.addcomp3.value.percentageObtained);
    formData.append('institute', this.addcomp3.value.institute);
    formData.append('university', this.addcomp3.value.university);

    formData.append('degree', this.certificate);
    formData.append('verifyStatus', '0');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    // let body = {
    //   qualification: this.addcomp3.value.qualification,
    //   yearOfPassing: this.addcomp3.value.yearOfPassing,
    //   grade: this.addcomp3.value.grade,
    //   percentageObtained: this.addcomp3.value.percentageObtained,
    //   institute: this.addcomp3.value.institute,
    //   university: this.addcomp3.value.university,
    //   certificate: this.addcomp3.value.certificate,
    //   verifyStatus: 0,
    //   verifyBy: localStorage.getItem('id'),
    //   createBy: localStorage.getItem('id'),
    //   createByIp: this.ipAddress
    // }
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEUSEREDUCATION, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal3.nativeElement.click();
            this.educationdata();
            this.addcomp3.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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
  editedu(item) {

    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREDUCATIONBYID + item.userEducationID,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyidedu = res.data;
        }
      });
  }
  onSubmitedu() {
    if (!this.editcompedu.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('userEducationID', this.editbyidedu.userEducationID);
    formData.append('userMasterID', this.editbyidedu.userMasterID);
    formData.append('qualification', this.editcompedu.value.qualification);
    formData.append('yearOfPassing', this.editcompedu.value.yearOfPassing);
    formData.append('grade', this.editcompedu.value.grade);
    formData.append('percentageObtained', this.editcompedu.value.percentageObtained);
    formData.append('institute', this.editcompedu.value.institute);
    formData.append('university', this.editcompedu.value.university);

    formData.append('degree', this.certificate);
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append('verifyStatus', '0');




    // let body = {
    //   userEducationID: this.editbyidedu.userEducationID,
    //   userMasterID: this.activatedRoute.snapshot.params.id,
    //   qualification: this.editcompedu.value.qualification,
    //   yearOfPassing: this.editcompedu.value.yearOfPassing,
    //   grade: this.editcompedu.value.grade,
    //   percentageObtained: this.editcompedu.value.percentageObtained,
    //   institute: this.editcompedu.value.institute,
    //   university: this.editcompedu.value.university,
    //   updateBy: localStorage.getItem('id'),
    //   updateByIp: this.ipAddress
    // }
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEUSEREDUCATION, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.editcompedu.resetForm();

          if (res.status == 200) {
            this.closeModaledu.nativeElement.click();
            this.educationdata();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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
  alertConfirm(id: any) {
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
          userEducationID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSEREDUCATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.educationdata();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  // -----------------------------------------------------------------------------------------[USER FAMILY]
  familydata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERFAMILY + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows2 = res.data;

          for (var i = 0; i < this.rows2.length; i++) {
            if (this.rows2[i].nominee == 1) {
              this.rows2[i].nomineecheck = 'YES';
            } else {
              this.rows2[i].nomineecheck = 'NO';
            }

            this.PercentArr.push(this.rows2[i].percentForNominee);
          }
          this.temp = [...this.rows2];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
          this.PercentTotal = this.PercentArr.reduce((acc, obj) => {
            return acc + obj;
          }, 0);
          this.MAX = Number(100 - this.PercentTotal);
          this.MIN = 0;
        }
      });
  }
  onSubmit1() {
    if (this.addcomp1.value.Percentage < 0) {
      this.notifications.create(
        'Error',
        'Percent for Gratuity should be greater than zero',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      setTimeout(() => {
        this.spinner.stop();
      }, 3000);
      return;
    }
    if (!this.addcomp1.valid) {
      return;
    }

    if (this.addcomp1.value.Percentage + this.PercentTotal > 100) {
      this.notifications.create(
        'Error',
        'The total percentage for gratuity should be less than 100',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      setTimeout(() => {
        this.spinner.stop();
      }, 3000);
    } else {
      let body = {
        userMasterID: localStorage.getItem('id'),
        memberName: this.addcomp1.value.memberName,
        dob: this.addcomp1.value.dob,
        gender: this.addcomp1.value.gender,
        relation: this.addcomp1.value.relation,
        contact: this.addcomp1.value.contact,
        nominee: this.addcomp1.value.nominee,
        percentForNominee: this.addcomp1.value.Percentage,
        verifyStatus: 0,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
      this.spinner.start();
      this.api.callApi(this.constant.CREATEUSERFAMILY, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.PercentArr.splice(0);
            this.familydata();
            this.addcomp1.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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
  }
  selectPercent(event) {
    this.PercentCheck = event.target.value;
  }
  selectPercentEdit(event) {
    this.PercentCheckEdit = event.target.value;
  }
  editfam(item) {

    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERFAMILYBYID + item.userFamilyID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyidfam = res.data;
          if (this.editbyidfam.nominee == 0) {
            this.editbyidfam.nominee = '0';
            this.EditPercentCheck = 0;
            this.EditPercentValue = 0;
          } else {
            this.editbyidfam.nominee = '1';
            this.EditPercentCheck = 1;
            this.EditPercentValue = this.editbyidfam.percentForNominee;
          }
        }
      });
  }
  onSubmitfam() {
    if (!this.editcompfam.valid) {
      return;
    }


    if (this.PercentCheckEdit == 0) {
      let body = {
        userFamilyID: this.editbyidfam.userFamilyID,
        userMasterID: this.activatedRoute.snapshot.params.id,
        memberName: this.editcompfam.value.memberName,
        dob: this.editcompfam.value.dob,
        gender: this.editcompfam.value.gender,
        relation: this.editcompfam.value.relation,
        contact: this.editcompfam.value.contact,
        nominee: this.editcompfam.value.nominee,
        percentForNominee: 0,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
        verifyStatus: '0', // Verify status

      };
      this.spinner.start();
      this.api.callApi(this.constant.UPDATEUSERFAMILY, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModalfam.nativeElement.click();
            this.PercentArr.splice(0);
            this.familydata();

            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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
    } else {
      if (this.editcompfam.value.Percentage < 0) {

        this.notifications.create(
          'Error',
          'Percent for Gratuity should be greater than zero',
          NotificationType.Error,
          { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
        );
        setTimeout(() => {
          this.spinner.stop();
        }, 3000);
        return;
      }

      if (this.editcompfam.value.Percentage + this.PercentTotal - this.EditPercentValue > 100) {
        this.notifications.create(
          'Error',
          'The total percentage for gratuity should be less than 100',
          NotificationType.Error,
          { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
        );
        setTimeout(() => {
          this.spinner.stop();
        }, 3000);
      } else {
        let body = {
          userFamilyID: this.editbyidfam.userFamilyID,
          userMasterID: this.activatedRoute.snapshot.params.id,
          memberName: this.editcompfam.value.memberName,
          dob: this.editcompfam.value.dob,
          gender: this.editcompfam.value.gender,
          relation: this.editcompfam.value.relation,
          contact: this.editcompfam.value.contact,
          nominee: this.editcompfam.value.nominee,
          percentForNominee: this.editcompfam.value.Percentage,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
          verifyStatus: '0', // Verify status

        };
        this.spinner.start();
        this.api.callApi(this.constant.UPDATEUSERFAMILY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.closeModalfam.nativeElement.click();
              this.PercentArr.splice(0);
              this.familydata();

              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              setTimeout(() => {
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
    }
  }
  alertConfirmfam(id: any) {
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
          userFamilyID: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETEUSERFAMILY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.PercentArr.splice(0);
            this.familydata();
            this.spinner.stop();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
          },
        );
      }
    });
  }
  // ------------------------------------------------------------------------------------------[USER BRANCH]
  branchdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEBRANCH + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.rows4 = res.data;

          this.spinner.stop();
        }
      });
  }
  // -------------------------------------------------------------------------------------------[USER DEPATMENT]
  departmentdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEDEPARTMENT + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows5 = res.data;
          this.spinner.stop();
        }
      });
  }
  // -------------------------------------------------------------------------------------------[USER DESIGNATION]
  designationdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEDESIGNATION + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows6 = res.data;
          this.spinner.stop();
        }
      });
  }
  // -------------------------------------------------------------------------------------------[USER SHIFT]
  shiftdata1() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEESHIFT + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows7 = res.data;
          this.spinner.stop();
        }
      });
  }

  getdata() {
    let userid = localStorage.getItem('id');
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.companydata = res.data;
          this.companyname = this.companydata['companyMaster.companyName'];

          this.isPhotoLock = this.companydata.isPhotoLock === 1;

          if (this.companydata.photo != '' && this.companydata.photo != null) {
            var img = new Image();
            img.src = this.apiURL + 'uploads/user/photo/' + this.companydata.photo;

            if (img.complete) {
              this.imgshow1 = true;
            } else {
              img.onload = () => {
                this.imgshow1 = true;
              };

              img.onerror = () => {
                this.imgshow1 = false;
              };
            }
          } else {
            this.imgshow1 = false;
          }
          if (this.companydata.admin == 1) {
            this.isadmins = true;
          } else {
            this.isadmins = '';
          }
        },
        (err) => {
        },
      );
  }

  isPhotoLocked(): boolean {
    return this.isPhotoLock;
  }


  reportsto() {




    let companyid = localStorage.getItem('id');
    this.spinner.start();
    this.api.callApi(this.constant.VIEWREPORT + companyid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data.length > 0) {
          this.selectedCityIds1 = res.data;


          this.spinner.stop();
        } else {
          this.selectedCityIds1 = [];
        }
      },
      (err) => {
        this.spinner.stop();
      },
    );
  }

  getjoiningdata() {
    let userid = localStorage.getItem('id');
    this.spinner.start();
    this.api
      .callApi(this.constant.GETEMPJOININGDATA + '/' + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.joiningdata = res.data;
          this.spinner.stop();
        },
        (err) => {
        },
      );
  }

  companyDocument() {
    const filterData = {
      page: 1,
      limit: 10,
      company_id: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERCOMPDOCUMENT + localStorage.getItem('id'),
        filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows8 = res.data;
          for (var i = 0; i < this.rows8.length; i++) {
            let extension = this.rows8[i].document.substring(
              this.rows8[i].document.lastIndexOf('.') + 1,
            );
            if (extension == 'pdf') {
              this.rows8[i].checkpdf = true;
            } else {
              this.rows8[i].checkpdf = false;
            }
          }


          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  alldocumenttype() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETDOCUMENTDATA, this.filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldocumenttypedata = res.data;

          this.spinner.stop();
        }
      });
  }

  onSelectFilee(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    // if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
    //   // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    // } else {
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

  onSelectCertificate(event: any) {
    this.certificate = null;
    this.certificate = event.target.files && event.target.files[0];
    if (this.certificate) {
      var reader = new FileReader();
      reader.readAsDataURL(this.certificate);

      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  employeeDocument() {
    this.spinner.start('DOC');
    this.api
      .callApi(
        this.constant.GETUSERDOCUMENT + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.rows9 = res.data;
          for (var i = 0; i < this.rows9.length; i++) {
            let extension = this.rows9[i].document.substring(
              this.rows9[i].document.lastIndexOf('.') + 1,
            );
            if (extension == 'pdf') {
              this.rows9[i].checkpdf = true;
            } else {
              this.rows9[i].checkpdf = false;
            }
          }

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('DOC');
      });
  }


  editDocuments(item) {
    this.adharNumberError = false;
    this.panCardError = false;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERDOCUMENTBYID + item.userDocumentID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;
          if (+this.editbyid.documentListID == 1) {
            this.validateadharNumber(this.editbyid.documentNumber);
          }
          if (+this.editbyid.documentListID == 2) {
            this.validatePanCardNumber(this.editbyid.documentNumber);
          }

          this.showExpiryDate = false;

          if (this.editbyid.expiryDate) {
            this.editbyid.expiryDate = new Date(this.editbyid.expiryDate).toISOString().slice(0, 10);
            this.showExpiryDate = true;
          }

        }
      });
  }


  toggleExpiryDateField(show: boolean) {
    this.showExpiryDate = show;
    if (!show) {
      this.expiryDate = ''; // Reset expiryDate when hiding the field
    }
  }


  toggleExpiryDateFieldEdit(value: boolean) {
    this.showExpiryDate = value;
  }


  onDocumentsEditSubmit1() {
    if (!this.editcompdoc.valid || this.adharNumberError || this.panCardError) {
      return;
    }
    const formData = new FormData();
    formData.append('userDocumentID', this.editbyid.userDocumentID);
    formData.append('documentListID', this.editbyid.documentListID);
    if (this.file) {
      formData.append('adharPhoto', this.file);
    }
    formData.append('documentNumber', this.editcompdoc.value.documentNumber ? this.editcompdoc.value.documentNumber : '');
    formData.append('nameOnDocument', this.editcompdoc.value.nameOnDocument ? this.editcompdoc.value.nameOnDocument : '');
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append('verifyStatus', '0');
    formData.append('expiryDate', this.editcompdoc.value.expiryDate ? this.editcompdoc.value.expiryDate : null);


    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEUSERDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeEdutDocModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.employeeDocument();
              this.editcompdoc.resetForm();
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

  onSubmit4() {
    if (!this.addcomp4.valid || this.adharNumberError || this.panCardError) {
      return;
    }
    // let body={
    //   userMasterID:this.activatedRoute.snapshot.params.id,
    //   documentListID:this.addcomp4.value.documentListID,
    //   createBy:localStorage.getItem('id'),
    //   createByIp:this.ipAddress
    // }
    const formData = new FormData();
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('documentListID', this.addcomp4.value.documentListID);
    formData.append('adharPhoto', this.file);
    formData.append('documentNumber', this.addcomp4.value.documentNumber ? this.addcomp4.value.documentNumber : '');
    formData.append('nameOnDocument', this.addcomp4.value.nameOnDocument ? this.addcomp4.value.nameOnDocument : '');
    formData.append('verifyStatus', '0');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('expiryDate', this.addcomp4.value.expiryDate ? this.addcomp4.value.expiryDate : null);

    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEUSERDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal4.nativeElement.click();
            this.employeeDocument();
            this.addcomp4.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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

  download(item) {
    const image = item.document;

    let url = this.apiURL + 'uploads/company/document/' + image;
    if (item.checkpdf == true) {
      // let headers = new HttpHeaders();
      // headers = headers.set('Accept', 'application/pdf');
      // return this.http.get(url, { headers: headers, responseType: 'blob' });

      window.open(url);
    } else {
      this.getBase64ImageFromURL(url).subscribe((base64data) => {
        this.base64Image = 'data:image/jpg;base64,' + base64data;
        // save image to disk
        var link = document.createElement('a');

        document.body.appendChild(link); // for Firefox

        link.setAttribute('href', this.base64Image);
        link.setAttribute('download', item.documentType.documentName + '.jpg');
        link.click();
      });
    }

  }

  download1(item: any) {
    const image = item.document;

    window.open(this.apiURL + 'uploads/user/document/' + image, '_blank');
    return;
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL('image/png');

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  openFile() {
    document.querySelector('input').click();
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
          if (this.url) {
            const formData = new FormData();
            let userNumber = JSON.parse(localStorage.getItem('user'));
            userNumber = userNumber.userNumber;
            formData.append('photo', this.file);
            formData.append('userMasterID', localStorage.getItem('id'));
            formData.append('userNumber', userNumber);
            this.api
              .callApi(this.constant.UPDATECOMPANYCONTACTDATA, formData, 'POST', true, true, true)
              .subscribe(
                (res: any) => {
                  if (res.status == 200) {
                    this.notifications.create(
                      'Done',
                      'Employee updated successfully.',
                      NotificationType.Bare,
                      {
                        theClass: 'outline primary',
                        timeOut: 3000,
                        showProgressBar: true,
                      },
                    );
                    window.location.reload();
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
                },
              );
          }
        };
      }
    }
  }

  setrespo(item: any) {
    this.responsibilities = item;
  }
  view(degree: any) {
    window.open(this.apiURL + 'uploads/user/degree/' + degree, '_blank');
  }

  deleteDoc(item) {
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
          userDocumentID: item.userDocumentID,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSERDocument, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.employeeDocument();
              this.spinner.stop();
            },
            (err) => {
              this.spinner.stop();
            },
          );
      }
    });
  }

  setShift(item: any) {
    this.AllShifts = item;
  }

  getShift(item: any) {

    this.editdata(item);
    this.getcompany();
  }

  editdata(item: any) {
    // let companyid = this.activatedRoute.snapshot.params.id
    this.spinner.start();
    this.api.callApi(this.constant.VIEWSHIFT + item, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.shiftdata = res.data;


        for (var i = 0; i < this.shiftdata.shiftTime.length; i++) {
          if (this.shiftdata.shiftTime[i].day == 'Monday') {
            this.Mondaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Mondayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Mondaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Mondayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Mondaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Mondaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Tuesday') {
            this.Tuesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Tuesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Tuesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Tuesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Tuesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Tuesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Wednesday') {
            this.Wednesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Wednesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Wednesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Wednesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Wednesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Wednesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Thursday') {
            this.Thursdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Thursdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Thursdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Thursdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Thursdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Thursdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Friday') {
            this.Fridaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Fridayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Fridaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Fridayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Fridaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Fridaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Saturday') {
            this.Saturdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Saturdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Saturdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Saturdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Saturdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Saturdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Sunday') {
            this.Sundaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Sundayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Sundaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Sundayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Sundaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Sundaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          }
        }

        if (
          !this.shiftdata.allowDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.lateComing &&
          !this.shiftdata.paneltyDeduction &&
          !this.shiftdata.paneltyDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.deductionOn
        ) {
          this.allowpanelty = false;
          this.show = '0';
        } else {
          this.allowpanelty = true;
          this.show = '1';
        }
        if (
          (!this.shiftdata.goEarly || this.shiftdata.goEarly == 0) &&
          !this.shiftdata.goEarlyallowdays
        ) {
          this.allowearlyby = false;
          this.showearlyby = '0';
        } else {
          this.allowearlyby = true;
          this.showearlyby = '1';
        }

        if (this.shiftdata.referenceId == 0) {
          this.shiftdata.referenceId = null;
        }
        if (this.shiftdata.branchID == 0) {
          this.shiftdata.branchID = null;
        }

        if (
          this.shiftdata.paneltyDeduction == 'slotminute' ||
          this.shiftdata.paneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.slot.length; i++) {
            this.values.push({ slot: this.shiftdata.slot[i], value: this.shiftdata.value[i] });
          }
        }

        if (
          this.shiftdata.goEarlyPaneltyDeduction == 'slotminute' ||
          this.shiftdata.goEarlyPaneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.goEarlyslot.length; i++) {
            this.EarlyGovalues.push({
              slot: this.shiftdata.goEarlyslot[i],
              value: this.shiftdata.goEarlyvalue[i],
            });
          }
          this.selectedEarlyPenalty = '1';
          this.allowearlybypenalty = true;
        }

        if (this.shiftdata.referenceId) {
          this.shiftdata.branchID = Number(this.shiftdata.branchID);
          this.by_Branch = true;
          this.predefined1 = '1';

          this.selectedcompany = this.shiftdata.companyMasterID;
          this.gettable(this.shiftdata.table);
          this.reference_ID = Number(this.shiftdata.referenceId);

          this.api
            .callApi(
              this.constant.BRANCHBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              this.allbranch = res;
            });
        } else {
          this.reference_ID = '';
        }
        // this.selectedcompany=this.shiftdata.companyMasterID;
        this.shiftdata.referenceId = Number(this.shiftdata.referenceId);
        //this.gettable(this.shiftdata.table)
        this.deduction = this.shiftdata.paneltyDeduction;
        this.spinner.stop();
      },
      (err) => {
        console.log('error', err);
      },
    );
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
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }

  gettable(event) {
    this.table = event;
    this.reference_ID = '';

    if (this.table == 'departments') {
      this.alldesignation = [];
      this.api
        .callApi(
          this.constant.DEPARTMENTBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;
          }
        });
    } else if (this.table == 'designations') {
      this.alldepartment = [];
      this.api
        .callApi(
          this.constant.DESIGNATIONBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldesignation = res.data;
          }
        });
    } else {
      this.alldesignation = [];
      this.alldepartment = [];
    }
  }

  adharNumberError: boolean = false;

  validateadharNumber(adharcard: string): void {
    const pattern = /^\d{12}$/;
    if (adharcard != null && adharcard != '') {
      if (!pattern.test(adharcard)) {
        this.adharNumberError = true;
      } else {
        this.adharNumberError = false;
      }
    } else {
      this.adharNumberError = false;
    }
  }

  panCardError: boolean = false;

  validatePanCardNumber(pancard: string): void {
    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    if (pancard != null && pancard != '') {
      if (!pattern.test(pancard)) {
        this.panCardError = true;
      } else {
        this.panCardError = false;
      }
    } else {
      this.panCardError = false;
    }



  }


  loadComponent(tab: any, showButton = true) {
    this.componentContainer.clear();

    let componentType;

    switch (tab.heading) {
      case 'ID CARD':
        componentType = EmployeeIdCardComponent;
        break;
      case 'ATTENDANCE POLICY':
        componentType = EmployeeAttendancePolicyComponent;
        break;
      case 'WEEKOFF POLICY':
        componentType = EmployeeWeekoffPolicyComponent;
        break;
      case 'HOLIDAY POLICY':
        componentType = EmployeeHolidayPolicyComponent;
        break;
      case 'SHORT LEAVE POLICY':
        this.api.addButtonValue(showButton);componentType = ListEmpShortLeavePolicyComponent;
        break;
      case 'ATTENDANCE BONUS POLICY':
        componentType = EmployeeAttendanceBonusPolicyComponent;
        break;
      case 'FOOD ALLOWANCE POLICY':
        componentType = EmployeeFoodAllowancePolicyComponent;
        break;
      default:
        componentType = '';
        // Handle other tabs as needed
        break;
    }

    if (componentType) {
      const componentRef = this.componentContainer.createComponent(componentType);
    }
  }

  navigateToAddressPage() {
    this.router.navigate(['address'], { relativeTo: this.activatedRoute });
  }

  navigateToExperiencePage() {
    this.router.navigate(['experience'], { relativeTo: this.activatedRoute });
  }
  
  navigateToEducationPage() {
    this.router.navigate(['education'], { relativeTo: this.activatedRoute });
  }
  
  navigateToFamilyPage() {
    this.router.navigate(['family'], { relativeTo: this.activatedRoute });
  }
  
  navigateToReportsToPage() {
    this.router.navigate(['reportsTo'], { relativeTo: this.activatedRoute });
  }
  
  navigateToBranchPage() {
    this.router.navigate(['branch'], { relativeTo: this.activatedRoute });
  }
  
  navigateToDepartmentPage() {
    this.router.navigate(['department'], { relativeTo: this.activatedRoute });
  }
  
  navigateToDesignationPage() {
    this.router.navigate(['designation'], { relativeTo: this.activatedRoute });
  }
  
  navigateToShiftPage() {
    this.router.navigate(['shift'], { relativeTo: this.activatedRoute });
  }
  
  navigateToCompanyDocumentPage() {
    this.router.navigate(['company-document'], { relativeTo: this.activatedRoute });
  }
  
  navigateToEmployeeDocumentPage() {
    this.router.navigate(['employee-document'], { relativeTo: this.activatedRoute });
  }
  
  navigateToAttendancePolicyPage() {
    this.router.navigate(['attendance-policy'], { relativeTo: this.activatedRoute });
  }
  
  navigateToWeekoffPolicyPage() {
    this.router.navigate(['weekoff-policy'], { relativeTo: this.activatedRoute });
  }
  
  navigateToHolidayPolicyPage() {
    this.router.navigate(['holiday-policy'], { relativeTo: this.activatedRoute });
  }
  
  navigateToShortLeavePolicyPage() {
    this.router.navigate(['short-leave-policy'], { relativeTo: this.activatedRoute });
  }
  
  navigateToAttendanceBonusPolicyPage() {
    this.router.navigate(['attendance-bonus-policy'], { relativeTo: this.activatedRoute });
  }
  
  navigateToFoodAllowancePolicyPage() {
    this.router.navigate(['food-allowance-policy'], { relativeTo: this.activatedRoute });
  }
  
  navigateToIdCardPage() {
    this.router.navigate(['idcard'], { relativeTo: this.activatedRoute });
  }
  
  navigateToAnonymousFeedbackPage() {
    this.router.navigate(['anonymous-feedback'], { relativeTo: this.activatedRoute });
  }
}
