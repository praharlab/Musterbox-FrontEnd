import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-ticket',
    templateUrl: './add-ticket.component.html',
    styleUrls: ['./add-ticket.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTicketComponent implements OnInit {
  @ViewChild('addTicket') addTicket: NgForm;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  ticketCategory: any = [];
  ticketSubCategory: any = [];
  file: any;
  file1: any = '';
  url: any;
  images: any = [];
  adminRoot = environment.adminRoot;
  selectedTicketSubcategory: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.getTicketCategory();
  }

  getTicketCategory() {
    this.spinner.start();

    this.api.callApi(this.constant.GETALLTICKETCATEGORY, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.ticketCategory = res.data;

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

  selectTicketCategory(id: any) {
    this.ticketSubCategory = [];
    this.selectedTicketSubcategory = '';
    if (id) {
      this.spinner.start();
      this.api
        .callApi(
          this.constant.GETALLTICKETSUBCATEGORY + '?ticketCategoryId=' + id,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          this.ticketSubCategory = res.data;
          this.spinner.stop();
        });
    }
  }

  onFileChange(event) {
    this.images = [];
    // if (event.target.files && event.target.files[0]) {
    //     var filesAmount = event.target.files.length;
    //     for (let i = 0; i < filesAmount; i++) {
    //             var reader = new FileReader();
    //             this.images.push(event.target.files[i]);
    //             reader.readAsDataURL(event.target.files[i]);
    //     }
    // }

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      const allowedExtensions = ['.png', '.jpeg', '.jpg', 'mp4'];
      const fileExtension = this.file.name
        .toLowerCase()
        .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2);
      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      if (allowedExtensions.includes('.' + fileExtension) && this.file.size <= maxSizeInBytes) {
        // var reader = new FileReader();
        // reader.readAsDataURL(this.file);
        // reader.onload = (event) => {
        //   this.url = (<FileReader>event.target).result;
        // };

        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          this.images.push(event.target.files[i]);
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        if (!allowedExtensions.includes('.' + fileExtension)) {
          this.notifications.create(
            'Invalid file type.',
            'Please select JPEG, JPG, Mp4 file.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.file1 = '';
        } else {
          this.notifications.create(
            'File size exceeds .',
            'the maximum limit of 10 MB.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.file1 = '';
        }
      }
    }
  }

  onSubmit() {
    if (!this.addTicket.valid) {
      return;
    }

    const formData = new FormData();
    if (this.images.length != 0) {
      for (var i = 0; i < this.images.length; i++) {
        formData.append('attachments', this.images[i]);
      }
    }

    formData.append('title', this.addTicket.value.title);
    formData.append('description', this.addTicket.value.description);
    formData.append('ticketCategoryId', this.addTicket.value.ticketCategoryID);
    formData.append('ticketSubCategoryId', this.addTicket.value.ticketSubCategoryId);

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATETICKET, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.notifications.create('Done', res.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });
        setTimeout(() => {
          this.router.navigate([this.adminRoot + '/tickets/listTicket']);

          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
        }, 3000);
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('start');
      },
    );
  }
}
