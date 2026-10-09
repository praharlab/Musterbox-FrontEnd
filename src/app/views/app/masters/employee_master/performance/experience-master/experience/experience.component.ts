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
    selector: 'app-experience',
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExperienceComponent implements OnInit {
  @ViewChild('addcomp2') addcomp2: NgForm;
  @ViewChild('closeModal2') closeModal2: ElementRef;
  @ViewChild('closeModalexpedit') closeModalexpedit: ElementRef;
  @ViewChild('editcomp2') editcomp2: NgForm;
  values1 = [];
  rows1: any = [];
  ipAddress: any
  minDate: any;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  editUserExperience: any;
  responsibilities: any = [];

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
    this.experiancedata()
  }

  add() {
    this.values1 = [];
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

  addvalue() {
    this.values1.push({ value: '' });
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

  setrespo(item: any) {
    this.responsibilities = item;
  }

  removevalue(i) {
    this.values1.splice(i, 1);
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

  selectStartDate(date){
    this.minDate = new Date(date.target.value).toISOString().split('T')[0];
  }

}
