import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-family',
    templateUrl: './family.component.html',
    styleUrls: ['./family.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FamilyComponent implements OnInit {
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('editcompfam') editcompfam: NgForm;
  @ViewChild('closeModalfam') closeModalfam: ElementRef;

  PercentCheckEdit: any;
  rows2: any = []
  PercentTotal = 0;
  ipAddress: any
  PercentCheck: any;
  PercentArr: any = [];
  editbyidfam: any;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  MIN: any;
  MAX: any;
  temp: any[];
  page = {
    totalCount: 0,
    offset: 0,
  };
  EditPercentCheck: any;
  EditPercentValue: any;

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
    this.familydata()
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

      selectPercentEdit(event) {
        this.PercentCheckEdit = event.target.value;
        this.EditPercentCheck = event.target.value;
      }
}
