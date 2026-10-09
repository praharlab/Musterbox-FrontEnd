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
    selector: 'app-add-service-charge',
    templateUrl: './add-service-charge.component.html',
    styleUrls: ['./add-service-charge.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddServiceChargeComponent implements OnInit {
  @ViewChild('addservicecharge') addservicecharge: NgForm;

  company_id: any;
  allcomp: any;
  company: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  allContractor: any[];
  selectedContractor: any;
  slabsArray: any[] = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.getcompany();
    this.formValue = this.formValueStorageService.getData();
    this.addValue();
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
  }

  selectcompany(id: any) {
    this.allContractor = [];
    this.selectedContractor = '';

    if (!id) return;
    this.spinner.start('contractor');
    this.api
      .callApi(this.constant.GETALLDATA + `?companyMasterID=${id}`, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allContractor = res.data;
        this.spinner.stop('contractor');
      });
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
          this.allcomp = res.data;

          this.spinner.stop();
        }
      });
  }

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
      contractorId: this.selectedContractor,
      applicableYYYYMM: this.addservicecharge.value.YearMM.replace('-', ''),
      slabData: finalSlabs,
    };


    this.spinner.start('add');
    this.api.callApi(this.constant.ADDSERVICECHRGES, body, 'POST', true, true, true).subscribe(
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
