import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-id-card',
    templateUrl: './list-id-card.component.html',
    styleUrls: ['./list-id-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListIdCardComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;

  temp = [];
  limit = 10;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  radiostatus: any = 'portrait';
  page = {
    totalCount: 0,
    offset: 0,
  };

  apiURL = environment.apiUrl;
  idCardDataArray: any;
  companyData: any = [];
  branchData: any;
  body = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    idCardType: 'portraitIdCard',
    orderBy: ''
  };
  defaultCompany: number;
  idCardForAsopalav: boolean = false;
  orderByValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
    this.orderByValue = 'displayName'
    this.getcompany();
    this.defaultCompany = +localStorage.getItem('company_id');

    if (this.defaultCompany == 277 || this.defaultCompany == 300) {
      this.idCardForAsopalav = true;
    } else {
      this.idCardForAsopalav = false;
    }

    this.body.companyMasterID = localStorage.getItem('company_id');
    this.body.orderBy = this.orderByValue
    this.getIdCardData();
    this.selectcompany(this.defaultCompany);
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
          this.companyData = res.data;
          this.spinner.stop();
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.page;
      this.getIdCardData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getIdCardData();
    } else {
      console.log('error');
    }
  }

  selectcompany(id) {
    if (!id) {
      return;
    } else {
      this.spinner.start();
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.branchData = res;
          this.spinner.stop();
        });
    }
  }

  getIdCardData() {
    switch (this.radiostatus) {
      case 'portrait':
        switch (this.defaultCompany) {
          case 277:
          case 298:
          case 300:
            this.body.idCardType = 'portraitIdCardForAsoplav';
            break;
          default:
            this.body.idCardType = 'portraitIdCard';
            break;
        }
        break;
      default:
        switch (this.defaultCompany) {
          case 277:
          case 298:
          case 300:
            this.body.idCardType = 'landscapeIdCardForAsoplav';
            break;
          default:
            this.body.idCardType = 'landscapeIdCard';
            break;
        }
        break;
    }

    this.spinner.start('start');
    this.api.callApi(this.constant.IDCARDDETAILS, this.body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.idCardDataArray = 'data:application/pdf;base64,' + res.data;
          // this.temp = [...this.idCardDataArray];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('start');
        }
      },
      (err) => {
        this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('start');
      },
    );
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.body.companyMasterID = this.datefilter.value.company;
    if (this.datefilter.value.branch) {
      this.body.branchMasterID = this.datefilter.value.branch;
    }

    this.body.orderBy = this.orderByValue

    this.getIdCardData();
  }

  clear() {
    this.datefilter.resetForm();
    this.idCardDataArray = '';
    this.body = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: '',
      idCardType: 'portraitIdCard',
      orderBy: this.orderByValue
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    setTimeout(() => {
      this.radiostatus = 'portrait';
      this.ngOnInit();
    }, 200);
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.idCardDataArray;
    this.downloadPdf(base64String, 'idCards');
  }




  onClickDownloadZIP() {


    switch (this.radiostatus) {
      case 'portrait':
        switch (this.defaultCompany) {
          case 277:
          case 298:
          case 300:
            this.body.idCardType = 'portraitIdCardForAsoplavBulkDownload';
            break;
          default:
            this.body.idCardType = 'portraitIdCardForBulkDownload';
            break;
        }
    }


    this.spinner.start('id');
    this.api
      .callApi(this.constant.IDCARDDETAILS, this.body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.notifications.create('No data found to export!', '', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('id');
        } else {
          var blob = new Blob([res], { type: 'text/zip' });
          saveAs(blob, `ID Cards.zip`);

          this.spinner.stop('id');
        }
      },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('id');
        },);

  }
}
