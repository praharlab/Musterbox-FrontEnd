import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  TemplateRef,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';


var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';
Size.whitelist = [
  '8px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '44px',
  '46px',
  '48px',
  '50px',
];
Quill.register(Size, true);

let Font = Quill.import('formats/font');
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial', 'calibri'];
Quill.register(Font, true);
@Component({
    selector: 'app-list-employee-letter',
    templateUrl: './list-employee-letter.component.html',
    styleUrls: ['./list-employee-letter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeLetterComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('generateLetter') generateLetter: NgForm;
  @ViewChild('generateLetter1') generateLetter1: NgForm;
  @ViewChild('generateLetter2') generateLetter2: NgForm;
  @ViewChild('generateLetter3') generateLetter3: NgForm;
  @ViewChild('generateLetter4') generateLetter4: NgForm;
  @ViewChild('generateLetter5') generateLetter5: NgForm;


  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalJ') closeModalJ: ElementRef;
  @ViewChild('closeModalI') closeModalI: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('closeModalE') closeModalE: ElementRef;
  @ViewChild('closeModalT') closeModalT: ElementRef;
  @ViewChild('closeModalA') closeModalA: ElementRef;

  rows: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  file: any;
  format: any;
  url: any;
  selected = [];
  scrollBarHorizontal = window.innerWidth < 1201;

  ipAddress: any;
  modalRef: BsModalRef;

  editbyid: any;
  html_Content: any;

  permissioncreate: any = [];
  permissiondelete: any = [];
  permissionedit: any = [];
  userData: any;
  allOfferletter: any;
  label: any;
  offerLetterID: any;
  formValue: any;
  allJoiningletter: any;
  joiningLetterID: any;
  allincrementletter: any;
  incrementLetterID: any;
  experienceLetterID: any;
  allExperienceletter: any;
  allterminationletter: any;
  userincrementLetterID: any;
  terminationLetterID: any;
  allappointmentletter: any;
  appointmentLetterID: any;
  letters: any[] = [];
  getStaructureName: any;
  Oldsalary: any;
  Newsalary: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.checkpermission();
  }

  addIncrementCard() {
    this.rows.push({
      label: 'Increment Letter', path
        :
        ""
    });
  }

  sendmail(type) {
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.spinner.start();
    if (type == 'Offer Letter') {
      this.api
        .callApi(this.constant.OFFERLETTEREMAIL, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          } else {
            this.notifications.create('', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          }
        });
    } else if (type == 'Joining Letter') {
      this.api
        .callApi(this.constant.JOININGEMAIL, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
          }
          else {
            this.notifications.create('', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          }
          this.spinner.stop();
        }, (error) => {
          console.error("Error from JOININGEMAIL API:", error); // Log any errors
          this.spinner.stop();
        });
    } else if (type == 'Experience Letter') {
      this.api
        .callApi(this.constant.EXPERIENCEMAIL, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
          }
          else {
            this.notifications.create('', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          }
          this.spinner.stop();
        }, (error) => {
          this.spinner.stop();
        });
    } else if (type == 'Termination Letter') {
      this.api
        .callApi(this.constant.TERNINATIONEMAIL, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
          }
          else {
            this.notifications.create('', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          }
          this.spinner.stop();
        }, (error) => {
          this.spinner.stop();
        });
    } else if (type == 'Appointment Letter') {
      this.api
        .callApi(this.constant.APPIONTMENTEMAIL, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
          } else {
            this.notifications.create('', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          }
          this.spinner.stop();
        }, (error) => {
          this.spinner.stop();
        });
    }
  }

  sendmail1(userincrementLetterID: any) {
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      companyMasterID: localStorage.getItem('company_id'),
      userincrementLetterID: userincrementLetterID,
    };
    this.spinner.start('abc')
    this.api
      .callApi(this.constant.INCREMENTEMAIL, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outlint primary',
            timeout: 3000,
            showProgressBar: true,
          });
        }
        else {
          this.notifications.create('', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.spinner.stop();
        }
        this.spinner.stop('abc');
      }, (error) => {
        console.log("Error From Increment Letter API:", error);

        this.spinner.stop('abc');
      })
  }

  addNewCard() {
    const newCard = {
      label: 'Increment Letter',
    };

    this.rows.push(newCard);
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignLetter' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignLetter' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignLetter' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.spinner.stop();
        }
      });

  }

  getAllLetter(label: any) {

    let userid = this.formValue.ListEmployeeMasterComponent.id;

    this.spinner.start('view');
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop('view');
          this.userData = res.data;
          let filterData = {
            companyMasterID: this.userData.companyMasterId,
          };

          if (label == 'Offer Letter') {
            this.spinner.start('offerletter');
            this.api
              .callApi(this.constant.GETOFFERLETTER, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.allOfferletter = res.data;
                }
                this.spinner.stop('offerletter');
              });
          }
          else if (label == 'Joining Letter') {
            this.spinner.start('jmain');
            this.api
              .callApi(this.constant.GETJOININGLETTER, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.allJoiningletter = res.data;
                }
                this.spinner.stop('jmain');
              });
          }
          else if (label == 'Experience Letter') {
            this.spinner.start('exper');

            this.api
              .callApi(this.constant.GETEXPEROENCELETTER, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.allExperienceletter = res.data;
                }
                this.spinner.stop('exper');
              });
          }

          else if (label == 'Increment Letter') {
            this.spinner.start('increment');

            this.api
              .callApi(this.constant.GETINCREMENTLETTER, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.allincrementletter = res.data;
                }
                this.spinner.stop('increment');
              });
            let body2 = {
              userMasterID: this.formValue.ListEmployeeMasterComponent.id,
            };
            this.spinner.start('getData');
            this.api
              .callApi(this.constant.GETSALARYSTARUCTURENAME, body2, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.getStaructureName = res.data;
                }
                this.spinner.stop('getData');
              },
                (err) => {
                  this.handleError(err.error.message);
                  this.spinner.stop('getData');
                });

          }

          else if (label == 'Termination Letter') {
            this.spinner.start('termination');

            this.api
              .callApi(this.constant.GETTERMINATIONLETTER, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.allterminationletter = res.data;
                }
                this.spinner.stop('termination');
              });
          }

          else if (label == 'Appointment Letter') {
            this.spinner.start('appointmemnt');
            this.api
              .callApi(this.constant.GETAPPOINMENTLETTER, filterData, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  this.allappointmentletter = res.data;
                }
                this.spinner.stop('appointmemnt');
              });
          }

        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('main');
        },
      );
  }


  alldata() {
    let body1 = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
    };

    this.spinner.start();

    this.api.callApi(this.constant.GETALLLETTERS, body1, 'POST', true, false, true).subscribe((res1: any) => {
      if (res1.status === 200) {
        this.rows = res1.data;

        this.api.callApi(this.constant.GETALLUSERINCREMENT, body1, 'POST', true, false, true).subscribe((res2: any) => {
          if (res2.status === 200) {

            this.rows = this.rows.concat(res2.data);

            this.userincrementLetterID = res2.data.userincrementLetterID;

          } else {
            console.error("GETALLUSERINCREMENT API call failed:", res2.message);
          }
          this.spinner.stop();
        }, (error) => {

          this.spinner.stop();
        });
        // let body2 = {
        //   userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        // };
        // this.spinner.start('getData');
        // this.api
        //   .callApi(this.constant.GETSALARYSTARUCTURENAME, body2, 'POST', true, false, true)
        //   .subscribe((res: any) => {
        //     if (res.status == 200) {
        //       this.getStaructureName = res.data;
        //     }
        //     this.spinner.stop('getData');
        //   },
        //     (err) => {
        //       this.handleError(err.error.message);
        //       this.spinner.stop('getData');
        //     });


      } else {
        console.error("GETALLLETTERS API CALL FAILED:", res1.message);
        this.spinner.stop();
      }
    }, (error) => {
      console.error("Error in GETALLLETTERS API call", error);
      this.spinner.stop();
    });
  }

  view(path: any) {
    window.open(this.apiURL + 'uploads/letter/' + path, '_blank');
  }


  generate(label: any) {
    this.label = label;
    this.getAllLetter(this.label)
  }



  editLetter(item: any) {
    this.html_Content = item.htmlContent;
    this.offerLetterID = item.offerLetterID
    this.joiningLetterID = item.joiningLetterID
    this.incrementLetterID = item.incrementLetterID

    this.experienceLetterID = item.experienceLetterID;
    this.userincrementLetterID = item.userincrementLetterID;
    this.terminationLetterID = item.terminationLetterID;
    this.appointmentLetterID = item.appointmentLetterID;
    this.Oldsalary = item.oldSalaryStructure;
    this.Newsalary = item.newSalaryStructure;

    if (item.label === 'Offer Letter') {
      this.label = 'Offer Letter';
    } else if (item.label === 'Joining Letter') {
      this.label = 'Joining Letter';
    } else if (item.label === 'Experience Letter') {
      this.label = 'Experience Letter';
    } else if (item.label === 'Increment Letter') {
      this.label = 'Increment Letter';
    } else if (item.label === 'Termination Letter') {
      this.label = 'Termination Letter';
    } else if (item.label === 'Appointment Letter') {
      this.label = 'Appointment Letter';
    } else {
      this.label = '';
    }
  }


  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

  onSubmit() {
    if (this.label == 'Offer Letter') {
      if (!this.generateLetter.value.offerLetterList) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'offerletter',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        offerLetterID: this.generateLetter.value.offerLetterList
      };
      this.spinner.start('generate');
      this.api
        .callApi(this.constant.ADDLETTERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.alldata();
            this.closeModal.nativeElement.click();
            this.generateLetter.resetForm();
            this.spinner.stop('generate');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('generate');
          }
        });
    } else if (this.label == 'Joining Letter') {
      if (!this.generateLetter1.value.joiningLetterList) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'joiningletter',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        joiningLetterID: this.generateLetter1.value.joiningLetterList
      };
      this.spinner.start('generate');
      this.api
        .callApi(this.constant.ADDLETTERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.alldata();
            this.closeModalJ.nativeElement.click();
            this.generateLetter1.resetForm();
            this.spinner.stop('generate');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('generate');
          }
        });
    } else if (this.label == 'Experience Letter') {
      if (!this.generateLetter2.value.experienceLetterList) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'experienceletter',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        experienceLetterID: this.generateLetter2.value.experienceLetterList,
      };
      this.spinner.start('generate');
      this.api
        .callApi(this.constant.ADDLETTERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.alldata();
            this.closeModalE.nativeElement.click();
            this.generateLetter2.resetForm();
            this.spinner.stop('generate');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('generate');
          }
        });
    } else if (this.label == 'Increment Letter') {
      if (!this.generateLetter3.value.incrementLetterList) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'incrementletter',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        incrementLetterID: this.generateLetter3.value.incrementLetterList,
        oldSalaryStructure: this.generateLetter3.value.oldCTC,
        newSalaryStructure: this.generateLetter3.value.newCTC,
      };

      this.spinner.start('generate');
      this.api
        .callApi(this.constant.ADDUSERINCREMENTLETTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.alldata();
            this.closeModalI.nativeElement.click();
            this.generateLetter3.resetForm();
            this.spinner.stop('generate');
          } else {
            this.notifications.create('Validation', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('generate');
          }
        });
    } else if (this.label == 'Termination Letter') {
      if (!this.generateLetter4.value.terminationLetterList) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'terminationletter',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        terminationLetterID: this.generateLetter4.value.terminationLetterList,
      };
      this.spinner.start('generate');
      this.api
        .callApi(this.constant.ADDLETTERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.alldata();
            this.closeModalT.nativeElement.click();
            this.generateLetter2.resetForm();
            this.spinner.stop('generate');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('generate');
          }
        });
    } else if (this.label == 'Appointment Letter') {
      if (!this.generateLetter5.value.appointmentLetterList) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'appointmentletter',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        appointmentLetterID: this.generateLetter5.value.appointmentLetterList,
      };

      this.spinner.start('generate');
      this.api
        .callApi(this.constant.ADDLETTERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.alldata();
            this.closeModalA.nativeElement.click();
            this.generateLetter5.resetForm();
            this.spinner.stop('generate');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('generate');
          }
        });
    }
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  alertConfirmation1(userincrementLetterID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body2 = {
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
          userincrementLetterID: userincrementLetterID,
          // label: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETEUSERINCREMENT, body2, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.ngOnInit();
            this.spinner.stop();
          },
          (err) => {
            this.notifications.create('Error', err.error.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          },
        );
      }
    });
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
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
          label: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETEUSERLETTER, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.ngOnInit();
            this.spinner.stop();
          },
          (err) => {
            this.notifications.create('Error', err.error.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          },
        );
      }
    });
  }


  onSubmit1() {
    if (this.label == 'Offer Letter') {
      if (!this.offerLetterID) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'offerletter',
        offerletterHTML: this.html_Content,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        offerLetterID: this.offerLetterID
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.UPDATEUSERLETTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();

            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        });
    } else if (this.label == 'Joining Letter') {
      if (!this.joiningLetterID) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'joiningletter',
        joiningletterHTML: this.html_Content,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        joiningLetterID: this.joiningLetterID
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.UPDATEUSERLETTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();

            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        });
    } else if (this.label == 'Experience Letter') {
      if (!this.experienceLetterID) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'experienceletter',
        experienceletterHTML: this.html_Content,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        experienceLetterID: this.experienceLetterID
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.UPDATEUSERLETTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();

            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        });
    } else if (this.label == 'Increment Letter') {
      if (!this.incrementLetterID) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'incrementletter',
        incrementletterHTML: this.html_Content,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        incrementLetterID: this.incrementLetterID,
        userincrementLetterID: this.userincrementLetterID,
        oldSalaryStructure: this.Oldsalary,
        newSalaryStructure: this.Newsalary,
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.UPDATEUSERINCREMENT, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();

            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        });
    } else if (this.label == 'Termination Letter') {
      if (!this.terminationLetterID) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'terminationletter',
        terminationletterHTML: this.html_Content,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        terminationLetterID: this.terminationLetterID,
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.UPDATEUSERLETTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();

            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        });
    } else if (this.label == 'Appointment Letter') {
      if (!this.appointmentLetterID) return;
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        lettertype: 'appointmentletter',
        appointmentletterHTML: this.html_Content,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        appointmentLetterID: this.appointmentLetterID,
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.UPDATEUSERLETTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();

            this.spinner.stop();
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
  }
}

