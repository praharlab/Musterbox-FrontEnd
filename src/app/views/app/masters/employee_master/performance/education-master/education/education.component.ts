import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EducationComponent implements OnInit {
  @ViewChild('addcomp3') addcomp3: NgForm;
  @ViewChild('closeModal3') closeModal3: ElementRef;
  @ViewChild('editcompedu') editcompedu: NgForm;
  @ViewChild('closeModaledu') closeModaledu: ElementRef;

  rows3: any = [];
  certificate: any;
  ipAddress: any
  editbyidedu: any;
  apiURL = environment.apiUrl;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };

  url: string | ArrayBuffer;

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
    this.educationdata()
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

    view(degree: any) {
      window.open(this.apiURL + 'uploads/user/degree/' + degree, '_blank');
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

}
