import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-service-charge',
    templateUrl: './edit-service-charge.component.html',
    styleUrls: ['./edit-service-charge.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditServiceChargeComponent implements OnInit {
  @ViewChild('addservicecharge') addservicecharge: NgForm;

  company_id: any;
  allcomp: any;
  // childcompany: any;
  company: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  allContractor: any[];
  selectedContractor: any;
  slabsArray: any[] = [];
  serviceChargeData: any;
  companyName: any;
  contractorName: any;
  applicableMonth: string;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    // this.childcompany = localStorage.getItem('childcompany');
    // this.getcompany();
    this.formValue = this.formValueStorageService.getData();
    // this.addValue();

    this.editdata();
  }

  editdata() {
    const id = this.formValue.ListServiceChargeComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETSERVICECHRGESBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.serviceChargeData = res.data;
            this.companyName = this.serviceChargeData.contractor?.companyMaster?.companyName || '';
            this.contractorName = this.serviceChargeData.contractor?.contractorName || '';
            this.applicableMonth =
              String(this.serviceChargeData.applicableYYYYMM).slice(0, 4) +
              '-' +
              String(this.serviceChargeData.applicableYYYYMM).slice(4, 6);

            this.slabsArray = [...this.serviceChargeData.serviceChargeSlabs].map((e) => {
              return {
                fromDays: e.fromDays,
                toDays: e.toDays,
                skilledRate: e.skilledRate,
                semiskilledRate: e.semiskilledRate,
                unskilledRate: e.unskilledRate,
                isDeleted: false,
              };
            });
          }

          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  addValue() {
    this.slabsArray.push({
      fromDays: null,
      toDays: null,
      skilledRate: null,
      semiskilledRate: null,
      unskilledRate: null,
      isDeleted: false,
    });
  }

  removeValues(i: any) {
    this.slabsArray[i].isDeleted = true;
    // this.slabsArray[i]['delete'] = true;
  }

  // selectcompany(id: any) {
  //   this.allContractor = [];
  //   this.selectedContractor = '';

  //   if (!id) return;
  //   this.spinner.start('contractor');
  //   this.api
  //     .callApi(this.constant.GETALLDATA + `?companyMasterID=${id}`, {}, 'GET', true, false, true)
  //     .subscribe((res: any) => {
  //       this.allContractor = res.data;
  //       this.spinner.stop('contractor');
  //     });
  // }

  // getcompany() {
  //   const body = {
  //     companyMasterID: localStorage.getItem('company_id'),
  //   };
  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.allcomp = res.data;

  //         this.spinner.stop();
  //       }
  //     });
  // }

  hasOverlappingRanges(slabs: any[]): boolean {
    slabs.sort((a, b) => a.fromDays - b.fromDays);

    for (let i = 0; i < slabs.length - 1; i++) {
      if (slabs[i].toDays >= slabs[i + 1].fromDays) {
        return true; // Overlapping found
      }
    }
    return false;
  }

  onSubmit() {
    if (!this.addservicecharge.valid) {
      return;
    }

    const finalSlabs = this.slabsArray
      .filter((e) => !e.isDeleted)
      .map(({ isDeleted, ...rest }) => rest);

    finalSlabs.sort((a, b) => a.fromDays - b.fromDays);

    if (this.hasOverlappingRanges(finalSlabs)) {
      return this.notifications.create('Error', 'Date ranges overlap!', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }

    const body = {
      applicableYYYYMM: this.applicableMonth.replace('-', ''),
      slabData: finalSlabs,
    };

    this.spinner.start('add');
    this.api.callApi(this.constant.UPDATESERVICECHRGES + this.formValue.ListServiceChargeComponent.id, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/service_charge']);

            this.spinner.stop('add');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('add');
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
}
